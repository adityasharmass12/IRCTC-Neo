\
\
\
\
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import PassengerProfile, StationAlias, HistoricalWaitlistData


class RegisterSerializer(serializers.Serializer):
\
\
\
    username = serializers.CharField(
        min_length=3,
        max_length=150,
        help_text="Required. 3–150 characters.",
    )
    email = serializers.EmailField(
        required=True,
        help_text="A valid email address.",
    )
    password = serializers.CharField(
        min_length=8,
        write_only=True,
        help_text="Must be at least 8 characters.",
    )
    password_confirm = serializers.CharField(
        write_only=True,
        help_text="Must match the password field.",
    )
    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value
    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value
    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return data
    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )


class PassengerProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for PassengerProfile model.
    Used for saving/retrieving passenger information for quick form pre-fill.
    """
    class Meta:
        model = PassengerProfile
        fields = [
            'id', 'user', 'first_name', 'last_name', 'email', 'phone',
            'id_type', 'id_number', 'date_of_birth', 'gender',
            'preferred_class', 'has_accessibility_needs',
            'accessibility_requirements', 'is_primary', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_phone(self, value):
        """Validate Indian phone number (10 digits)."""
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Phone number must be exactly 10 digits.")
        return value
    
    def validate_date_of_birth(self, value):
        """Ensure passenger is at least 5 years old."""
        from datetime import date
        if value:
            age = (date.today() - value).days / 365.25
            if age < 5:
                raise serializers.ValidationError("Passenger must be at least 5 years old.")
        return value


class StationAliasSerializer(serializers.ModelSerializer):
    """
    Serializer for StationAlias model.
    Returns alias mappings for smart station autocomplete.
    """
    class Meta:
        model = StationAlias
        fields = [
            'id', 'station_code', 'station_name', 'alias_name',
            'alias_type', 'language', 'confidence_score', 'is_active'
        ]
        read_only_fields = ['id']
    
    def to_representation(self, instance):
        """Custom output format for frontend autocomplete."""
        data = super().to_representation(instance)
        return {
            'code': data['station_code'],
            'name': data['station_name'],
            'alias': data['alias_name'],
            'confidence': data['confidence_score'],
            'type': data['alias_type'],
        }


class HistoricalWaitlistDataSerializer(serializers.ModelSerializer):
    """
    Serializer for HistoricalWaitlistData model.
    Returns waitlist confirmation probability for UI badges.
    """
    confirmation_percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = HistoricalWaitlistData
        fields = [
            'id', 'train_code', 'train_name', 'from_station', 'to_station',
            'coach_class', 'quota', 'confirmation_probability',
            'confirmation_percentage', 'average_days_to_confirm',
            'day_of_week', 'is_peak_season', 'confidence_level',
            'sample_size', 'last_updated'
        ]
        read_only_fields = ['id', 'confirmation_probability', 'last_updated']
    
    def get_confirmation_percentage(self, obj):
        """Returns human-readable percentage string."""
        percentage = int(obj.confirmation_probability * 100)
        return f"{percentage}%"
    
    def to_representation(self, instance):
        """
        Custom format for badge display in search results.
        Example: {"percentage": 78, "confidence": "HIGH", "message": "78% chance of confirmation"}
        """
        data = super().to_representation(instance)
        return {
            'train': data['train_code'],
            'percentage': int(instance.confirmation_probability * 100),
            'confidence': data['confidence_level'],
            'message': f"{data['confirmation_percentage']} Chance of Confirmation",
            'daysToConfirm': data['average_days_to_confirm'],
            'sample': data['sample_size'],
        }

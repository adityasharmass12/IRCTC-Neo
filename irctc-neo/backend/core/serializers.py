\
\
\
\
from django.contrib.auth.models import User
from rest_framework import serializers
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

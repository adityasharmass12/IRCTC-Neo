from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class PassengerProfile(models.Model):
    """
    Stores passenger information for quick form pre-fill.
    Linked to User for multi-passenger family/group bookings.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='passenger_profiles')
    
    # Core passenger details
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    
    # Identity proof
    id_type = models.CharField(
        max_length=20,
        choices=[
            ('AADHAAR', 'Aadhaar'),
            ('PAN', 'PAN'),
            ('PASSPORT', 'Passport'),
            ('DRIVING_LICENSE', 'Driving License'),
        ],
        default='AADHAAR'
    )
    id_number = models.CharField(max_length=50, unique=True)
    
    # Personal details
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=10,
        choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')],
        default='M'
    )
    
    # Travel preferences
    preferred_class = models.CharField(
        max_length=20,
        choices=[
            ('1A', '1st AC'),
            ('2A', '2nd AC'),
            ('3A', '3rd AC'),
            ('SL', 'Sleeper'),
            ('CC', 'Chair Car'),
        ],
        default='3A'
    )
    
    # Accessibility & Special needs
    has_accessibility_needs = models.BooleanField(default=False)
    accessibility_requirements = models.TextField(blank=True, help_text="e.g., wheelchair access, mobility aid space")
    
    # Metadata
    is_primary = models.BooleanField(default=False, help_text="Primary contact for group bookings")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-is_primary', '-updated_at']
        verbose_name = "Passenger Profile"
        verbose_name_plural = "Passenger Profiles"
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.user.username})"


class StationAlias(models.Model):
    """
    Maps station aliases to canonical station codes.
    Enables search like "Bombay" -> "Mumbai Central (BCT)"
    Supports multi-language aliases and common misspellings.
    """
    # Canonical station identifier
    station_code = models.CharField(max_length=10, db_index=True)
    station_name = models.CharField(max_length=100)
    
    # Alias/alternate name
    alias_name = models.CharField(max_length=100, db_index=True)
    
    # Metadata
    alias_type = models.CharField(
        max_length=50,
        choices=[
            ('HISTORICAL', 'Historical Name (e.g., Bombay→Mumbai)'),
            ('COLLOQUIAL', 'Common/Colloquial Name'),
            ('MISSPELLING', 'Common Misspelling'),
            ('REGIONAL', 'Regional Language Name'),
            ('ABBREVIATION', 'Short Form/Abbreviation'),
        ],
        default='COLLOQUIAL'
    )
    
    # Regional language support
    language = models.CharField(
        max_length=10,
        choices=[
            ('en', 'English'),
            ('hi', 'Hindi'),
            ('ta', 'Tamil'),
            ('te', 'Telugu'),
            ('ka', 'Kannada'),
            ('ml', 'Malayalam'),
            ('mr', 'Marathi'),
            ('gu', 'Gujarati'),
        ],
        default='en'
    )
    
    # Search confidence/relevance
    confidence_score = models.FloatField(
        default=0.95,
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)],
        help_text="Search relevance score (0-1); higher = more relevant"
    )
    
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-confidence_score', 'alias_name']
        verbose_name = "Station Alias"
        verbose_name_plural = "Station Aliases"
        unique_together = ('alias_name', 'language')
        indexes = [
            models.Index(fields=['alias_name', 'is_active']),
            models.Index(fields=['station_code', 'language']),
        ]
    
    def __str__(self):
        return f"{self.alias_name} → {self.station_name} ({self.station_code})"


class HistoricalWaitlistData(models.Model):
    """
    Stores historical waitlist confirmation data for intelligent predictions.
    Used to show "78% Chance of Confirmation" on waitlisted coaches.
    """
    # Train details
    train_code = models.CharField(max_length=10, db_index=True)
    train_name = models.CharField(max_length=100)
    
    # Route  
    from_station = models.CharField(max_length=10, db_index=True)
    to_station = models.CharField(max_length=10, db_index=True)
    
    # Class & Quota combination
    coach_class = models.CharField(
        max_length=20,
        choices=[
            ('1A', '1st AC'),
            ('2A', '2nd AC'),
            ('3A', '3rd AC'),
            ('SL', 'Sleeper'),
            ('CC', 'Chair Car'),
            ('GN', 'General'),
        ]
    )
    quota = models.CharField(
        max_length=20,
        choices=[
            ('GN', 'General'),
            ('LD', 'Ladies'),
            ('HP', 'Handicap'),
            ('YP', 'Youth'),
            ('ST', 'Senior Citizen'),
        ],
        default='GN'
    )
    
    # Historical data
    total_bookings = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Total waitlist bookings analyzed"
    )
    confirmed_bookings = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="How many of those waitlist bookings got confirmed"
    )
    
    # Calculated metrics
    confirmation_probability = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)],
        help_text="P(WL → Confirmed); used for badge display"
    )
    
    average_days_to_confirm = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Avg days from waitlist booking to confirmation"
    )
    
    # Temporal data
    day_of_week = models.CharField(
        max_length=10,
        choices=[
            ('MON', 'Monday'),
            ('TUE', 'Tuesday'),
            ('WED', 'Wednesday'),
            ('THU', 'Thursday'),
            ('FRI', 'Friday'),
            ('SAT', 'Saturday'),
            ('SUN', 'Sunday'),
        ],
        db_index=True,
        help_text="Probability varies by day of week"
    )
    
    is_peak_season = models.BooleanField(
        default=False,
        help_text="True if data from peak travel season (affects probability)"
    )
    
    # Tracking
    sample_size = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        help_text="More data = higher confidence; <30 is unreliable"
    )
    
    confidence_level = models.CharField(
        max_length=20,
        choices=[
            ('LOW', '< 30 samples'),
            ('MEDIUM', '30-100 samples'),
            ('HIGH', '> 100 samples'),
        ],
        default='LOW'
    )
    
    # Versioning & recency
    last_updated = models.DateTimeField(auto_now=True)
    data_period_end = models.DateField(
        help_text="Last date of historical data included"
    )
    
    class Meta:
        ordering = ['-last_updated', 'train_code']
        verbose_name = "Historical Waitlist Data"
        verbose_name_plural = "Historical Waitlist Data"
        unique_together = ('train_code', 'from_station', 'to_station', 'coach_class', 'quota', 'day_of_week')
        indexes = [
            models.Index(fields=['train_code', 'from_station', 'to_station', 'coach_class']),
            models.Index(fields=['confirmation_probability', 'confidence_level']),
        ]
    
    def __str__(self):
        prob_percent = int(self.confirmation_probability * 100)
        return f"{self.train_name} ({self.from_station}→{self.to_station}) {self.coach_class} - {prob_percent}% confirm"
    
    def calculate_display_probability(self):
        """Returns confidence-adjusted probability for UI display."""
        if self.sample_size < 30:
            # Low confidence: show with caveat
            return self.confirmation_probability * 0.8
        elif self.sample_size < 100:
            return self.confirmation_probability * 0.9
        else:
            # High confidence: full value
            return self.confirmation_probability

from django.db import models
from django.conf import settings


class Ride(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='rides',
        null=True,
        blank=True
    )

    customer_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    pickup_location = models.CharField(max_length=200)
    destination = models.CharField(max_length=200)
    ride_type = models.CharField(max_length=50)
    status = models.CharField(max_length=50, default="Requested")

    def __str__(self):
        return f"{self.customer_name} - {self.ride_type}"

class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    profile_image = models.ImageField(
        upload_to='profile_images/',
        default='profile_images/default.png',
        blank=True,
        null=True
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"

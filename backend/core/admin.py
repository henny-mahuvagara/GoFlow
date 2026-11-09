from django.contrib import admin

from .models import Ride
from .models import UserProfile

admin.site.register(UserProfile)
admin.site.register(Ride)
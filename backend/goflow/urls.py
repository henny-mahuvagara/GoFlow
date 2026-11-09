# from django.contrib import admin
# from django.urls import path, include
# import importlib

# try:
#     views = importlib.import_module('core.views')
# except ModuleNotFoundError:
#     views = importlib.import_module('backend.core.views')

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('', include('core.urls')),
#     path('', views.website_home, name='home'),
#     path('rides/', views.rides, name='rides'),
#     path('api/', views.home, name='api-home'),
#     path('create-ride/', views.create_ride, name='create_ride'),
#     path('api/rides/create/',views.create_ride_api,name='create_ride_api'),
# ]

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    
]
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )


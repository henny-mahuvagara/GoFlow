
# from django.urls import path
# from . import views

# urlpatterns = [
#     path('rides/', views.rides, name='rides'),
#     path('rides/<int:ride_id>/edit/', views.update_ride, name='update_ride'),
#     path('rides/<int:ride_id>/delete/', views.delete_ride, name='delete_ride'),
# ]

from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    # Main pages
    path('', views.website_home, name='home'),
    path('create-ride/', views.create_ride, name='create_ride'),
    path('rides/', views.rides, name='rides'),
    path('signup/', views.signup, name='signup'),
    path('profile/', views.profile, name='profile'),
    path(
    'login/',
    auth_views.LoginView.as_view(
        template_name='core/login.html',
        redirect_authenticated_user=False
    ),
    name='login'
),
    path(
    'logout/',
    auth_views.LogoutView.as_view(),
    name='logout'
),

    # Ride CRUD
    path('rides/<int:ride_id>/edit/', views.update_ride, name='update_ride'),
    path('rides/<int:ride_id>/delete/', views.delete_ride, name='delete_ride'),

    # API endpoints
    path('api/', views.home, name='api-home'),
    path('api/rides/create/', views.create_ride_api, name='create_ride_api'),
]

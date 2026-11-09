from django.shortcuts import render
from django.shortcuts import render,redirect, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Ride, UserProfile
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError, transaction
from django.contrib import messages
from PIL import Image, UnidentifiedImageError
from django.core.paginator import Paginator#lab 8 pagination
def website_home(request):
    return render(request, 'core/index.html')


@api_view(['GET'])
def home(_request):
    return Response({
        "project": "GoFlow",
        "domain": "Real-Time Mobility & Delivery Platform",
        "status": "Backend is running",
        "message": "Welcome to GoFlow API"
    })


# @login_required
# def rides(request):
  # rides = Ride.objects.filter(user=request.user).order_by('-id')
    return render(request, 'core/rides.html', {'rides': rides})
@login_required
def rides(request):
    ride_list = Ride.objects.filter(
        user=request.user
    ).order_by('-id')

    paginator = Paginator(ride_list, 5)

    page_number = request.GET.get('page')

    rides = paginator.get_page(page_number)

    return render(
        request,
        'core/rides.html',
        {'rides': rides}
    )

@login_required
@ensure_csrf_cookie
def create_ride(request):
    return render(request, 'core/ride-booking.html')

@login_required
@require_POST
@ensure_csrf_cookie
def create_ride_api(request):
    customer_name = request.POST.get('customer_name', '').strip()
    phone = request.POST.get('phone', '').strip()
    pickup_location = request.POST.get('pickup_location', '').strip()
    destination = request.POST.get('destination', '').strip()
    ride_type = request.POST.get('ride_type', '').strip()

    if not all([
        customer_name,
        phone,
        pickup_location,
        destination,
        ride_type
    ]):
        return JsonResponse({
            'success': False,
            'message': 'Please complete all required fields.'
        }, status=400)

    if not phone.isdigit() or len(phone) != 10:
        return JsonResponse({
            'success': False,
            'message': 'Enter a valid 10-digit phone number.'
        }, status=400)

    if pickup_location.casefold() == destination.casefold():
        return JsonResponse({
            'success': False,
            'message': 'Pickup and destination must be different.'
        }, status=400)

    ride = Ride.objects.create(
        user=request.user,
        customer_name=customer_name,
        phone=phone,
        pickup_location=pickup_location,
        destination=destination,
        ride_type=ride_type,
        status='Requested'
    )

    return JsonResponse({
        'success': True,
        'message': 'Your ride has been booked successfully!',
        'ride_id': ride.pk
    })

# updating a ride
@login_required
def update_ride(request, ride_id):
    ride = get_object_or_404(
    Ride,
    pk=ride_id,
    user=request.user
)

    if request.method == 'POST':
        customer_name = request.POST.get('customer_name', '').strip()
        phone = request.POST.get('phone', '').strip()
        pickup_location = request.POST.get('pickup_location', '').strip()
        destination = request.POST.get('destination', '').strip()
        ride_type = request.POST.get('ride_type', '').strip()
        status = request.POST.get('status', '').strip()

        if not all([
            customer_name, phone, pickup_location,
            destination, ride_type, status
        ]):
            return render(request, 'core/edit_ride.html', {
                'ride': ride,
                'error': 'Please complete all fields.'
            })

        if not phone.isdigit() or len(phone) != 10:
            return render(request, 'core/edit_ride.html', {
                'ride': ride,
                'error': 'Enter a valid 10-digit phone number.'
            })

        if pickup_location.casefold() == destination.casefold():
            return render(request, 'core/edit_ride.html', {
                'ride': ride,
                'error': 'Pickup and destination must be different.'
            })

        ride.customer_name = customer_name
        ride.phone = phone
        ride.pickup_location = pickup_location
        ride.destination = destination
        ride.ride_type = ride_type
        ride.status = status
        ride.save()

        return redirect('rides')

    return render(request, 'core/edit_ride.html', {
        'ride': ride
    })

# deleting a ride
@login_required
@require_POST
def delete_ride(request, ride_id):
    ride = get_object_or_404(
    Ride,
    pk=ride_id,
    user=request.user
)
    ride.delete()
    return redirect('rides')


# def signup(request):
#     if request.method == 'POST':
#         form = UserCreationForm(request.POST)

#         if form.is_valid():
#             user = form.save()
#             login(request, user)
#             return redirect('home')
#     else:
#         form = UserCreationForm()

#     return render(request, 'core/signup.html', {'form': form})

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)

        if form.is_valid():
            try:
                with transaction.atomic():
                    user = form.save()
                    UserProfile.objects.get_or_create(user=user)

                login(request, user)
                return redirect('home')

            except IntegrityError:
                form.add_error(
                    'username',
                    'This username is already taken. Please choose another.'
                )

    else:
        form = UserCreationForm()

    return render(request, 'core/signup.html', {'form': form})


# @login_required
# def profile(request):
#     user_profile, created = UserProfile.objects.get_or_create(
#         user=request.user
#     )

#     if request.method == 'POST':
#         uploaded_image = request.FILES.get('profile_image')

#         if uploaded_image:
#             error = validate_profile_image(uploaded_image)

#             if error:
#                 messages.error(request, error)
#             else:
#                 # Delete previous image if it exists
#                 if user_profile.profile_image and user_profile.profile_image.name != 'profile_images/default.png':
#                     user_profile.profile_image.delete(save=False)

#                 user_profile.profile_image = uploaded_image
#                 user_profile.save()

#                 messages.success(
#                     request,
#                     'Your profile picture has been updated successfully!'
#                 )

#         else:
#             messages.error(request, 'Please select an image to upload.')

#         return redirect('profile')

#     return render(request, 'core/profile.html')
@login_required
def profile(request):
    user_profile, created = UserProfile.objects.get_or_create(
        user=request.user
    )

    if request.method == 'POST':

        # Remove profile image
        if 'remove_image' in request.POST:

            if (
                user_profile.profile_image
                and user_profile.profile_image.name != 'profile_images/default.png'
            ):
                user_profile.profile_image.delete(save=False)

            user_profile.profile_image = None
            user_profile.save()

            messages.success(
                request,
                'Your profile picture has been removed successfully!'
            )

            return redirect('profile')

        # Upload profile image
        uploaded_image = request.FILES.get('profile_image')

        if uploaded_image:
            error = validate_profile_image(uploaded_image)

            if error:
                messages.error(request, error)
            else:
                # Delete previous image if it exists
                if (
                    user_profile.profile_image
                    and user_profile.profile_image.name != 'profile_images/default.png'
                ):
                    user_profile.profile_image.delete(save=False)

                user_profile.profile_image = uploaded_image
                user_profile.save()

                messages.success(
                    request,
                    'Your profile picture has been updated successfully!'
                )

        else:
            messages.error(request, 'Please select an image to upload.')

        return redirect('profile')

    return render(request, 'core/profile.html')

def validate_profile_image(image):
    allowed_formats = ['JPEG', 'PNG']
    max_size = 2 * 1024 * 1024  # 2 MB

    # Check file size
    if image.size > max_size:
        return "Image size must not exceed 2 MB."

    # Check actual image format
    try:
        img = Image.open(image)
        img.verify()

        if img.format not in allowed_formats:
            return "Only JPG, JPEG and PNG images are allowed."

    except (UnidentifiedImageError, OSError, Image.DecompressionBombError):
        return "Please upload a valid image file."

    finally:
        image.seek(0)

    return None
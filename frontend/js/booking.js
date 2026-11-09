document.addEventListener("DOMContentLoaded", function () {
    const rideForm = document.getElementById("rideBookingForm");
    if (!rideForm) return;

    // Form input elements
    const fullNameInput = document.getElementById("fullName");
    const phoneInput = document.getElementById("phone");
    const pickupInput = document.getElementById("pickup");
    const destinationInput = document.getElementById("destination");
    const rideTypeSelect = document.getElementById("rideType");

    // Summary display elements
    const summaryPickup = document.getElementById("summaryPickup");
    const summaryDestination = document.getElementById("summaryDestination");
    const summaryRideType = document.getElementById("summaryRideType");
    const summaryRideDesc = document.getElementById("summaryRideDesc");
    const summaryVehicleIcon = document.getElementById("summaryVehicleIcon");
    const summaryPassenger = document.getElementById("summaryPassenger");
    const summaryContact = document.getElementById("summaryContact");

    // Ride type cards
    const rideTypeCards = document.querySelectorAll(".ride-type-card");

    // Vehicle tier metadata for summary preview
    const vehicleTierMeta = {
        bike: {
            title: "GoBike",
            desc: "Fastest & economical • 1 Seat",
            icon: "bi-bicycle"
        },
        auto: {
            title: "GoAuto",
            desc: "Everyday city transit • 3 Seats",
            icon: "bi-fuel-pump-fill"
        },
        car: {
            title: "GoCar",
            desc: "Air-conditioned comfort • 4 Seats",
            icon: "bi-car-front-fill"
        }
    };

    /**
     * Update the live Ride Summary panel based on current inputs
     */
    function updateSummary() {
        // Pickup summary
        if (summaryPickup && pickupInput) {
            const val = pickupInput.value.trim();
            if (val) {
                summaryPickup.textContent = val;
                summaryPickup.classList.remove("placeholder");
                summaryPickup.classList.add("active");
            } else {
                summaryPickup.textContent = "Where should we pick you up?";
                summaryPickup.classList.add("placeholder");
                summaryPickup.classList.remove("active");
            }
        }

        // Destination summary
        if (summaryDestination && destinationInput) {
            const val = destinationInput.value.trim();
            if (val) {
                summaryDestination.textContent = val;
                summaryDestination.classList.remove("placeholder");
                summaryDestination.classList.add("active");
            } else {
                summaryDestination.textContent = "Where are you going?";
                summaryDestination.classList.add("placeholder");
                summaryDestination.classList.remove("active");
            }
        }

        // Passenger name summary
        if (summaryPassenger && fullNameInput) {
            const val = fullNameInput.value.trim();
            summaryPassenger.textContent = val || "Guest Rider";
        }

        // Passenger contact summary
        if (summaryContact && phoneInput) {
            const val = phoneInput.value.trim();
            summaryContact.textContent = val || "Not provided";
        }

        // Ride type summary
        if (summaryRideType && summaryRideDesc && summaryVehicleIcon && rideTypeSelect) {
            const selectedVal = rideTypeSelect.value;
            if (selectedVal && vehicleTierMeta[selectedVal]) {
                const meta = vehicleTierMeta[selectedVal];
                summaryRideType.textContent = meta.title;
                summaryRideDesc.textContent = meta.desc;
                summaryVehicleIcon.innerHTML = `<i class="bi ${meta.icon}"></i>`;
            } else {
                summaryRideType.textContent = "Select a ride tier";
                summaryRideDesc.textContent = "Choose Bike, Auto, or Car";
                summaryVehicleIcon.innerHTML = `<i class="bi bi-compass"></i>`;
            }
        }
    }

    /**
     * Synchronize card selection with the select element
     */
    function syncCardsWithSelect(value) {
        rideTypeCards.forEach(function (card) {
            const cardVal = card.getAttribute("data-value");
            const isMatch = cardVal === value;
            card.classList.toggle("selected", isMatch);
            card.setAttribute("aria-checked", isMatch ? "true" : "false");
        });
    }

    function resetRideTypeCards() {
        rideTypeCards.forEach(function (card) {
            card.classList.remove("selected");
            card.setAttribute("aria-checked", "false");
        });
    }

    // Attach click and keyboard events to ride type cards
    rideTypeCards.forEach(function (card) {
        function selectThisCard() {
            const value = card.getAttribute("data-value");
            if (rideTypeSelect) {
                rideTypeSelect.value = value;
                // Dispatch change event to trigger existing/dependent listeners
                rideTypeSelect.dispatchEvent(new Event("change", { bubbles: true }));
            }
            syncCardsWithSelect(value);
            updateSummary();

            const rideTypeError = document.getElementById("rideTypeError");
            if (rideTypeError) rideTypeError.textContent = "";
        }

        card.addEventListener("click", selectThisCard);
        card.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                selectThisCard();
            }
        });
    });

    // When native select changes directly (e.g. keyboard navigation, screen reader)
    if (rideTypeSelect) {
        rideTypeSelect.addEventListener("change", function () {
            syncCardsWithSelect(rideTypeSelect.value);
            updateSummary();
            const rideTypeError = document.getElementById("rideTypeError");
            if (rideTypeError && rideTypeSelect.value !== "") {
                rideTypeError.textContent = "";
            }
        });
    }

    // Prevent typing numbers in the full name field
    if (fullNameInput) {
        fullNameInput.addEventListener("input", function () {
            this.value = this.value.replace(/[0-9]/g, '');
        });
    }

    // Live sync inputs to summary on user typing
    [
        { input: fullNameInput, errorId: "nameError" },
        { input: phoneInput, errorId: "phoneError" },
        { input: pickupInput, errorId: "pickupError" },
        { input: destinationInput, errorId: "destinationError" }
    ].forEach(function (field) {
        if (field.input) {
            field.input.addEventListener("input", function () {
                updateSummary();
                const err = document.getElementById(field.errorId);
                if (err && field.input.value.trim() !== "") {
                    err.textContent = "";
                }
            });
        }
    });

    // Form submission validation (Preserves 100% of original logic and messages)
    
    // Read Django's CSRF cookie
    function getCookie(name) {
        const cookies = document.cookie ? document.cookie.split(";") : [];

        for (const cookie of cookies) {
            const trimmedCookie = cookie.trim();

            if (trimmedCookie.startsWith(name + "=")) {
                return decodeURIComponent(
                    trimmedCookie.substring(name.length + 1)
                );
            }
        }

        return null;
    }

    // Submit the booking to Django
    rideForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const fullName = fullNameInput?.value.trim() || "";
        const phone = phoneInput?.value.trim() || "";
        const pickup = pickupInput?.value.trim() || "";
        const destination = destinationInput?.value.trim() || "";
        const rideType = rideTypeSelect?.value || "";

        const errors = {
            name: document.getElementById("nameError"),
            phone: document.getElementById("phoneError"),
            pickup: document.getElementById("pickupError"),
            destination: document.getElementById("destinationError"),
            rideType: document.getElementById("rideTypeError")
        };

        const successMessage = document.getElementById("successMessage");

        Object.values(errors).forEach(function (element) {
            if (element) element.textContent = "";
        });

        if (successMessage) {
            successMessage.textContent = "";
            successMessage.classList.remove("visible");
        }

        let isValid = true;

        if (!/^[a-zA-Z\s]+$/.test(fullName)) {
            if (errors.name) {
                errors.name.textContent = fullName
                    ? "Name can only contain alphabet characters."
                    : "Please enter your full name.";
            }
            isValid = false;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            if (errors.phone) {
                errors.phone.textContent =
                    "Please enter a valid 10-digit phone number.";
            }
            isValid = false;
        }

        if (!pickup) {
            if (errors.pickup) {
                errors.pickup.textContent =
                    "Please enter your pickup location.";
            }
            isValid = false;
        }

        if (!destination) {
            if (errors.destination) {
                errors.destination.textContent =
                    "Please enter your destination.";
            }
            isValid = false;
        }

        if (
            pickup &&
            destination &&
            pickup.toLowerCase() === destination.toLowerCase()
        ) {
            if (errors.destination) {
                errors.destination.textContent =
                    "Pickup and destination cannot be the same.";
            }
            isValid = false;
        }

        if (!rideType || !vehicleTierMeta[rideType]) {
            if (errors.rideType) {
                errors.rideType.textContent =
                    "Please select a ride type.";
            }
            isValid = false;
        }

        if (!isValid) return;

        const submitButton = rideForm.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        if (submitButton) submitButton.disabled = true;

        try {
            const csrfToken = getCookie("csrftoken");

            if (!csrfToken) {
                throw new Error(
                    "Django CSRF token is missing. Please refresh the booking page."
                );
            }

            const formData = new URLSearchParams({
                customer_name: fullName,
                phone: phone,
                pickup_location: pickup,
                destination: destination,
                ride_type: vehicleTierMeta[rideType].title
            });

            const response = await fetch("/api/rides/create/", {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded;charset=UTF-8",
                    "X-CSRFToken": csrfToken
                },
                credentials: "same-origin",
                body: formData.toString()
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to save your ride."
                );
            }

            if (successMessage) {
                successMessage.textContent =
                    "Ride booked successfully! Your ride ID is " +
                    result.ride_id + ".";
                successMessage.classList.add("visible");
            }

            rideForm.reset();
            resetRideTypeCards();
            updateSummary();

            if (window.innerWidth < 768 && successMessage) {
                successMessage.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });
            }
        } catch (error) {
            if (successMessage) {
                successMessage.textContent = error.message;
                successMessage.classList.add("visible");
            } else {
                alert(error.message);
            }
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
});
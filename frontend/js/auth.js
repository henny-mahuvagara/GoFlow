/**
 * GoFlow Authentication & Registration Script
 * Handles password visibility toggles, live requirement feedback, and form submission UX
 */

document.addEventListener('DOMContentLoaded', function () {
    initPasswordToggles();
    initLivePasswordRequirements();
    initSignupFormUX();
    initLoginFormUX();
});

/**
 * Initializes accessible password visibility toggles
 */
function initPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.auth-password-toggle-btn');

    toggleButtons.forEach(function (button) {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = button.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);

            if (!targetInput) return;

            const icon = button.querySelector('i');
            const isPassword = targetInput.type === 'password';

            if (isPassword) {
                targetInput.type = 'text';
                button.setAttribute('aria-label', 'Hide password');
                button.setAttribute('aria-pressed', 'true');
                if (icon) {
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                }
            } else {
                targetInput.type = 'password';
                button.setAttribute('aria-label', 'Show password');
                button.setAttribute('aria-pressed', 'false');
                if (icon) {
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                }
            }

            // Keep focus in input or return to button cleanly
            targetInput.focus();
        });
    });
}

/**
 * Provides helpful client-side guidance on standard password requirements.
 * Server-side Django authentication validators remain authoritative.
 */
function initLivePasswordRequirements() {
    const passwordInput = document.getElementById('id_password1');
    const confirmInput = document.getElementById('id_password2');
    const usernameInput = document.getElementById('id_username');

    if (!passwordInput) return;

    const reqLength = document.getElementById('req-length');
    const reqSimilarity = document.getElementById('req-similarity');
    const reqNumeric = document.getElementById('req-numeric');
    const matchIndicator = document.getElementById('password-match-indicator');

    function updateRequirement(element, isValid) {
        if (!element) return;
        const icon = element.querySelector('.requirement-icon');

        if (isValid) {
            element.classList.add('is-valid');
            if (icon) {
                icon.className = 'bi bi-check-circle-fill requirement-icon text-success';
            }
        } else {
            element.classList.remove('is-valid');
            if (icon) {
                icon.className = 'bi bi-circle requirement-icon';
            }
        }
    }

    function checkPasswordCriteria() {
        const val = passwordInput.value;
        const userVal = usernameInput ? usernameInput.value.trim().toLowerCase() : '';

        // Criteria 1: At least 8 characters
        const isLengthOk = val.length >= 8;
        updateRequirement(reqLength, isLengthOk);

        // Criteria 2: Not entirely numeric
        const isNotEntirelyNumeric = val.length > 0 && !/^\d+$/.test(val);
        updateRequirement(reqNumeric, isNotEntirelyNumeric);

        // Criteria 3: Not too similar to username
        const isNotSimilar = val.length > 0 && (!userVal || (val.toLowerCase() !== userVal && !val.toLowerCase().includes(userVal) && !userVal.includes(val.toLowerCase())));
        updateRequirement(reqSimilarity, isNotSimilar);

        // Check match with confirm password if confirm field has content
        checkPasswordMatch();
    }

    function checkPasswordMatch() {
        if (!confirmInput || !matchIndicator) return;

        const p1 = passwordInput.value;
        const p2 = confirmInput.value;

        if (!p2) {
            matchIndicator.innerHTML = '';
            matchIndicator.className = 'password-match-indicator';
            return;
        }

        if (p1 === p2) {
            matchIndicator.innerHTML = '<i class="bi bi-check2-circle"></i> Passwords match';
            matchIndicator.className = 'password-match-indicator matching';
        } else {
            matchIndicator.innerHTML = '<i class="bi bi-x-circle"></i> Passwords do not match';
            matchIndicator.className = 'password-match-indicator mismatch';
        }
    }

    passwordInput.addEventListener('input', checkPasswordCriteria);
    if (confirmInput) {
        confirmInput.addEventListener('input', checkPasswordMatch);
    }
    if (usernameInput) {
        usernameInput.addEventListener('input', checkPasswordCriteria);
    }

    // Run initial check if page loaded with pre-filled inputs (e.g. browser autofill)
    if (passwordInput.value) {
        checkPasswordCriteria();
    }
}

/**
 * Handles smooth submission UX while preserving standard Django POST behavior
 */
// function initSignupFormUX() {
//     const signupForm = document.getElementById('signupForm');
//     const submitBtn = document.getElementById('signupSubmitBtn');

//     if (!signupForm || !submitBtn) return;

//     signupForm.addEventListener('submit', function (e) {
//         // Only trigger UX loading state if native form validation passes
//         if (!signupForm.checkValidity()) {
//             return; // Allow browser to show native validation bubbles
//         }

//         // Add subtle loading state without preventing normal submission
//         submitBtn.classList.add('is-submitting');
//         submitBtn.disabled = true;

//         const originalHtml = submitBtn.innerHTML;
//         submitBtn.innerHTML = `
//             <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//             <span>Creating account...</span>
//         `;

//         // Actually submit the form programmatically to ensure it goes through
//         // even if disabled state triggered
//         setTimeout(function () {
//             signupForm.submit();
//         }, 10);
//     });

//     // Reset button state if user navigates back using browser cache (bfcache)
//     window.addEventListener('pageshow', function (event) {
//         if (submitBtn) {
//             submitBtn.classList.remove('is-submitting');
//             submitBtn.disabled = false;
//             submitBtn.innerHTML = `Create Account <i class="bi bi-arrow-right btn-arrow-icon"></i>`;
//         }
//     });
// }

function initSignupFormUX() {
    const signupForm = document.getElementById('signupForm');
    const submitBtn = document.getElementById('signupSubmitBtn');

    if (!signupForm || !submitBtn) return;

    signupForm.addEventListener('submit', function () {

        if (!signupForm.checkValidity()) {
            return;
        }

        // Show loading state
        submitBtn.classList.add('is-submitting');
        submitBtn.disabled = true;

        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"
                  role="status" aria-hidden="true"></span>
            <span>Creating account...</span>
        `;

        // Allow the browser's normal form submission.
        // Do not call signupForm.submit() again.
    });

    window.addEventListener('pageshow', function () {
        submitBtn.classList.remove('is-submitting');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <span>Create Account</span>
            <i class="bi bi-arrow-right btn-arrow-icon"></i>
        `;
    });
}

/**
 * Handles smooth login submission UX while preserving standard Django POST behavior
 */
// function initLoginFormUX() {
//     const loginForm = document.getElementById('loginForm');
//     const submitBtn = document.getElementById('loginSubmitBtn');

//     if (!loginForm || !submitBtn) return;

//     loginForm.addEventListener('submit', function (e) {
//         // Only trigger UX loading state if native form validation passes
//         if (!loginForm.checkValidity()) {
//             return; // Allow browser to show native validation bubbles
//         }

//         // Add subtle loading state without preventing normal submission
//         submitBtn.classList.add('is-submitting');
//         submitBtn.disabled = true;

//         submitBtn.innerHTML = `
//             <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//             <span>Logging in...</span>
//         `;

//         // Programmatically submit to ensure standard POST proceeds
//         setTimeout(function () {
//             loginForm.submit();
//         }, 10);
//     });

//     // Reset button state on bfcache navigation
//     window.addEventListener('pageshow', function (event) {
//         if (submitBtn) {
//             submitBtn.classList.remove('is-submitting');
//             submitBtn.disabled = false;
//             submitBtn.innerHTML = `<span>Log In</span> <i class="bi bi-arrow-right btn-arrow-icon" aria-hidden="true"></i>`;
//         }
//     });
// }

function initLoginFormUX() {
    const loginForm = document.getElementById('loginForm');
    const submitBtn = document.getElementById('loginSubmitBtn');

    if (!loginForm || !submitBtn) return;

    loginForm.addEventListener('submit', function () {

        if (!loginForm.checkValidity()) {
            return;
        }

        submitBtn.classList.add('is-submitting');
        submitBtn.disabled = true;

        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2"
                  role="status" aria-hidden="true"></span>
            <span>Logging in...</span>
        `;
    });

    window.addEventListener('pageshow', function () {
        submitBtn.classList.remove('is-submitting');
        submitBtn.disabled = false;

        submitBtn.innerHTML = `
            <span>Log In</span>
            <i class="bi bi-arrow-right btn-arrow-icon"
               aria-hidden="true"></i>
        `;
    });
}



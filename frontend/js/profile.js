/**
 * GoFlow Profile Page Interactions
 * Handles image selection, client-side format & size validation, live preview, and submit UX
 */

document.addEventListener('DOMContentLoaded', function () {
    initProfilePictureUpload();
});

function initProfilePictureUpload() {
    const fileInput = document.getElementById('profile_image');
    const dropZone = document.getElementById('profileUploadZone');
    const previewCard = document.getElementById('profilePreviewCard');
    const previewThumb = document.getElementById('previewThumbnail');
    const previewName = document.getElementById('previewFilename');
    const previewSize = document.getElementById('previewFilesize');
    const cancelBtn = document.getElementById('btnPreviewCancel');
    const clientError = document.getElementById('profileClientError');
    const uploadForm = document.getElementById('profileUploadForm');
    const submitBtn = document.getElementById('updatePictureBtn');

    if (!fileInput) return;

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB limit
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

    function showError(message) {
        if (!clientError) return;
        clientError.innerHTML = `<i class="bi bi-exclamation-triangle-fill flex-shrink-0"></i><span>${message}</span>`;
        clientError.classList.add('is-visible');
    }

    function clearError() {
        if (!clientError) return;
        clientError.innerHTML = '';
        clientError.classList.remove('is-visible');
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    function handleFile(file) {
        clearError();

        if (!file) {
            resetPreview();
            return;
        }

        // Validate format
        if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
            showError('Invalid file format. Only JPG, JPEG, and PNG images are allowed.');
            fileInput.value = '';
            resetPreview();
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            showError('Image size exceeds 2 MB limit. Please select a smaller image.');
            fileInput.value = '';
            resetPreview();
            return;
        }

        // Read and show live preview
        const reader = new FileReader();
        reader.onload = function (e) {
            if (previewThumb) {
                previewThumb.src = e.target.result;
            }
            if (previewName) {
                previewName.textContent = file.name;
            }
            if (previewSize) {
                previewSize.textContent = formatFileSize(file.size);
            }
            if (previewCard) {
                previewCard.classList.add('has-preview');
            }
        };
        reader.readAsDataURL(file);
    }

    function resetPreview() {
        if (fileInput) fileInput.value = '';
        if (previewCard) previewCard.classList.remove('has-preview');
        if (previewThumb) previewThumb.src = '';
        if (previewName) previewName.textContent = '';
        if (previewSize) previewSize.textContent = '';
        clearError();
    }

    // Input change event
    fileInput.addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        } else {
            resetPreview();
        }
    });

    // Cancel preview button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function (e) {
            e.preventDefault();
            resetPreview();
        });
    }

    // Drag and drop events
    if (dropZone) {
        ['dragenter', 'dragover'].forEach(function (eventName) {
            dropZone.addEventListener(eventName, function (e) {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.add('is-dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(function (eventName) {
            dropZone.addEventListener(eventName, function (e) {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('is-dragover');
            }, false);
        });

        dropZone.addEventListener('drop', function (e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files.length > 0) {
                fileInput.files = files;
                handleFile(files[0]);
            }
        });
    }

    // Form submission UX
    if (uploadForm && submitBtn) {
        uploadForm.addEventListener('submit', function (e) {
            if (!fileInput.files || fileInput.files.length === 0) {
                e.preventDefault();
                showError('Please choose an image file before updating.');
                return;
            }

            submitBtn.classList.add('is-submitting');
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <span>Updating Picture...</span>
            `;

            // Let native form submission proceed smoothly
            setTimeout(function () {
                uploadForm.submit();
            }, 10);
        });
    }

    // Reset button on back/forward browser cache navigation
    window.addEventListener('pageshow', function () {
        if (submitBtn) {
            submitBtn.classList.remove('is-submitting');
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i class="bi bi-cloud-arrow-up-fill me-2"></i> Update Profile Picture`;
        }
    });
}


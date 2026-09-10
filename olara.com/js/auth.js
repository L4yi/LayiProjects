let apiBaseUrl = 'https://drakionoil.com/api/niit-api-testing';

const touchedFields = new Set();

function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function setButtonState(btnId, text, disabled) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.innerHTML = text;
        btn.disabled = disabled;
    }
}

function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        }
    } else {
        input.type = 'password';
        if (icon) {
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    }
}

function flagInputError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.classList.add('is-invalid');
    const wrapper = input.closest('.input-wrapper');
    if (!wrapper) return;

    wrapper.classList.add('has-error');

    let errorEl = wrapper.querySelector('.inline-error');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'inline-error';
        wrapper.appendChild(errorEl);
    }
    errorEl.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${message}`;
}

function clearInputError(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.classList.remove('is-invalid');
    const wrapper = input.closest('.input-wrapper');
    if (!wrapper) return;

    wrapper.classList.remove('has-error');
    const errorEl = wrapper.querySelector('.inline-error');
    if (errorEl) {
        errorEl.remove();
    }
}

function clearAllInputErrors() {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    document.querySelectorAll('.inline-error').forEach(el => el.remove());
}

function validateField(id) {
    const el = document.getElementById(id);
    if (!el) return true;

    const val = el.value.trim();
    const rawVal = el.value;

    if (id === 'fullName') {
        if (!val) {
            flagInputError('fullName', 'Full name is required');
            return false;
        }
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(val)) {
            flagInputError('fullName', 'Full name can only contain letters');
            return false;
        }
        if (val.length < 3) {
            flagInputError('fullName', 'Full name must be at least 3 characters');
            return false;
        }
        clearInputError('fullName');
        return true;
    }

    if (id === 'emailAddress') {
        if (!val) {
            flagInputError('emailAddress', 'Email address is required');
            return false;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(val)) {
            flagInputError('emailAddress', 'Please enter a valid email address');
            return false;
        }
        clearInputError('emailAddress');
        return true;
    }

    if (id === 'phoneNumber') {
        if (!val) {
            flagInputError('phoneNumber', 'Phone number is required');
            return false;
        }
        const phoneIntegerRegex = /^\+?[0-9]+$/;
        if (!phoneIntegerRegex.test(val)) {
            flagInputError('phoneNumber', 'Phone number can only contain integers (0-9)');
            return false;
        }
        if (val.length < 11) {
            flagInputError('phoneNumber', 'Phone number must be at least 11 digits');
            return false;
        }
        clearInputError('phoneNumber');
        return true;
    }

    if (id === 'password') {
        if (!rawVal) {
            flagInputError('password', 'Password is required');
            return false;
        }
        if (rawVal.length < 8) {
            flagInputError('password', 'Password must be at least 8 characters');
            return false;
        }
        clearInputError('password');
        const confirmInput = document.getElementById('confirmPassword');
        if (confirmInput && touchedFields.has('confirmPassword')) {
            validateField('confirmPassword');
        }
        return true;
    }

    if (id === 'newPassword') {
        if (!rawVal) {
            flagInputError('newPassword', 'New password is required');
            return false;
        }
        if (rawVal.length < 8) {
            flagInputError('newPassword', 'Password must be at least 8 characters');
            return false;
        }
        clearInputError('newPassword');
        const confirmInput = document.getElementById('confirmPassword');
        if (confirmInput && touchedFields.has('confirmPassword')) {
            validateField('confirmPassword');
        }
        return true;
    }

    if (id === 'confirmPassword') {
        const passwordVal = document.getElementById('newPassword') ? document.getElementById('newPassword').value : (document.getElementById('password') ? document.getElementById('password').value : '');
        if (!rawVal) {
            flagInputError('confirmPassword', 'Please confirm your password');
            return false;
        }
        if (rawVal.length < 8) {
            flagInputError('confirmPassword', 'Password must be at least 8 characters');
            return false;
        }
        if (rawVal !== passwordVal) {
            flagInputError('confirmPassword', 'Passwords do not match');
            return false;
        }
        clearInputError('confirmPassword');
        return true;
    }

    if (id === 'otpCode') {
        if (!val) {
            flagInputError('otpCode', 'OTP code is required');
            return false;
        }
        if (isNaN(val)) {
            flagInputError('otpCode', 'OTP code must contain only numbers');
            return false;
        }
        if (val.length !== 6) {
            flagInputError('otpCode', 'OTP code must be 6 digits');
            return false;
        }
        clearInputError('otpCode');
        return true;
    }

    return true;
}

function setupLiveValidation() {
    const fields = ['fullName', 'emailAddress', 'phoneNumber', 'password', 'newPassword', 'confirmPassword', 'otpCode'];
    fields.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                touchedFields.add(id);
                validateField(id);
            });
            input.addEventListener('blur', () => {
                touchedFields.add(id);
                validateField(id);
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', setupLiveValidation);

async function signUpHandle() {
    const fields = ['fullName', 'emailAddress', 'phoneNumber', 'password'];
    let hasError = false;
    let firstErrorField = null;

    fields.forEach(id => {
        touchedFields.add(id);
        const valid = validateField(id);
        if (!valid) {
            hasError = true;
            if (!firstErrorField) firstErrorField = id;
        }
    });

    if (hasError) {
        if (firstErrorField) {
            const el = document.getElementById(firstErrorField);
            if (el) el.focus();
        }
        return;
    }

    const fullName = getValue('fullName');
    const emailAddress = getValue('emailAddress');
    const phoneNumber = getValue('phoneNumber');
    const password = document.getElementById('password') ? document.getElementById('password').value : '';

    setButtonState('submitBtnId', 'Processing...', true);

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('emailAddress', emailAddress);
    formData.append('phoneNumber', phoneNumber);
    formData.append('password', password);

    try {
        const response = await fetch(apiBaseUrl + '/auth/sign-up', {
            method: 'POST',
            body: formData
        });

        const fetchData = await response.json();
        setButtonState('submitBtnId', 'Sign Up', false);

        if (fetchData.success === true) {
            const sessionData = {
                fullName: fullName,
                emailAddress: emailAddress,
                phoneNumber: phoneNumber,
                ...(fetchData.data || {})
            };
            sessionStorage.setItem('userSignUpSession', JSON.stringify(sessionData));
            alert(fetchData.message || 'Registration Successful!');
            window.location.href = 'dashboard.html';
        } else {
            alert(fetchData.message || 'Registration failed');
        }
    } catch (error) {
        setButtonState('submitBtnId', 'Sign Up', false);
        console.error(error);
        alert(error.message || 'Network error, please try again.');
    }
}

async function signInHandle() {
    const fields = ['emailAddress', 'password'];
    let hasError = false;
    let firstErrorField = null;

    fields.forEach(id => {
        touchedFields.add(id);
        const valid = validateField(id);
        if (!valid) {
            hasError = true;
            if (!firstErrorField) firstErrorField = id;
        }
    });

    if (hasError) {
        if (firstErrorField) {
            const el = document.getElementById(firstErrorField);
            if (el) el.focus();
        }
        return;
    }

    const emailAddress = getValue('emailAddress');
    const password = document.getElementById('password') ? document.getElementById('password').value : '';

    setButtonState('submitBtnId', 'Authenticating...', true);

    try {
        const response = await fetch(apiBaseUrl + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailAddress: emailAddress,
                password: password
            })
        });

        const fetchData = await response.json();
        setButtonState('submitBtnId', 'Sign in', false);

        if (fetchData.success === true) {
            let existingName = '';
            try {
                const prev = JSON.parse(sessionStorage.getItem('userSignUpSession') || '{}');
                existingName = prev.fullName || prev.name || '';
            } catch (e) {}

            const sessionData = {
                emailAddress: emailAddress,
                fullName: (fetchData.data && (fetchData.data.fullName || fetchData.data.name || fetchData.data.fullname)) || existingName || emailAddress.split('@')[0],
                ...(fetchData.data || {})
            };
            sessionStorage.setItem('userSignUpSession', JSON.stringify(sessionData));
            alert((fetchData.message || 'Sign In Successful!') + ' Hi, ' + (sessionData.fullName || emailAddress));
            window.location.href = 'dashboard.html';
        } else {
            alert(fetchData.message || 'Invalid login credentials');
        }
    } catch (error) {
        setButtonState('submitBtnId', 'Sign in', false);
        console.error(error);
        alert(error.message || 'Network error, please try again.');
    }
}

async function forgotPasswordHandle() {
    touchedFields.add('emailAddress');
    const valid = validateField('emailAddress');
    if (!valid) {
        const el = document.getElementById('emailAddress');
        if (el) el.focus();
        return;
    }

    const emailAddress = getValue('emailAddress');

    setButtonState('submitBtnId', 'Sending OTP...', true);

    try {
        const response = await fetch(apiBaseUrl + '/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailAddress: emailAddress
            })
        });

        const fetchData = await response.json();
        setButtonState('submitBtnId', 'Reset Password', false);

        if (fetchData.success === true) {
            alert(fetchData.message || 'OTP Sent Successfully!');
            if (fetchData.data && fetchData.data.otpCode) {
                alert('Your OTP Code is: ' + fetchData.data.otpCode);
                sessionStorage.setItem('sentOtpCode', fetchData.data.otpCode);
            }
            window.location.href = 'reset-password.html';
        } else {
            alert(fetchData.message || 'Failed to send OTP');
        }
    } catch (error) {
        setButtonState('submitBtnId', 'Reset Password', false);
        console.error(error);
        alert(error.message || 'Network error, please try again.');
    }
}

async function resetPasswordHandle() {
    const fields = ['otpCode', 'newPassword', 'confirmPassword'];
    let hasError = false;
    let firstErrorField = null;

    fields.forEach(id => {
        touchedFields.add(id);
        const valid = validateField(id);
        if (!valid) {
            hasError = true;
            if (!firstErrorField) firstErrorField = id;
        }
    });

    if (hasError) {
        if (firstErrorField) {
            const el = document.getElementById(firstErrorField);
            if (el) el.focus();
        }
        return;
    }

    const otpCode = getValue('otpCode');
    const newPassword = document.getElementById('newPassword') ? document.getElementById('newPassword').value : '';
    const confirmPassword = document.getElementById('confirmPassword') ? document.getElementById('confirmPassword').value : '';

    setButtonState('submitBtnId', 'Resetting Password...', true);

    try {
        const response = await fetch(apiBaseUrl + '/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                otpCode: otpCode,
                password: newPassword,
                confirmedPassword: confirmPassword
            })
        });

        const fetchData = await response.json();
        setButtonState('submitBtnId', 'Submit Your New Password', false);

        if (fetchData.success === true) {
            alert(fetchData.message || 'Password Reset Successfully!');
            sessionStorage.removeItem('sentOtpCode');
            window.location.href = 'sign-in.html';
        } else {
            alert(fetchData.message || 'Failed to reset password');
        }
    } catch (error) {
        setButtonState('submitBtnId', 'Submit Your New Password', false);
        console.error(error);
        alert(error.message || 'Network error, please try again.');
    }
}

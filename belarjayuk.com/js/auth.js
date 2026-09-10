let apiBaseUrl = 'https://drakionoil.com/api/niit-api-testing';

async function signUpHandle() {

    const fullName = document.getElementById("fullName").value.trim();
    const emailAddress = document.getElementById("emailAddress").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const password = document.getElementById("password").value;

    if (!fullName) {
        alert("FULL NAME REQUIRED");
        return;
    }

    if (!emailAddress) {
        alert("EMAIL ADDRESS REQUIRED");
        return;
    }

    if (!phoneNumber) {
        alert("PHONE NUMBER REQUIRED");
        return;
    }

    if (!password) {
        alert("PASSWORD REQUIRED");
        return;
    }


    const submitBtn = document.getElementById('submitBtnId');
    submitBtn.innerHTML = 'Processing...';
    submitBtn.disabled = true;

    try {

        const response = await fetch(apiBaseUrl + '/auth/sign-up', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fullName,
                emailAddress,
                phoneNumber,
                password
            })
        });

        const fetchData = await response.json();

        if (fetchData.success == true) {
            alert(fetchData.message + ' Hi, ' + fetchData.data.fullName);
        } else {
            alert(fetchData.message);
        }


        submitBtn.innerHTML = 'Sign Up';
        submitBtn.disabled = false;

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function signInHandle() {

    const emailAddress = document.getElementById("emailAddress").value.trim();
    const password = document.getElementById("password").value;

    if (!emailAddress) {
        alert("EMAIL ADDRESS REQUIRED");
        return;
    }

    if (!password) {
        alert("PASSWORD REQUIRED");
        return;
    }

    const submitBtn = document.getElementById('submitBtnId');
    submitBtn.innerHTML = 'Authenticating...';
    submitBtn.disabled = true;

    try {

        const response = await fetch(apiBaseUrl + '/auth/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                emailAddress,
                password
            })
        });

        const fetchData = await response.json();

        if (fetchData.success == true) {
            alert(fetchData.message + ' Hi, ' + fetchData.data.emailAddress);
        } else {
            alert(fetchData.message);
        }

        submitBtn.innerHTML = 'Sign In';
        submitBtn.disabled = false;

    } catch (error) {
        console.error(error);
        alert(error.message);

        submitBtn.innerHTML = 'Sign In';
        submitBtn.disabled = false;
    }
}


async function forgotPasswordHandle() {
    const emailAddress = document.getElementById("emailAddress").value.trim();


    if (!emailAddress) {
        alert("EMAIL ADDRESS REQUIRED");
        return;
    }

    const submitBtn = document.getElementById('submitBtnId');
    submitBtn.innerHTML = 'Sending OTP...';
    submitBtn.disabled = true;

    try {

        const response = await fetch(apiBaseUrl + '/auth/forgot-password', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                emailAddress
            })
        });

        const fetchData = await response.json();

        if (fetchData.success == true) {
            alert(fetchData.message);

            alert("Your OTP Code is: " + fetchData.data.otpCode);

            sessionStorage.setItem('sentOtpCode', fetchData.data.otpCode);
            window.location.href = 'reset-password.html';
        } else {
            alert(fetchData.message);
        }

        submitBtn.innerHTML = 'Reset Password';
        submitBtn.disabled = false;

    } catch (error) {
        console.error(error);
        alert(error.message);

        submitBtn.innerHTML = 'Reset Password';
        submitBtn.disabled = false;
    }
}

async function resetPasswordHandle() {
    const otpCode = document.getElementById("otpCode").value.trim();
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!otpCode) {
        alert("OTP CODE REQUIRED");
        return;
    }

    if (isNaN(otpCode)) {
        alert("OTP CODE MUST CONTAIN ONLY NUMBERS");
        return;
    }

    if (otpCode.length != 6) {
        alert("OTP CODE MUST BE 6 DIGITS");
        return;
    }

    const sentOtpCode = sessionStorage.getItem('sentOtpCode');
    if (sentOtpCode && otpCode !== sentOtpCode) {
    alert("INCORRECT OTP CODE");
    return;
}

    if (!newPassword) {
        alert("NEW PASSWORD REQUIRED");
        return;
    }
     if (newPassword.length < 8) {
        alert("NEW PASSWORD MUST BE AT LEAST 8 CHARACTERS");
        return;
    }

     if (confirmPassword.length < 8) {
        alert("CONFIRM PASSWORD MUST BE AT LEAST 8 CHARACTERS");
        return;
    }


    if (newPassword !== confirmPassword) {
        alert("PASSWORDS DO NOT MATCH");
        return;
    }

    const submitBtn = document.getElementById('submitBtnId');
    submitBtn.innerHTML = 'Resetting Password...';
    submitBtn.disabled = true;

    try {
        const response = await fetch(apiBaseUrl + '/auth/reset-password', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                otpCode: otpCode,
                password: newPassword,
                confirmedPassword: confirmPassword
            })
        });

        const fetchData = await response.json();

        if (fetchData.success == true) {
            alert(fetchData.message);
            sessionStorage.removeItem('sentOtpCode');
            window.location.href = 'sign-in.html';
        } else {
            alert(fetchData.message);
        }

        submitBtn.innerHTML = 'Reset Password';
        submitBtn.disabled = false;

    } catch (error) {
        console.error(error);
        alert(error.message);

        submitBtn.innerHTML = 'Reset Password';
        submitBtn.disabled = false;
    }
}

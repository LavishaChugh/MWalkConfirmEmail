document.addEventListener('DOMContentLoaded', function () {
    const datepicker = document.getElementById('datepicker');
    let selectedDateElement = null;

    datepicker.addEventListener('click', function (e) {
        if (e.target.tagName === 'TD' && e.target.textContent !== '') {
            if (selectedDateElement) {
                selectedDateElement.classList.remove('selected-date');  
            }
            selectedDateElement = e.target;
            selectedDateElement.classList.add('selected-date');
            datepicker.style.display = 'none';
            updateTotalPrice();
        }
    });

    function updateTotalPrice() {
        const adultQuantity = parseInt(document.getElementById('adult-quantity').value, 10);
        const childQuantity = parseInt(document.getElementById('child-quantity').value, 10);
        const selectedPackage = document.querySelector('.package-type.selected');
        if (selectedPackage) {
            const pricePerAdult = parseFloat(selectedPackage.getAttribute('data-adult-price'));
            const pricePerChild = parseFloat(selectedPackage.getAttribute('data-child-price'));
            const totalPrice = (adultQuantity * pricePerAdult) + (childQuantity * pricePerChild);
            document.getElementById('total-price').textContent = `$${totalPrice}`;
            document.getElementById('child-price').textContent = `${(childQuantity * pricePerChild).toFixed(2)}`;
        }
    }

    function handleQuantityChange(type, operation) {
        const input = document.getElementById(type + '-quantity');
        const value = parseInt(input.value, 10);
        if (operation === 'plus') {
            input.value = value + 1;
        } else if (operation === 'minus' && value > 0) {
            input.value = value - 1;
        }
        updateTotalPrice();
    }

    document.getElementById('adult-plus').addEventListener('click', function () {
        handleQuantityChange('adult', 'plus');
    });

    document.getElementById('adult-minus').addEventListener('click', function () {
        handleQuantityChange('adult', 'minus');
    });

    document.getElementById('child-plus').addEventListener('click', function () {
        handleQuantityChange('child', 'plus');
    });

    document.getElementById('child-minus').addEventListener('click', function () {
        handleQuantityChange('child', 'minus');
    });

    document.querySelectorAll('.package-type').forEach(function (packageType) {
        packageType.addEventListener('click', function () {
            document.getElementById('details-content').textContent = this.getAttribute('data-details');
            document.querySelectorAll('.package-type').forEach(function (pt) {
                pt.classList.remove('selected');
            });
            this.classList.add('selected');
            selectedDateElement = null;
            document.getElementById('package-details').classList.add('active');
            updateTotalPrice();
        });
    });

    document.getElementById('clear-all-btn').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('package-details').classList.remove('active');
        document.querySelectorAll('.package-type').forEach(function (pt) {
            pt.classList.remove('selected');
        });
        document.getElementById('adult-quantity').value = '0';
        document.getElementById('child-quantity').value = '0';
        if (selectedDateElement) {
            selectedDateElement.style.backgroundColor = '';
        }
        updateTotalPrice();
        selectedDateElement = null;
    });

    updateTotalPrice();
});

document.addEventListener('DOMContentLoaded', function () {
    flatpickr("#datepicker", {
        dateFormat: "Y-m-d",  
        minDate: "today",    

    });
});

document.addEventListener('DOMContentLoaded', function () {
    const packageTypes = document.querySelectorAll('.package-type');
    const priceElement = document.getElementById('price');
    const childPriceElement = document.getElementById('child-price');
    const pricingsDiv = document.querySelector('.pricings');
    const clearAllButton = document.getElementById('clear-all-btn');

    pricingsDiv.style.display = 'none';

    packageTypes.forEach(packageType => {
        packageType.addEventListener('click', function () {
            const adultPrice = this.getAttribute('data-adult-price');
            priceElement.innerText = adultPrice;
            pricingsDiv.style.display = 'flex';
            const childPrice = this.getAttribute('data-child-price');
            childPriceElement.innerText = childPrice;
        });
    });

    clearAllButton.addEventListener('click', function () {
        priceElement.innerText = '0';
        childPriceElement.innerText = '0';
        pricingsDiv.style.display = 'none';

    });
});

function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');

    name.classList.remove('is-invalid');
    email.classList.remove('is-invalid');
    phone.classList.remove('is-invalid');

    let valid = true;

    if (name.value.trim() === '') {
        name.classList.add('is-invalid');
        valid = false;
    }

    if (email.value.trim() === '') {
        email.classList.add('is-invalid');
        valid = false;
    }

    if (phone.value.trim() === '') {
        phone.classList.add('is-invalid');
        valid = false;
    }

    if (valid) {
        alert('Form submitted successfully!');
    }
}

document.querySelectorAll('.select-package').forEach(button => {
    button.addEventListener('click', event => {
        const packageType = event.target.closest('.package-type');
        const packageData = {
            title: packageType.getAttribute('data-package'),
            time: packageType.getAttribute('data-time'),
            price: packageType.getAttribute('data-price')
        };
        localStorage.setItem('selectedPackage', JSON.stringify(packageData));
        window.location.href = 'book now.html';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const selectedPackage = JSON.parse(localStorage.getItem('selectedPackage'));
    if (selectedPackage) {
        document.getElementById('package-title').innerText = selectedPackage.title;
        document.getElementById('package-time').innerText = `Cruising Time: ${selectedPackage.time}`;
        document.getElementById('total-price').innerText = `US$ ${selectedPackage.price}`;
        document.getElementById('subtotal-price').innerText = `US$ ${selectedPackage.price}`;
        document.getElementById('payment-price').innerText = `US$ ${selectedPackage.price}`;
    }
});

function submitForm() {
    const loginData = JSON.parse(localStorage.getItem('loginData'));
    const emailAddress = loginData ? loginData.email : document.getElementById('email').value.trim();  

    if (!emailAddress) {
        alert('User email not found. Please log in again.');
        return;
    }

    const selectedDate = document.getElementById('datepicker').value;
    const packageName = document.querySelector('.package-type.selected') ? document.querySelector('.package-type.selected').textContent : '';
    const adultCount = parseInt(document.getElementById('adult-quantity').value, 10);
    const childCount = parseInt(document.getElementById('child-quantity').value, 10);
    const totalCost = parseFloat(document.getElementById('total-price').textContent.replace('$', ''));

    if (!selectedDate || !packageName || (adultCount === 0 && childCount === 0)) {
        document.getElementById('choose-quantity').style.display = 'block';
        setTimeout(function() {
            document.getElementById('choose-quantity').style.display = 'none';
        }, 1000);
        return;
    }

    const emailBody = `
        Your booking details are as follows:
        Email: ${emailAddress}
        Date: ${selectedDate}
        Package: ${packageName}
        Adults: ${adultCount}
        Children: ${childCount}
        Total Cost: $${totalCost}
    `;

    fetch('https://localhost:7129/api/Email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            body: emailBody,
            senderEmail: emailAddress,
            packageName: packageName,
            totalCost: totalCost,
            adultCount: adultCount,
            childCount: childCount,
            selectedDate: selectedDate,
            emailAddress: emailAddress,
        })
    }).then(response => {
        if (response.ok) {
            document.querySelector('.package-section').style.display = 'none';
            document.querySelector('.booked').style.display = "block";

            setTimeout(() => {
                location.reload();
            }, 7000);

        } else {
            document.getElementById('package-not-confirmed').style.display = "block";
        }
    }).catch(error => {
        document.getElementById('package-not-confirmed').style.display = "block";
    });
}

document.getElementById('helllooo').addEventListener('click', function() {
    document.getElementById('package-not-confirmed').style.display = 'none';
})

document.getElementById('pay-at-site').addEventListener('click', function (e) {
    e.preventDefault();
    submitForm();
});

document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const otpbutton = document.getElementById('otpbutton');
    const setPasswordSection = document.getElementById('set-password-section');
    document.querySelector('.popup').style.display = 'none';

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        const re = /^[0-9]{10}$/;
        return re.test(String(phone));
    }

    function toggleButton() {
        if (validateEmail(emailInput.value)) {
            nextStepBtn.disabled = false;
        } else {
            nextStepBtn.disabled = true;
        }
    }

    function toggleButton2() {
        if (validatePhone(phoneInput.value)) {
            otpbutton.disabled = false;
        }
        else {
            otpbutton.disabled = true;
        }
    }

    emailInput.addEventListener('input', toggleButton);
    phoneInput.addEventListener('input', toggleButton2);
});

document.getElementById('email').addEventListener('input', function () {
    const email = this.value;
    const nextStepBtn = document.getElementById('nextStepBtn');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    nextStepBtn.disabled = !emailRegex.test(email);
});

document.getElementById('nextStepBtn').addEventListener('click', function () {
    document.getElementById('hide').style.display = 'none';
    document.querySelector('.popup').style.display = 'block';
});

document.getElementById('backButton').addEventListener('click', function () {
    document.getElementById('hide').style.display = 'block';
    document.querySelector('.popup').style.display = 'none';
});
const passwordField = document.getElementById('password-field');
const errorMessage = document.getElementById('error-message');
const confirmButton = document.getElementById('confirmButton');
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

passwordField.addEventListener('input', function () {
    if (passwordRegex.test(passwordField.value)) {
        errorMessage.style.display = 'none';
        confirmButton.disabled = false;
    } else {
        errorMessage.style.display = 'block';
        confirmButton.disabled = true;
    }
});

document.getElementById('passwordForm').addEventListener('submit', function (event) {
    if (!passwordRegex.test(passwordField.value)) {
        event.preventDefault();
        errorMessage.style.display = 'block';
        confirmButton.disabled = true;
    }
});

document.getElementById('confirmButton').addEventListener('click', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password-field').value;

    console.log('Email:', email);
    console.log('Password:', password);

    if (!email || !password) {
        alert('Please fill in both email and password.');
        return;
    }

    const data = {
        Email: email,
        Password: password
    };

    fetch('https://localhost:7129/api/VerificationEmail/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response Data:', data);

            if (data.success) {
                alert('Registration successful! Please check your email for the verification link.');

                setLoginToken(data.token, email);

                document.querySelector('.popup').style.display = 'none';
                document.getElementById('successMessage').style.display = 'block';

                setTimeout(() => {
                    location.reload();
                }, 7000);

            } else {
                document.getElementById('wrong-email-msg').style.display = 'block';
            }
        })
        .catch(error => {
            document.getElementById('wrong-email-msg').style.display = 'block';
        });
});

document.getElementById('loginSection').style.display = 'none';

function showLoginSection() {
    document.getElementById('signn-upp').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
}

function showSignUpSection() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('signn-upp').style.display = 'block';
}

function setLoginToken(token, email) {
    const expiryTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; 
    const loginData = {
        token: token,
        email: email,
        expiry: expiryTime
    };
    localStorage.setItem('loginData', JSON.stringify(loginData));
}

function checkLoginStatus() {
    const loginData = JSON.parse(localStorage.getItem('loginData'));

    if (loginData) {
        const currentTime = new Date().getTime();

        if (currentTime < loginData.expiry) {
            console.log("Already logged in");
            return true;
        } else {
            localStorage.removeItem('loginData');
        }
    }

    console.log("Not logged in");
    document.querySelector('.package-section').style.display = 'none';
    return false;
}

document.addEventListener("DOMContentLoaded", function () {
    if (checkLoginStatus()) {
        document.getElementById('hide').style.display = 'none';
        document.querySelector('.btn2').addEventListener('click', function () {
            const selectedDate = document.getElementById('datepicker').value;

            if (!selectedDate) {
                document.querySelector('#applyModal').style.display = 'none';
                document.getElementById('datepicker').click();
                return;
            }
            else {
                var applyModal = new bootstrap.Modal(document.getElementById('applyModal'));
                applyModal.show();
                document.querySelector('.package-section').style.display = 'block';
                document.querySelector('.booked').style.display = 'none';
            }
        })

        return;
    } else {
        document.querySelector('.btn2').addEventListener('click', function () {
            var applyModal = new bootstrap.Modal(document.getElementById('applyModal'));
            applyModal.show();
        })
    }
});

function emailVerificationSuccess() {
    const loginData = JSON.parse(localStorage.getItem('loginData'));
    if (loginData) {
        loginData.verified = true;
        localStorage.setItem('loginData', JSON.stringify(loginData));
    }
}
const wrongEmailMsg = document.getElementById('wrong-email-msg');

passwordField.addEventListener('input', function() {
    if (passwordField.value === '') {
        wrongEmailMsg.style.display = 'none';
    }
});
function verifyUserAndLogin(token) {
    fetch(`https://localhost:7129/api/VerificationEmail/verify?token=${token}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            setLoginToken(data.token, data.email);
            if (typeof window !== 'undefined') {
                window.location.reload(); 
            }

        } else {
            alert('Verification failed. Please check your email for the correct verification link.');
        }
    })
    .catch(error => {
        console.log('Error:', error);
        alert('An error occurred during verification. Please try again later.');
    });
}
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
    verifyUserAndLogin(token);
}
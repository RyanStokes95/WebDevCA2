/*
script.js
Ryan Stokes
18/07/24
*/

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById("userWelcome").innerHTML = "Welcome" + username + "!";
    }
});

let username = "";
document.addEventListener('DOMContentLoaded', () => {
    // Check if the signInForm element exists before adding event listener
    const signInForm = document.getElementById('signInForm');
    if (signInForm) {
        signInForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission behavior

            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            username = data.username;

            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (result.success) {
                    // Login successful, redirect to the dashboard or another page
                    window.location.replace("userDashboard.html");
                    localStorage.setItem('username', username);
                } else {
                    alert('Login failed: ' + result.message);
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred while logging in.');
            }
        });
    }

    // Check if the registerForm element exists before adding event listener
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission behavior

            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('http://localhost:3000/user-register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    alert('Form submitted successfully!');
                    window.location.replace("index.html");
                } else {
                    alert('Failed to submit form.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while submitting the form.');
            }
        });
    }
});
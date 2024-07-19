/*
script.js
Ryan Stokes
18/07/24
*/

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signInForm').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

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
            } else {
                alert('Login failed: ' + result.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred while logging in.');
        }
    });
});

// Add event listener to the registration form
document.getElementById('registerForm').addEventListener('submit', async (event) => {
    // Prevent default form submission behavior
    event.preventDefault();

    // Assign form data to a variable
    const formData = new FormData(event.target);
    // Create a JavaScript object from the form data
    const data = Object.fromEntries(formData.entries());

    try {
        // Send a POST request to the server with the form data
        const response = await fetch('http://localhost:3000/user-register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Check if the request was successful
        if (response.ok) {
            alert('Form submitted successfully!');
            // Redirect to the landing page
            window.location.replace("index.html");
        } else {
            // Handle unsuccessful form submission
            alert('Failed to submit form.');
        }
    } catch (error) {
        // Handle any errors that occur during the fetch request
        console.error('Error:', error);
        alert('An error occurred while submitting the form.');
    }
});

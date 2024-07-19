/*
script.js
Ryan Stokes
18/07/24
*/

document.getElementById('registerForm').addEventListener('submit', async (event) => {

    //Registration Code
    
    //Prevents default behaviour on form submit, such as an AJAX request
    event.preventDefault();

    //Assigning the forms data to a variable
    const formData = new FormData(event.target);
    //Creates a Javascript object from the form data above (Does not parse to JSON here)
    const data = Object.fromEntries(formData.entries());

    //Fetch API - sends a request to send data (POST) to the server
    const response = await fetch('http://localhost:3000/user-register', {
        method: 'POST',
        headers: {
            //Informs the server the format of the data, in this case JSON
            'Content-Type': 'application/json',
        },
        //The data variable from above is pased to JSON beofre sending
        body: JSON.stringify(data),
    });

    //Error handling
    if (response.ok) {
        alert('Form submitted successfully!');
        //Sends user back to landing page if successful, allowing them to sign in
        window.location.replace("index.html");
    } else {
        alert('Failed to submit form.');
    }
});

//Login Code




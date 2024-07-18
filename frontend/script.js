document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    console.log(formData);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('http://localhost:3000/user-register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        alert('Form submitted successfully!');
    } else {
        alert('Failed to submit form.');
    }
});


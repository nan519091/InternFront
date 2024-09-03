document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetch('http://localhost:5263/api/Auth/login', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                console.log("Access to protected endpoint successful");
            } else {
                console.error("Access denied");
            }
        })
        .catch(error => {
            console.error("Error while accessing protected endpoint:", error);
        });
    }
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const id = document.getElementById('id') ? document.getElementById('id').value : 0;
    const name = document.getElementById('name') ? document.getElementById('name').value : 'string';
    fetch('http://localhost:5263/api/Auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Id: id,
            Name: name,
            Username: username,
            Password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);// ส่งออก token โดยการพิมพ์ออกมาในคอนโซล
            window.location.href = 'index.html';
        } else {
            document.getElementById('message').textContent = 'Invalid username or password.';
        }
    })
    .catch(error => {
        document.getElementById('message').textContent = 'An error occurred. Please try again.';
    });
});
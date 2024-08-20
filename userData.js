function loadUsers() {
    fetch('http://localhost:5263/api/User')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const userInfo = document.querySelector("#TableUser");
            userInfo.innerHTML = ''; // Clear content in table

            const rows = data.map(({ id, name }) => `
                <tr>
                    <td>${id}</td>
                    <td>${name}</td>
                </tr>
            `).join('');

            userInfo.innerHTML = rows; // Add new rows to a table based on data retrieved from the API
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

//-------------------------------------------------------------------------------------------------------------------------------------------------

function fetchUser() {
    const userId = document.getElementById('userId').value;
    const userNameElement = document.getElementById('userName');

    if (!userId) {
        userNameElement.textContent = 'Please enter a user ID.';
        return;
    }
    fetch(`http://localhost:5263/api/User/${userId}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error fetching data');
            }
        })
        .then(user => {
            userNameElement.textContent = `Name: ${user.name}`;
        })
        .catch(error => {
            userNameElement.textContent = 'User not found.';
            console.error(error);
        });
}

//-------------------------------------------------------------------------------------------------------------------------------------------------
function addUser() {
    const nameInput = document.getElementById('name-input').value;
    if (!nameInput) {
        alert('Please enter a name.');
        return;
    }
    fetch('http://localhost:5263/api/User', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: nameInput }) // Convert JSON to string
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            alert('Error adding user.');
            throw new Error('Failed to add user.');
        }
    })
    .then(data => {
        loadUsers(); // Load the updated list of users
        document.getElementById('name-input').value = ''; // Clear the input field
    })
    .catch(error => {
        console.error('Error adding user:', error);
    });
}

//-------------------------------------------------------------------------------------------------------------------------------------------------

function updateUser() {
    const userId = document.getElementById('updateUserId').value;
    const newName = document.getElementById('updateName').value;

    if (!userId || !newName) return alert('Please enter both user ID and new name.');
    fetch(`http://localhost:5263/api/User/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, name: newName })
    })
    .then(response => response.ok ? response.json() : response.text().then(text => { throw new Error(text); })) //if it's true covert to Json and go .then ,if it's false convert to text and go .catch
    .then(() => {
        loadUsers();
        document.getElementById('updateUserId').value = '';
        document.getElementById('updateName').value = '';
        alert('User updated successfully.');
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
}

//-------------------------------------------------------------------------------------------------------------------------------------------------
function deleteUser() {
    const userId = document.getElementById('userIdToDelete').value;

    if (!userId || !confirm('Are you sure you want to delete this user?')) return;
    fetch(`http://localhost:5263/api/User/${userId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            loadUsers();
            alert('Data has been deleted successfully.');
        } else {
            return response.text().then(text => {
                throw new Error(`Error: ${text}`);
            });
        }
    })
    .catch(error => {
        console.error('Error deleting user:', error);
        alert(error.message);
    });
}

//-------------------------------------------------------------------------------------------------------------------------------------------------
loadUsers();

//-------------------------------------------------------------------------------------------------------------------------------------------------


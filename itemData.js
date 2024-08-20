function loadItems() {
    fetch('http://localhost:5263/api/Item')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const itemInfo = document.querySelector("#TableItem");
            itemInfo.innerHTML = ''; // Clear content in table

            const rows = data.map(({ id, name }) => `
                <tr>
                    <td>${id}</td>
                    <td>${name}</td>
                </tr>
            `).join('');

            itemInfo.innerHTML = rows; // Add new rows to a table based on data retrieved from the API
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

//-------------------------------------------------------------------------------------------------------------------------------------------------

function fetchItem() {
    const itemId = document.getElementById('itemId').value;
    const itemNameElement = document.getElementById('itemName');

    if (!itemId) {
        itemNameElement.textContent = 'Please enter a item ID.';
        return;
    }

    fetch(`http://localhost:5263/api/Item/${itemId}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error fetching data.');
            }
        })
        .then(item => {
            itemNameElement.textContent = `Name: ${item.name}`;
        })
        .catch(error => {
            itemNameElement.textContent = 'Item not found.';
            console.error(error);
        });
}

//-------------------------------------------------------------------------------------------------------------------------------------------------
function addItem() {
    const nameInput = document.getElementById('name-input').value;
    if (!nameInput) {
        alert('Please enter a name.');
        return;
    }

    fetch('http://localhost:5263/api/Item', {
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
            alert('Error adding item.');
            throw new Error('Failed to add item.');
        }
    })
    .then(data => {
        loadItems(); // Load the updated list of users
        document.getElementById('name-input').value = ''; // Clear the input field
    })
    .catch(error => {
        console.error('Error adding item:', error);
    });
}
//-------------------------------------------------------------------------------------------------------------------------------------------------

function updateItem() {
    const itemId = document.getElementById('updateItemId').value;
    const newName = document.getElementById('updateName').value;

    if (!itemId || !newName) return alert('Please enter both user ID and new name.');
    fetch(`http://localhost:5263/api/Item/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, name: newName })
    })
    .then(response => response.ok ? response.json() : response.text().then(text => { throw new Error(text); })) //if it's true covert to Json and go .then ,if it's false convert to text and go .catch
    .then(() => {
        loadItems();
        document.getElementById('updateItemId').value = '';
        document.getElementById('updateName').value = '';
        alert('Item updated successfully.');
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
}

//-------------------------------------------------------------------------------------------------------------------------------------------------
function deleteItem() {
    const itemId = document.getElementById('itemIdToDelete').value;

    if (!itemId || !confirm('Are you sure you want to delete this item?')) return;
    fetch(`http://localhost:5263/api/Item/${itemId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            loadItems();
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

loadItems();
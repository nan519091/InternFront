function RequestApi(url, params = {}, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    const options = {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    
    if (body) {
        options.body = JSON.stringify(body); // ส่งข้อมูล body ถ้ามี
    }

    return fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error fetching data');
            }
        })
        .catch(error => {
            console.error(error);
            return 'Data not found.';
        });
}


function handleApiError(element) {
    const message = 'Data not found.';
    element.textContent = message;
    console.error(message);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------
function loadItems() {
    // ใช้ RequestApi เพื่อดึงข้อมูล Items
    RequestApi('http://localhost:5263/api/Item')
        .then(data => {
            const itemInfo = document.querySelector("#TableItem");
            itemInfo.innerHTML = ''; // Clear content in table

            // สร้างแถวใหม่ในตารางโดยใช้ข้อมูลที่ได้จาก API
            const rows = data.map(({ id, name }) => `
                <tr>
                    <td>${id}</td>
                    <td>${name}</td>
                </tr>
            `).join('');

            itemInfo.innerHTML = rows; // เพิ่มแถวใหม่ในตาราง
        })
        .catch(() => handleApiError(itemInfo));
}
//-------------------------------------------------------------------------------------------------------------------------------------------------

function fetchItem() {
    const itemId = document.getElementById('itemId').value;
    const itemNameElement = document.getElementById('itemName');

    if (!itemId) {
        itemNameElement.textContent = 'Please enter an item ID.';
        return;
    }
    RequestApi(`http://localhost:5263/api/Item/${itemId}`)
        .then(item => {
            itemNameElement.textContent = `Name: ${item.name}`;
        })
        .catch(() => handleApiError(itemNameElement));
}
//-------------------------------------------------------------------------------------------------------------------------------------------------
function addItem() {
    const nameInput = document.getElementById('name-input').value;
    if (!nameInput) {
        alert('Please enter a name.');
        return;
    }
    // ใช้ RequestApi เพื่อเรียก POST request
    RequestApi('http://localhost:5263/api/Item', {}, 'POST', { name: nameInput })
        .then(data => {
            loadItems(); // โหลดข้อมูลที่อัปเดต
            document.getElementById('name-input').value = ''; // ล้างช่อง input
        })
        .catch(() => handleApiError());
}
//-------------------------------------------------------------------------------------------------------------------------------------------------
function updateItem() {
    const itemId = document.getElementById('updateItemId').value;
    const newName = document.getElementById('updateName').value;

    if (!itemId || !newName) {
        alert('Please enter both item ID and new name.');
        return;
    }
    RequestApi(`http://localhost:5263/api/Item/${itemId}`, {}, 'PUT', { id: itemId, name: newName })
        .then(() => {
            loadItems(); // โหลดข้อมูลที่อัปเดต
            document.getElementById('updateItemId').value = ''; // ล้างช่อง input
            document.getElementById('updateName').value = '';
            alert('Item updated successfully.');
        })
        .catch(() => handleApiError());
}
//-------------------------------------------------------------------------------------------------------------------------------------------------
function deleteItem() {
    const itemId = document.getElementById('itemIdToDelete').value;

    if (!itemId || !confirm('Are you sure you want to delete this item?')) return;

    // ใช้ RequestApi เพื่อทำ DELETE request
    RequestApi(`http://localhost:5263/api/Item/${itemId}`, {}, 'DELETE')
        .then(() => {
            loadItems(); // โหลดข้อมูลใหม่หลังจากลบ
            alert('Item has been deleted successfully.');
        })
        .catch(() => handleApiError());
}

//-------------------------------------------------------------------------------------------------------------------------------------------------
loadItems();

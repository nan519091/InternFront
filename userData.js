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
function loadUsers() {
    // ใช้ RequestApi เพื่อดึงข้อมูลผู้ใช้
    RequestApi('http://localhost:5263/api/User')
        .then(data => {
            const userInfo = document.querySelector("#TableUser");
            userInfo.innerHTML = ''; // Clear content in table
            // สร้างแถวใหม่ในตารางโดยใช้ข้อมูลที่ได้จาก API
            const rows = data.map(({ id, name }) => `
                <tr>
                    <td>${id}</td>
                    <td>${name}</td>
                </tr>
            `).join('');
            userInfo.innerHTML = rows; // เพิ่มแถวใหม่ในตาราง
        })
        .catch(() => handleApiError(userNameElement));
}
//-------------------------------------------------------------------------------------------------------------------------------------------------

function fetchUser() {
    const userId = document.getElementById('userId').value;
    const userNameElement = document.getElementById('userName');

    if (!userId) {
        userNameElement.textContent = 'Please enter a user ID.';
        return;
    }
    RequestApi(`http://localhost:5263/api/User/${userId}`)
        .then(user => {
            userNameElement.textContent = `Name: ${user.name}`; // แสดงชื่อผู้ใช้
        })
        .catch(() => handleApiError(userNameElement));

}
//-------------------------------------------------------------------------------------------------------------------------------------------------
function addUser() {
    const nameInput = document.getElementById('name-input').value;
    if (!nameInput) {
        alert('Please enter a name.');
        return;
    }
    // ใช้ RequestApi เพื่อเรียก POST request
    RequestApi('http://localhost:5263/api/User', {}, 'POST', { name: nameInput })
        .then(data => {
            loadUsers(); // โหลดข้อมูลผู้ใช้ที่อัปเดต
            document.getElementById('name-input').value = ''; // ล้างช่อง input
        })
        .catch(() => handleApiError(userNameElement));
}
//-------------------------------------------------------------------------------------------------------------------------------------------------
function updateUser() {
    const userId = document.getElementById('updateUserId').value;
    const newName = document.getElementById('updateName').value;

    if (!userId || !newName) {
        alert('Please enter both user ID and new name.');
        return;
    }
    RequestApi(`http://localhost:5263/api/User/${userId}`, {}, 'PUT', { id: userId, name: newName })
        .then(() => {
            loadUsers(); // โหลดข้อมูลผู้ใช้ที่อัปเดต
            document.getElementById('updateUserId').value = ''; // ล้างช่อง input
            document.getElementById('updateName').value = '';
            alert('User updated successfully.');
        })
        .catch(() => handleApiError(userNameElement));
}
//-------------------------------------------------------------------------------------------------------------------------------------------------
function deleteUser() {
    const userId = document.getElementById('userIdToDelete').value;

    if (!userId || !confirm('Are you sure you want to delete this user?')) return;
    // ใช้ RequestApi เพื่อทำ DELETE request
    RequestApi(`http://localhost:5263/api/User/${userId}`, {}, 'DELETE')
        .then(() => {
            loadUsers(); // โหลดข้อมูลผู้ใช้ใหม่หลังจากลบ
            alert('Data has been deleted successfully.');
        })
        .catch(() => handleApiError(userNameElement));
}
//-------------------------------------------------------------------------------------------------------------------------------------------------
loadUsers();




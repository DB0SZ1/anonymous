function openModal() {
    document.getElementById('messageModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('messageModal').style.display = 'none';
}

function navigateTo(action) {
    if (action === 'view') {
        window.location.href = `/view/${user_name}/${user_id}`;
    }
}

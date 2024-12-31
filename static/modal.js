// Add this as modal.js in your static folder

let currentMessageId = null;
const messageStats = {};

function openModal(messageElement) {
    currentMessageId = messageElement.dataset.messageId;
    const modal = document.getElementById('messageModal');
    const modalMessage = document.getElementById('modalMessage');
    
    // Initialize stats if not exists
    if (!messageStats[currentMessageId]) {
        messageStats[currentMessageId] = {
            likes: 0,
            hearts: 0
        };
    }

    modalMessage.textContent = messageElement.childNodes[0].textContent.trim();
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Update button states
    updateButtonStates();
}

function closeModal() {
    const modal = document.getElementById('messageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentMessageId = null;
}

function handleLike() {
    if (!currentMessageId) return;
    
    const btn = document.querySelector('.like-btn');
    const stats = messageStats[currentMessageId];
    
    if (btn.classList.contains('active')) {
        stats.likes--;
        btn.classList.remove('active');
    } else {
        stats.likes++;
        btn.classList.add('active');
    }
    
    updateStats();
}

function handleHeart() {
    if (!currentMessageId) return;
    
    const btn = document.querySelector('.heart-btn');
    const stats = messageStats[currentMessageId];
    
    if (btn.classList.contains('active')) {
        stats.hearts--;
        btn.classList.remove('active');
    } else {
        stats.hearts++;
        btn.classList.add('active');
    }
    
    updateStats();
}

function updateStats() {
    if (!currentMessageId) return;
    
    const stats = messageStats[currentMessageId];
    const messageElement = document.querySelector(`[data-message-id="${currentMessageId}"]`);
    const statsElement = messageElement.querySelector('.message-stats');
    
    // Update modal counts
    document.querySelector('.like-count').textContent = stats.likes;
    document.querySelector('.heart-count').textContent = stats.hearts;
    
    // Update message list counts
    statsElement.innerHTML = `
        ${stats.likes ? `<i class="fas fa-thumbs-up"></i> ${stats.likes} ` : ''}
        ${stats.hearts ? `<i class="fas fa-heart"></i> ${stats.hearts}` : ''}
    `;
}

function updateButtonStates() {
    if (!currentMessageId) return;
    
    const stats = messageStats[currentMessageId];
    document.querySelector('.like-count').textContent = stats.likes;
    document.querySelector('.heart-count').textContent = stats.hearts;
    
    const likeBtn = document.querySelector('.like-btn');
    const heartBtn = document.querySelector('.heart-btn');
    
    likeBtn.classList.toggle('active', stats.likes > 0);
    heartBtn.classList.toggle('active', stats.hearts > 0);
}

async function downloadAsImage() {
    const messageElement = document.querySelector('.modal-message');
    
    try {
        const canvas = await html2canvas(messageElement, {
            backgroundColor: '#f9fafb',
            scale: 2, // Higher quality
            padding: 20
        });
        
        const link = document.createElement('a');
        link.download = 'message.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Error generating image:', error);
    }
}

// Event Listeners
document.querySelector('.close-modal').addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    const modal = document.getElementById('messageModal');
    if (event.target === modal) {
        closeModal();
    }
});
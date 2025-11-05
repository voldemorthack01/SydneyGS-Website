// Check if already logged in
const authToken = sessionStorage.getItem('authToken');
if (authToken) {
    showAdminPanel();
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const loginMessage = document.getElementById('loginMessage');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const authToken = `${username}:${password}`;
            sessionStorage.setItem('authToken', authToken);
            showAdminPanel();
        } else {
            loginMessage.textContent = 'Invalid username or password.';
            loginMessage.className = 'form-message error';
        }
    } catch (error) {
        console.error('Login error:', error);
        loginMessage.textContent = 'Connection error. Please try again.';
        loginMessage.className = 'form-message error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('authToken');
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('adminSection').style.display = 'none';
    document.getElementById('loginForm').reset();
});

// Show admin panel and load submissions
async function showAdminPanel() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminSection').style.display = 'block';
    await loadSubmissions();
}

// Load submissions from server
async function loadSubmissions() {
    const submissionsBody = document.getElementById('submissionsBody');
    const authToken = sessionStorage.getItem('authToken');
    
    if (!authToken) {
        submissionsBody.innerHTML = '<tr><td colspan="5" class="loading">Not authenticated</td></tr>';
        return;
    }
    
    try {
        const response = await fetch('/api/admin/submissions', {
            headers: {
                'auth': authToken
            }
        });
        
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            submissionsBody.innerHTML = result.data.map(submission => `
                <tr>
                    <td>${formatDateTime(submission.submitted_at)}</td>
                    <td>${escapeHtml(submission.full_name)}</td>
                    <td>${escapeHtml(submission.phone)}</td>
                    <td>${escapeHtml(submission.email || 'N/A')}</td>
                    <td>${escapeHtml(submission.message)}</td>
                </tr>
            `).join('');
        } else if (result.success && result.data.length === 0) {
            submissionsBody.innerHTML = '<tr><td colspan="5" class="loading">No submissions yet</td></tr>';
        } else {
            submissionsBody.innerHTML = '<tr><td colspan="5" class="loading">Error loading submissions</td></tr>';
        }
    } catch (error) {
        console.error('Load submissions error:', error);
        submissionsBody.innerHTML = '<tr><td colspan="5" class="loading">Connection error</td></tr>';
    }
}

// Format datetime for display
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

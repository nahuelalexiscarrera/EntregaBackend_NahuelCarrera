const logoutBtn = document.getElementById('logoutBtn')

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await fetch('/api/sessions/logout', { method: 'POST' })
        window.location.href = '/login'
    })
}

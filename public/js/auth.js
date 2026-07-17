const submitForm = (formId, endpoint, onSuccess) => {
    const form = document.getElementById(formId)
    if (!form) return

    form.addEventListener('submit', async e => {
        e.preventDefault()
        const body = Object.fromEntries(new FormData(form))
        if (body.age) body.age = Number(body.age)

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        const data = await res.json()

        if (data.status === 'success') {
            onSuccess()
        } else {
            document.getElementById('formError').textContent = data.message
        }
    })
}

submitForm('loginForm', '/api/sessions/login', () => { window.location.href = '/products' })
submitForm('registerForm', '/api/sessions/register', () => { window.location.href = '/login' })

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', async () => {
        const { pid, cart } = button.dataset
        const originalLabel = button.textContent
        button.disabled = true
        button.textContent = 'Agregando…'

        try {
            const response = await fetch(`/api/carts/${cart}/products/${pid}`, { method: 'POST' })
            const data = await response.json()

            if (data.status === 'success') {
                button.textContent = 'Agregado ✓'
                window.setTimeout(() => {
                    button.textContent = originalLabel
                    button.disabled = false
                }, 1500)
            } else {
                button.textContent = originalLabel
                button.disabled = false
                window.alert(data.message)
            }
        } catch {
            button.textContent = originalLabel
            button.disabled = false
            window.alert('No se pudo agregar el producto. Intentá nuevamente.')
        }
    })
})

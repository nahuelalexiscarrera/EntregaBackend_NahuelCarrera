document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', async () => {
        const { pid, cart } = button.dataset
        const res = await fetch(`/api/carts/${cart}/products/${pid}`, { method: 'POST' })
        const data = await res.json()
        if (data.status === 'success') {
            button.textContent = 'Agregado ✓'
            setTimeout(() => { button.textContent = 'Agregar al carrito' }, 1500)
        } else {
            alert(data.message)
        }
    })
})

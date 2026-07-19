document.querySelectorAll('.remove-from-cart').forEach(button => {
    button.addEventListener('click', async () => {
        const { pid, cart } = button.dataset
        const res = await fetch(`/api/carts/${cart}/products/${pid}`, { method: 'DELETE' })
        const data = await res.json()
        if (data.status === 'success') {
            window.location.reload()
        } else {
            alert(data.message)
        }
    })
})

const purchaseBtn = document.getElementById('purchaseBtn')

if (purchaseBtn) {
    purchaseBtn.addEventListener('click', async () => {
        const res = await fetch(`/api/carts/${purchaseBtn.dataset.cart}/purchase`, { method: 'POST' })
        const data = await res.json()
        const result = document.getElementById('ticketResult')

        if (data.status === 'success' && data.payload.ticket) {
            const { code, amount, purchaser } = data.payload.ticket
            const pending = data.payload.notProcessedIds.length
            result.innerHTML = `
                <h3>¡Compra confirmada!</h3>
                <p>Número de compra: ${code}</p>
                <p>Total: $${amount}</p>
                <p>Enviamos la confirmación a: ${purchaser}</p>
                ${pending ? `<p>${pending} producto(s) siguen en tu carrito porque ya no tienen stock suficiente.</p>` : ''}
            `
            purchaseBtn.disabled = true
        } else {
            result.innerHTML = `<p>${data.message}</p>`
        }
    })
}

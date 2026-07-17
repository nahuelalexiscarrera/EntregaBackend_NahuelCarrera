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
                <h3>Compra realizada</h3>
                <p>Ticket: ${code}</p>
                <p>Total: $${amount}</p>
                <p>Comprador: ${purchaser}</p>
                ${pending ? `<p>${pending} producto(s) quedaron en el carrito por falta de stock.</p>` : ''}
            `
            purchaseBtn.disabled = true
        } else {
            result.innerHTML = `<p>${data.message}</p>`
        }
    })
}

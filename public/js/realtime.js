const socket = io()
const form = document.getElementById('productForm')
const list = document.getElementById('productList')
const errorBox = document.getElementById('socketError')

socket.on('updateProducts', products => {
    list.innerHTML = ''
    products.forEach(p => {
        const li = document.createElement('li')
        li.innerHTML = `<strong>${p.title}</strong> — $${p.price} | Stock: ${p.stock} | Categoría: ${p.category}
            <button onclick="removeProduct('${p._id}')">Eliminar</button>`
        list.appendChild(li)
    })
})

socket.on('productError', message => {
    errorBox.textContent = message
    setTimeout(() => { errorBox.textContent = '' }, 3000)
})

form.addEventListener('submit', e => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(form))
    data.price = Number(data.price)
    data.stock = Number(data.stock)
    socket.emit('newProduct', data)
    form.reset()
})

function removeProduct(id) {
    socket.emit('deleteProduct', id)
}

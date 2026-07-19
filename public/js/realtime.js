const socket = io()
const form = document.getElementById('productForm')
const list = document.getElementById('productList')
const errorBox = document.getElementById('socketError')
const productCount = document.getElementById('productCount')

const resolveImage = thumbnails => {
    const image = Array.isArray(thumbnails) ? thumbnails[0] : ''
    if (!image) return ''
    if (/^(?:https?:)?\/\//.test(image) || image.startsWith('/')) return image
    return `/${image}`
}

const createProductItem = product => {
    const item = document.createElement('li')
    item.className = 'admin-product'

    const imagePath = resolveImage(product.thumbnails)
    if (imagePath) {
        const image = document.createElement('img')
        image.src = imagePath
        image.alt = ''
        image.width = 72
        image.height = 72
        item.appendChild(image)
    } else {
        const placeholder = document.createElement('span')
        placeholder.className = 'admin-product-placeholder'
        placeholder.textContent = 'S/I'
        placeholder.setAttribute('aria-label', 'Sin imagen')
        item.appendChild(placeholder)
    }

    const content = document.createElement('div')
    content.className = 'admin-product-content'

    const title = document.createElement('strong')
    title.textContent = product.title

    const meta = document.createElement('span')
    meta.textContent = `${product.category} · ${product.code}`

    const data = document.createElement('span')
    data.textContent = `USD ${Number(product.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })} · Stock ${product.stock}`

    content.append(title, meta, data)

    const removeButton = document.createElement('button')
    removeButton.className = 'button button-danger button-compact'
    removeButton.type = 'button'
    removeButton.textContent = 'Eliminar'
    removeButton.setAttribute('aria-label', `Eliminar ${product.title}`)
    removeButton.addEventListener('click', () => socket.emit('deleteProduct', product._id))

    item.append(content, removeButton)
    return item
}

socket.on('updateProducts', products => {
    list.replaceChildren(...products.map(createProductItem))
    productCount.textContent = `${products.length} producto${products.length === 1 ? '' : 's'}`
})

socket.on('productError', message => {
    errorBox.textContent = message
    window.setTimeout(() => { errorBox.textContent = '' }, 3000)
})

form.addEventListener('submit', event => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(form))
    data.price = Number(data.price)
    data.stock = Number(data.stock)
    data.thumbnails = data.thumbnail ? [data.thumbnail] : []
    delete data.thumbnail
    socket.emit('newProduct', data)
    form.reset()
})

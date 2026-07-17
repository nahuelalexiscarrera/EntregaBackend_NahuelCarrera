import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { config } from '../src/config/env.js'
import { Product } from '../src/models/product.model.js'
import { User } from '../src/models/user.model.js'
import { Cart } from '../src/models/cart.model.js'
import { hashPassword } from '../src/utils/hash.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const seed = async () => {
    await mongoose.connect(config.mongoUri)

    const raw = await fs.readFile(path.resolve(__dirname, '../src/data/products.json'), 'utf-8')
    const products = JSON.parse(raw).products.map(({ id, ...product }) => product)

    await Product.deleteMany({})
    await Product.insertMany(products)
    console.log(`${products.length} productos cargados`)

    const existingAdmin = await User.findOne({ email: config.adminEmail })
    if (!existingAdmin) {
        const cart = await Cart.create({})
        await User.create({
            first_name: 'Admin',
            last_name: 'Coder',
            email: config.adminEmail,
            password: hashPassword(config.adminPassword),
            cart: cart._id,
            role: 'admin'
        })
        console.log(`Usuario admin creado: ${config.adminEmail}`)
    } else {
        console.log('Usuario admin ya existente')
    }

    await mongoose.disconnect()
}

seed().catch(error => {
    console.error('Error al ejecutar el seed:', error.message)
    process.exit(1)
})

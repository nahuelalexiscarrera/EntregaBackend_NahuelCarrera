import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            _id: false,
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
            quantity: { type: Number, default: 1, min: 1 }
        }],
        default: []
    }
})

export const Cart = mongoose.model('carts', cartSchema)

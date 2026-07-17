import mongoose from 'mongoose'
import { randomUUID } from 'node:crypto'

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true, default: () => randomUUID() },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true, min: 0 },
    purchaser: { type: String, required: true }
})

export const Ticket = mongoose.model('tickets', ticketSchema)

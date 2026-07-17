import mongoose from 'mongoose'
import { config } from './env.js'

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUri)
        console.log('Conexión a MongoDB establecida')
    } catch (error) {
        console.error('No se pudo conectar a MongoDB:', error.message)
        process.exit(1)
    }
}

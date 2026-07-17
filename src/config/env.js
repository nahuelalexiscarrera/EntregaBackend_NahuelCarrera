import dotenv from 'dotenv'

dotenv.config()

export const config = {
    port: process.env.PORT ?? 8080,
    mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/entrega_final',
    jwtSecret: process.env.JWT_SECRET ?? 'dev_secret',
    cookieName: process.env.COOKIE_NAME ?? 'authToken',
    adminEmail: process.env.ADMIN_EMAIL ?? 'admin@coder.com',
    adminPassword: process.env.ADMIN_PASSWORD ?? 'admin1234'
}

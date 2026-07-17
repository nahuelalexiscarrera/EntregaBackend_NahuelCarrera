import { User } from '../models/user.model.js'

class UserService {
    async getByEmail(email) {
        return User.findOne({ email })
    }

    async getById(id) {
        return User.findById(id).select('-password').lean()
    }

    async create(data) {
        const user = await User.create(data)
        return user.toObject()
    }
}

export const userService = new UserService()

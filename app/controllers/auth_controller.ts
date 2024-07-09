import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    try {
      const data = request.only(['nombre', 'email', 'password', 'rol'])
      const exist = await User.query().where('email', data.email).first()
      if (!exist) {
        const user = await User.create(data)
        const token = await User.accessTokens.create(user)
        return {
          type: 'Bearer',
          token: token.value!.release(),
        }
      } else {
        return response.badRequest({ message: 'Usuario ' + data.email + ' ya existe' })
      }
    } catch (error) {
      console.log(error)
      return response.badRequest({ message: 'Error interno' })
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const data = request.only(['email', 'password'])
      const user = await User.verifyCredentials(data.email, data.password)
      const token = await User.accessTokens.create(user)
      return {
        type: 'Bearer',
        token: token.value!.release(),
      }
    } catch (error) {
      console.log(error)
      return response.unauthorized()
    }
  }

  async logout({ auth, response }: HttpContext) {
    try {
      const userId = auth.user?.id
      const user = await User.findOrFail(userId)
      await User.accessTokens.delete(user, user.id)
      return response.ok({
        success: true,
        message: 'Logged out ok!',
      })
    } catch (error) {
      console.log(error)
      return response.unauthorized()
    }
  }

  async me({ auth, response }: HttpContext) {
    try {
      await auth.authenticate()
      const user = await auth.getUserOrFail()
      return response.json(user)
    } catch (error) {
      console.log(error)
      return response.unauthorized('Usuario no autorizado')
    }
  }
}

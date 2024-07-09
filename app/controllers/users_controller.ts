import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const users = await User.all()
    return response.json(users)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['nombre', 'email', 'password', 'rol'])
    const exist = await User.query().where('email', data.email).first()
    if (!exist) {
      const user = await User.create(data)
      return response.created(user)
    } else {
      return response.badRequest({ message: 'Usuario ' + data.email + ' ya existe' })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return response.json(user)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    if (user) {
      const data = request.only(['nombre', 'email', 'password', 'rol'])
      user.nombre = data.nombre
      user.email = data.email
      user.password = data.password
      user.rol = data.rol
      await user.save()
      return response.json(user)

    } else {
      return response.badRequest({ message: "Usuario no existe" })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    if (user) {
      await user.delete()
      return response.json({message: "Usuario eliminado!"})

    } else {
      return response.badRequest({ message: "Usuario no existe" })
    }
  }
}

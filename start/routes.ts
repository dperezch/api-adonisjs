/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import AuthController from '#controllers/auth_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.group(() => {
      router.resource('usuarios', UsersController)
      router.get('me', [AuthController, 'me'])
      router.get('logout', [AuthController, 'logout'])
    }).use(
      middleware.auth({
        guards: ['api']
      })
    )

    router.group(() => {
      router.post('login', [AuthController, 'login'])
      router.post('register', [AuthController, 'register'])
    }).prefix('/auth')
  })
  .prefix('/api/v1')

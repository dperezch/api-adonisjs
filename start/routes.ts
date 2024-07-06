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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.group(() => {
      router.resource('usuarios', UsersController)
    })

    router.group(() => {
      //router.resource('usuarios', UsersController)
    })
  })
  .prefix('/api/v1')

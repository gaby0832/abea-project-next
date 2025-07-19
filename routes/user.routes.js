import userController from '../controllers/user.controller.js'

export default async function userRoutes(app, opts) {
  app.get('/', userController.listUsers)
  app.post('/register', userController.createUser)
  app.post('/login', userController.loginUser)
}
import Fastify from 'fastify'
import cors from '@fastify/cors'
import sql from './config/sql.js'
import userRoutes from './routes/user.routes.js'

const app = Fastify()

await app.register(cors, { origin: '*' })
app.register(userRoutes, { prefix: '/users' })

export default app;

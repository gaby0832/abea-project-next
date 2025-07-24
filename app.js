import Fastify from 'fastify'
import cors from '@fastify/cors'
import sql from './config/sql.js'
import userRoutes from './routes/user.routes.js'
import apiKeyAuth from './plugins/apiKeyAuth.js'
import logRequest from './plugins/logRequest.js'
import rateLimit from '@fastify/rate-limit'
import authPlugin from './plugins/auth.js'

const app = Fastify({ logger: true })

app.register(cors, { origin: '*' });

app.register(rateLimit, {
  global: true,
  max: 100,
  timeWindow: '10 minutes',
  errorResponseBuilder: (req, context) => {
    logRequest(req)
    return {
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Você excedeu o limite de requisições. Tente novamente em ${context.ttl / 1000} segundos.`
    }
  }
})

app.register(authPlugin);
app.register(apiKeyAuth);
app.register(userRoutes, { prefix: '/users' });


export default app;

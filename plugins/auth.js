import fp from 'fastify-plugin'

export default fp(async function (app) {
  // Registra o plugin de JWT
  app.register(import('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'chave_super_secreta'
  })

  // Decorador para ser usado nas rotas
  app.decorate('authenticate', async function (req, reply) {
    try {
      await req.jwtVerify()  // verifica se o token JWT é válido
    } catch (err) {
      reply.code(401).send({ error: 'Token inválido ou ausente' })
    }
  })
})
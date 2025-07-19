import sql from '../config/sql.js';
import bcrypt from 'bcrypt'
import { createUserSchema, loginUserSchema } from '../schemas/user.schema.js'

const listUsers = async (request, reply) => {
  const users = await sql`SELECT * FROM usuarios`
  reply.send({data: users, success: true})
}

// 👇 função para criar usuário
const createUser = async (request, reply) => {
  const { error, value } = createUserSchema.validate(request.body)

  if (error) {
    return reply.send({ message: 'Todos os campos são obrigatórios', error: error.details })
  }

  const {name, email, password} = value;

  const userExists = await sql`
    SELECT 1 FROM usuarios WHERE email like ${email + '%'}
  `
  if (userExists.length > 0) {
    return reply.send({ message: 'Usuário já existe'})
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await sql`
    INSERT INTO usuarios (nome, email, senha)
    VALUES (${name}, ${email}, ${hashedPassword})
    RETURNING id, nome, email
  `
  
  return reply.send({ message: 'Usuário criado com sucesso!'})
}


const loginUser = async (request, reply) => {
  const { error, value } = loginUserSchema.validate(request.body)

  if (error) {
    return reply.send({ message: 'Todos os campos são obrigatórios', error: error.details })
  }

  const {email, password} = value;

  const userExists = await sql`
    SELECT email, senha
    FROM usuarios WHERE email like ${email + '%'}
  `

  if (userExists.length <= 0) {
    return reply.send({ message: 'Usuário não existe'})
  }

  if (userExists && await bcrypt.compare(password, userExists[0].senha)) {
    return reply.send({ message: 'Usuário logado com sucesso!'})
  }
  
  return reply.send({ message: 'Credenciais invalidas '})
}

export default { listUsers, createUser, loginUser }


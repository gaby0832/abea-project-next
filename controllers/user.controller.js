import sql from '../config/sql.js';
import bcrypt from 'bcrypt'
import { createUserSchema, loginUserSchema } from '../schemas/user.schema.js'

const listUsers = async (request, reply) => {
  const users = await sql`SELECT * FROM users`
  reply.send({data: users, success: true})
}

const createUser = async (request, reply) => {
  const { error, value } = createUserSchema.validate(request.body)

  if (error) {
    return reply.send({ message: 'Todos os campos são obrigatórios', error: error.details })
  }

  const {name, email, password} = value;

  const userExists = await sql`
    SELECT 1 FROM users WHERE email like ${email + '%'}
  `
  if (userExists.length > 0) {
    return reply.send({ message: 'Usuário já existe'})
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${hashedPassword})
    RETURNING id, name, email
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
    SELECT email, password
    FROM users WHERE email like ${email + '%'}
  `

  if (userExists.length <= 0) {
    return reply.send({ message: 'Usuário não existe'})
  }

  
  if (userExists && await bcrypt.compare(password, userExists[0].senha)) {
    const token = req.server.jwt.sign(
      { id: userExists[0].id, email: userExists[0].email },  // payload
      { expiresIn: '1h' } // tempo de expiração
    );
    
    return reply.send({ message: 'Usuário logado com sucesso!', data: { token: token }})
  }
  
  return reply.send({ message: 'Credenciais invalidas '})





}

export default { listUsers, createUser, loginUser }


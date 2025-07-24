import sql from '../config/sql.js';
import bcrypt from 'bcrypt'
import { createUserSchema, loginUserSchema } from '../schemas/user.schema.js'

const listUsers = async (request, reply) => {
  const users = await sql`SELECT * FROM users`
  reply.send({ data: {users, success: true} })
} 

const createUser = async (request, reply) => {
  const { error, value } = createUserSchema.validate(request.body, { abortEarly: false })



  if (error) {
    const errorMessages = error.details.map(err => ({
      field: err.context.label,
      message: err.message
    }));

    return reply.send({ data: {message: 'Todos os campos são obrigatórios', error: errorMessages}  })
  }

  const {name, email, password} = value;

  const userExists = await sql`
    SELECT 1 FROM users WHERE email like ${email + '%'}
  `
  if (userExists.length > 0) {
    return reply.send({ data: {message: 'Usuário já existe'} })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${hashedPassword})
    RETURNING id, name, email
  `
  
  return reply.send({ data: {message: 'Usuário criado com sucesso!', success: true} })
}


const loginUser = async (request, reply) => {
  const { error, value } = loginUserSchema.validate(request.body)

  if (error) {
    const errorMessages = error.details.map(err => ({
      field: err.context.label,
      message: err.message
    }));

    return reply.send({ message: 'Todos os campos são obrigatórios', error: errorMessages })
  }
  const {email, password} = value;

  const userExists = await sql`
    SELECT email, password
    FROM users WHERE email like ${email + '%'}
  `

  if (userExists.length <= 0) {
    return reply.send({ data: { message: 'Usuário não registrado' } })
  }
  
  if (userExists && await bcrypt.compare(password, userExists[0].password)) {
    const token = request.server.jwt.sign(
      { id: userExists[0].id, email: userExists[0].email },  // payload
      { expiresIn: '1h' } // tempo de expiração
    );

    return reply.send({ data: { token: token, message: 'Usuário logado com sucesso!', success: true } })
  
  }else if(!userExists || await !bcrypt.compare(password, userExists[0].password)){
      return reply.send({  data: { message: 'Email ou senha invalidos' }});
  }
  
  return reply.send({ data: { message: 'Credenciais invalidas' } })

}

export default { listUsers, createUser, loginUser }


import dotenv from 'dotenv'
import postgres from 'postgres'

dotenv.config();

const sql = postgres({
  host: 'localhost',
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
})

export default sql;
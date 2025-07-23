import sql from './config/sql.js'

const createTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_in TIMESTAMP DEFAULT NOW()
    )
  `

  console.log('✅ Tabela usuarios criada (ou já existia)')
  await sql.end() // Fecha a conexão
}

createTable().catch((err) => {
  console.error('Erro ao criar tabela:', err)
  sql.end()
})
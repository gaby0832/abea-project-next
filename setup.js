import sql from './config/sql.js'

const createTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      criado_em TIMESTAMP DEFAULT NOW()
    )
  `

  console.log('✅ Tabela usuarios criada (ou já existia)')
  await sql.end() // Fecha a conexão
}

createTable().catch((err) => {
  console.error('Erro ao criar tabela:', err)
  sql.end()
})
// arquivo: gerar-hash.js

const bcrypt = require('bcrypt')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Digite a senha para gerar o hash: ', async (password) => {
  try {
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    console.log('\n👉 Hash gerado:\n', hash)
    console.log('\nUse esse valor no seu INSERT SQL:')
    console.log(
      `INSERT INTO users (id, name, email, password, role) VALUES ('<UUID>', 'Super Admin', 'admin@seu-dominio.com', '${hash}', 'superadmin');`
    )
  } catch (err) {
    console.error('Erro ao gerar hash:', err)
  } finally {
    rl.close()
  }
})

import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 3306,
  user: process.env.DATABASE_USER || 'user',
  password: process.env.DATABASE_PASSWORD || '',
  schema: process.env.DATABASE_SCHEMA || 'spaceflix',
}))

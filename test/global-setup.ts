import 'tsconfig-paths/register'
import { DataSource } from 'typeorm'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'

const setup = async () => {
  if (process.env.NODE_ENV != 'TEST') {
    console.log('[setup-e2e.ts]', "It's not TEST environment. Please check NODE_ENV.")
    return
  }

  const isMainSchema = process.env.DATABASE_SCHEMA == 'spaceflix'
  const dataSource: DataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_SCHEMA,
    dropSchema: !isMainSchema,
  })

  await dataSource.initialize()
  await dataSource.synchronize(true)
  await dataSource.destroy()

  const schemaName = dataSource.options.database
  console.log('[global-jest-setup.ts]', `Schema Name: ${schemaName}, synchronized.`)

  const fixture = await Test.createTestingModule({ imports: [AppModule] }).compile()
  const app = fixture.createNestApplication()
  await app.init()
  await app.close()
}

export default setup

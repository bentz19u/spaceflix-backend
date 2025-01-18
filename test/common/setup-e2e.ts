import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../src/app.module'

let app: INestApplication
let moduleFixture: TestingModule

beforeAll(async () => {
  moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  app = moduleFixture.createNestApplication()
  app.useGlobalPipes(new ValidationPipe())
  await app.init()

  // Attach to the global scope for reuse in tests
  global['__APP__'] = app
  global['__MODULE_FIXTURE__'] = moduleFixture
})

afterAll(async () => {
  if (app) {
    await app.close()
  }
})

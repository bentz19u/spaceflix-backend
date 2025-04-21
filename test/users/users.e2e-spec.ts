import { HttpStatus, INestApplication } from '@nestjs/common'
import request from 'supertest'
import { E2eHelper } from './common/e2e-helper'
import { PostStep1RequestDto } from '../../src/users/dtos/post-step1-request.dto'
import { LoginRequestDto } from '@auth/dtos/login-request.dto'
import { UserPlanEnum } from '../../src/common/enums/plan.enum'
import { CreateUserRequestDto } from '../../src/users/dtos/create-user-request.dto'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let e2eHelper: E2eHelper

  const USER_EMAIL = 'daniel.bentz+3@test.com'
  const DELETED_USER = 'daniel.bentz+4@test.com'
  const NEW_USER = 'daniel.bentz+new@test.com'

  beforeAll(async () => {
    e2eHelper = new E2eHelper()
    app = e2eHelper.getApp()
    await e2eHelper.init()

    const usersDummy = e2eHelper.getUsersDummy()

    await usersDummy.insertUsers()
  })

  describe('GET /users/is-registrable', () => {
    it(`400 - email not valid`, async () => {
      const notEmail = 'daniel.bentz'

      await request(app.getHttpServer()).get(`/users/is-registrable?email=${notEmail}`).expect(HttpStatus.BAD_REQUEST)
    })

    it(`200 - user already registered`, async () => {
      const email = encodeURIComponent(USER_EMAIL)

      await request(app.getHttpServer())
        .get(`/users/is-registrable?email=${email}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.isAvailable).toBe(false)
          expect(res.body.canActivate).toBe(false)
        })
    })

    it(`200 - user deleted`, async () => {
      const email = encodeURIComponent(DELETED_USER)

      await request(app.getHttpServer())
        .get(`/users/is-registrable?email=${email}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.isAvailable).toBe(false)
          expect(res.body.canActivate).toBe(true)
        })
    })

    it(`200 - user unregistered`, async () => {
      const email = encodeURIComponent(NEW_USER)

      await request(app.getHttpServer())
        .get(`/users/is-registrable?email=${email}`)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.isAvailable).toBe(true)
          expect(res.body.canActivate).toBe(false)
        })
    })
  })

  describe('POST /users/step1', () => {
    it(`400 - email not valid`, async () => {
      const requestDto: PostStep1RequestDto = {
        email: 'daniel.bentz',
        password: 'Password1234',
      }

      await request(app.getHttpServer())
        .post(`/users/step1`)
        .send(requestDto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.error).toBeDefined()
          expect(res.body.error.code).toBe('client-0000')
          expect(res.body.error.description).toBeDefined()
          expect(res.body.error.description[0].value).toBe('daniel.bentz')
        })
    })

    it(`400 - password is not valid`, async () => {
      const requestDto: PostStep1RequestDto = {
        email: 'daniel.bentz@gmail.com',
        password: '1234',
      }

      await request(app.getHttpServer())
        .post(`/users/step1`)
        .send(requestDto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.error).toBeDefined()
          expect(res.body.error.code).toBe('client-0000')
          expect(res.body.error.description).toBeDefined()
          expect(res.body.error.description[0].value).toBe('1234')
        })
    })

    it(`204 - Email and Password valid`, async () => {
      const requestDto: PostStep1RequestDto = {
        email: 'daniel.bentz@gmail.com',
        password: 'zr9hQBt2EcjT',
      }
      await request(app.getHttpServer()).post('/users/step1').send(requestDto).expect(HttpStatus.NO_CONTENT)
    })
  })

  describe('POST /users', () => {
    it(`400 - email not valid`, async () => {
      const requestDto: CreateUserRequestDto = {
        email: 'daniel.bentz',
        password: 'Password1234',
        plan: UserPlanEnum.STANDARD,
      }

      await request(app.getHttpServer())
        .post(`/users`)
        .send(requestDto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.error).toBeDefined()
          expect(res.body.error.code).toBe('client-0000')
          expect(res.body.error.description).toBeDefined()
          expect(res.body.error.description[0].value).toBe('daniel.bentz')
        })
    })

    it(`400 - password is not valid`, async () => {
      const requestDto: CreateUserRequestDto = {
        email: 'daniel.bentz@gmail.com',
        password: '1234',
        plan: UserPlanEnum.STANDARD,
      }

      await request(app.getHttpServer())
        .post(`/users`)
        .send(requestDto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.error).toBeDefined()
          expect(res.body.error.code).toBe('client-0000')
          expect(res.body.error.description).toBeDefined()
          expect(res.body.error.description[0].value).toBe('1234')
        })
    })

    it(`400 - plan is not valid`, async () => {
      const requestDto = {
        email: 'daniel.bentz@gmail.com',
        password: 'zr9hQBt2EcjT',
        plan: 'toto',
      }

      await request(app.getHttpServer())
        .post(`/users`)
        .send(requestDto)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.error).toBeDefined()
          expect(res.body.error.code).toBe('client-0000')
          expect(res.body.error.description).toBeDefined()
          expect(res.body.error.description[0].value).toBe('toto')
        })
    })

    it(`204 - Email and Password valid`, async () => {
      const requestDto: CreateUserRequestDto = {
        email: 'daniel.bentz@gmail.com',
        password: 'zr9hQBt2EcjT',
        plan: UserPlanEnum.STANDARD,
      }
      await request(app.getHttpServer()).post('/users').send(requestDto).expect(HttpStatus.CREATED)
    })
  })
})

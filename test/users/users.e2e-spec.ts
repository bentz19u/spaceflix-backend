import { HttpStatus, INestApplication } from '@nestjs/common'
import request from 'supertest'
import { E2eHelper } from './common/e2e-helper'

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
})

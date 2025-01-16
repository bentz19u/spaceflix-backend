import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { E2eHelper } from './common/e2e-helper'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let e2eHelper: E2eHelper

  let accessToken
  let refreshToken

  beforeAll(async () => {
    e2eHelper = new E2eHelper()
    app = e2eHelper.getApp()

    const usersDummy = e2eHelper.getUsersDummy()

    await usersDummy.insertUsers()

    const tokens = await e2eHelper.getTokens('daniel.bentz@test.com', 'zr9hQBt2EcjT')
    accessToken = tokens.accessToken
    refreshToken = tokens.refreshToken
  })

  describe('/logout', () => {
    it(`401 - Refresh token not found`, async () => {
      await request(app.getHttpServer()).post('/logout').expect(HttpStatus.NOT_FOUND)
    })

    it(`200 - Successful logout`, async () => {
      await request(app.getHttpServer())
        .get(`/logout`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatus.OK)
    })

    it(`200 - Is token removed?`, async () => {
      await request(app.getHttpServer())
        .post(`/refresh`)
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(HttpStatus.FORBIDDEN)
    })
  })
})

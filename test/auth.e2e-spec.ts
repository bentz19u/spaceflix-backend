import { HttpStatus, INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { E2eHelper } from './common/e2e-helper'
import { LoginRequestDto } from '@auth/dtos/login-request.dto'
import { ErrorCodes } from '../src/common/constants/error-code.constant'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let e2eHelper: E2eHelper

  let accessToken
  let refreshToken

  const USER_EMAIL = 'daniel.bentz@test.com'
  const TOO_MANY_TRY_USER_EMAIL = 'daniel.bentz+1@test.com'
  const TOO_MANY_TRY_ID = 2

  beforeAll(async () => {
    e2eHelper = new E2eHelper()
    app = e2eHelper.getApp()
    await e2eHelper.init()

    const usersDummy = e2eHelper.getUsersDummy()
    const loginAttemptsDummy = e2eHelper.getLoginAttemptsDummy()

    await usersDummy.insertUsers()
    await loginAttemptsDummy.insertLoginAttempts(TOO_MANY_TRY_ID)

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

  describe('/login', () => {
    it(`400 - Validation pipe, missing data`, async () => {
      await request(app.getHttpServer())
        .post('/login')
        .set('remote_addr', '106.255.247.162')
        .expect(HttpStatus.BAD_REQUEST)
    })

    it(`401 - Wrong password`, async () => {
      const requestDto: LoginRequestDto = {
        email: USER_EMAIL,
        password: 'falsePassword',
      }
      await request(app.getHttpServer())
        .post(`/login`)
        .set('remote_addr', '106.255.247.162')
        .send(requestDto)
        .expect(HttpStatus.UNAUTHORIZED)
    })

    it(`201 - User Authenticated, tokens provided`, async () => {
      const requestDto: LoginRequestDto = {
        email: USER_EMAIL,
        password: 'zr9hQBt2EcjT',
      }
      await request(app.getHttpServer())
        .post('/login')
        .set('remote_addr', '106.255.247.162')
        .send(requestDto)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined()
          expect(res.body.refreshToken).toBeDefined()
          accessToken = res.body.accessToken
          refreshToken = res.body.refreshToken
        })
    })

    it(`404 - User not found`, async () => {
      const requestDto: LoginRequestDto = {
        email: 'unknown@gmail.com',
        password: 'zr9hQBt2EcjT',
      }
      await request(app.getHttpServer())
        .post(`/login`)
        .set('remote_addr', '106.255.247.162')
        .send(requestDto)
        .expect(HttpStatus.NOT_FOUND)
    })

    it(`401 - Too many connexions, Wrong password`, async () => {
      const requestDto: LoginRequestDto = {
        email: TOO_MANY_TRY_USER_EMAIL,
        password: 'falsePassword',
      }
      await request(app.getHttpServer())
        .post(`/login`)
        .set('remote_addr', '106.255.247.162')
        .send(requestDto)
        .expect(HttpStatus.UNAUTHORIZED)
    })

    it(`403 - Too many connexions, User on cooldown`, async () => {
      const requestDto: LoginRequestDto = {
        email: TOO_MANY_TRY_USER_EMAIL,
        password: 'zr9hQBt2EcjT',
      }
      await request(app.getHttpServer())
        .post(`/login`)
        .set('remote_addr', '106.255.247.162')
        .send(requestDto)
        .expect(HttpStatus.FORBIDDEN)
        .expect((res) => {
          expect(res.body.code).toBe(ErrorCodes.LOGIN.HAS_TOO_MANY_ATTEMPT.code)
        })
    })
  })
})

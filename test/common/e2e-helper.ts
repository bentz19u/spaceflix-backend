import { LoginResponseDto } from '@auth/dtos/login-response.dto'
import { TokensDummy } from '../dummies/tokens.dummy'
import { AuthService } from '@auth/auth.service'
import { UsersRepository } from '@entities/repositories/users.repository'
import { TestingModule } from '@nestjs/testing'
import { UsersSeederService } from '../../src/users/seeder/users-seeder.service'
import { UsersDummy } from '../dummies/users.dummy'
import { INestApplication } from '@nestjs/common'
import { SeederRepository } from '@entities/repositories/seeder.repository'
import { LoginAttemptsDummy } from '../dummies/login-attempts.dummy'
import { LoginAttemptsService } from '@auth/login-attempts/login-attempts.service'
import { LoginAttemptsRepository } from '@entities/repositories/login-attempts.repository'

export class E2eHelper {
  app: INestApplication
  moduleFixture: TestingModule

  constructor() {
    this.app = global['__APP__']
    this.moduleFixture = global['__MODULE_FIXTURE__']
  }

  async init() {
    // we will clear all table between each e2e module test
    // to avoid having insert or update from some tests messing up with the others
    const seederRepository = this.moduleFixture.get<SeederRepository>(SeederRepository)
    await seederRepository.clear()
  }

  getApp(): INestApplication {
    return this.app
  }

  getUsersDummy() {
    const usersSeederService = this.moduleFixture.get<UsersSeederService>(UsersSeederService)
    const usersRepository = this.moduleFixture.get<UsersRepository>(UsersRepository)
    return new UsersDummy(usersSeederService, usersRepository)
  }

  getLoginAttemptsDummy() {
    const loginAttemptService = this.moduleFixture.get<LoginAttemptsService>(LoginAttemptsService)
    const loginAttemptRepository = this.moduleFixture.get<LoginAttemptsRepository>(LoginAttemptsRepository)
    return new LoginAttemptsDummy(loginAttemptService, loginAttemptRepository)
  }

  getTokenDummy() {
    const authService = this.moduleFixture.get<AuthService>(AuthService)
    const usersRepository = this.moduleFixture.get<UsersRepository>(UsersRepository)
    return new TokensDummy(authService, usersRepository)
  }

  async getTokens(email: string, password: string): Promise<LoginResponseDto> {
    const authDummy = this.getTokenDummy()
    return await authDummy.getTokens(email, password)
  }
}

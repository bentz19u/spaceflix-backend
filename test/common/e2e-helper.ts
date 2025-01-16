import { LoginResponseDto } from '@auth/dtos/login-response.dto'
import { TokensDummy } from '../dummies/tokens.dummy'
import { AuthService } from '@auth/auth.service'
import { UsersRepository } from '@entities/repositories/users.repository'
import { TestingModule } from '@nestjs/testing'
import { UsersSeederService } from '../../src/users/seeder/users-seeder.service'
import { UsersDummy } from '../dummies/users.dummy'
import { INestApplication } from '@nestjs/common'

export class E2eHelper {
  app: INestApplication
  moduleFixture: TestingModule

  constructor() {
    this.app = global['__APP__']
    this.moduleFixture = global['__MODULE_FIXTURE__']
  }

  getApp(): INestApplication {
    return this.app
  }

  getUsersDummy() {
    const usersSeederService = this.moduleFixture.get<UsersSeederService>(UsersSeederService)
    const usersRepository = this.moduleFixture.get<UsersRepository>(UsersRepository)
    return new UsersDummy(usersSeederService, usersRepository)
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

import { UsersRepository } from '@entities/repositories/users.repository'
import { TestingModule } from '@nestjs/testing'
import { UsersSeederService } from '../../../src/users/seeder/users-seeder.service'
import { INestApplication } from '@nestjs/common'
import { SeederRepository } from '@entities/repositories/seeder.repository'
import { UsersDummy } from '../dummies/users.dummy'

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
    // const seederRepository = this.moduleFixture.get<SeederRepository>(SeederRepository)
    // await seederRepository.clear()
  }

  getApp(): INestApplication {
    return this.app
  }

  getUsersDummy() {
    const usersSeederService = this.moduleFixture.get<UsersSeederService>(UsersSeederService)
    const usersRepository = this.moduleFixture.get<UsersRepository>(UsersRepository)
    return new UsersDummy(usersSeederService, usersRepository)
  }
}

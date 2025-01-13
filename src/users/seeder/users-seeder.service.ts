import { Injectable, Logger } from '@nestjs/common'
import { UsersRepository } from '@entities/repositories/users.repository'
import { CreateUserSeederRequestDto } from '../dtos/create-user-seeder-request.dto'
import { UsersEntity } from '@entities/users.entity'

@Injectable()
export class UsersSeederService {
  private readonly logger = new Logger(UsersSeederService.name)

  constructor(private readonly usersRepository: UsersRepository) {}

  async seedDatabase(): Promise<any> {
    const count = await this.usersRepository.count()
    if (count > 0 || !['LOCAL'].includes(process.env.NODE_ENV)) {
      return
    }

    try {
      await this.seed()
    } catch (err) {
      this.logger.error(`UsersSeederService#seedDatabase.catch ${JSON.stringify(err)}`)
    }
  }

  async seed() {
    const users: CreateUserSeederRequestDto[] = [
      {
        id: 1,
        email: 'daniel.bentz@test.com',
        password: '$argon2id$v=19$m=65536,t=3,p=4$zuNfNlxSoJCoIMOx/GL3EQ$SPoNdDDZxhNNuWtcDOBkOoWboWMO+C4MqRnSmhptUyk',
      },
    ]

    for (const user of users) {
      await this.createForSeeder(user)
    }
  }

  async createForSeeder(request: CreateUserSeederRequestDto): Promise<UsersEntity> {
    const entity = this.usersRepository.create(request)
    return await this.usersRepository.save(entity)
  }
}

import { Injectable, Logger } from '@nestjs/common'
import { UsersRepository } from '@entities/repositories/users.repository'
import { CreateUserSeederRequestDto } from '../dto/create-user-seeder-request.dto'
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
        password: '*9B896F1E43DACFB15EDF8451C3DB932138663405',
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

import { isEmpty } from 'lodash'
import { UsersRepository } from '@entities/repositories/users.repository'
import { UsersEntity } from '@entities/users.entity'
import { CreateUserSeederRequestDto } from '../../../src/users/dtos/create-user-seeder-request.dto'
import { UsersSeederService } from '../../../src/users/seeder/users-seeder.service'

export class UsersDummy {
  constructor(
    private readonly usersSeederService: UsersSeederService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async insertUsers(): Promise<UsersEntity> {
    const data: CreateUserSeederRequestDto[] = [
      {
        id: 3, // registered user
        email: 'daniel.bentz+3@test.com',
        password: '$argon2id$v=19$m=65536,t=3,p=4$uSiaRcBKeWMqBraBWSBF7Q$Xuj6XMip9qqPz1qO1hIsPqi5oWqPDxspCXeVgX/UQ10',
      },
      {
        id: 4, // deleted user
        email: 'daniel.bentz+4@test.com',
        password: '$argon2id$v=19$m=65536,t=3,p=4$uSiaRcBKeWMqBraBWSBF7Q$Xuj6XMip9qqPz1qO1hIsPqi5oWqPDxspCXeVgX/UQ10',
        deletedAt: new Date('2023-03-15 10:21:00'),
      },
      {
        id: 5, // user to reactivate
        email: 'daniel.bentz+5@test.com',
        password: '$argon2id$v=19$m=65536,t=3,p=4$uSiaRcBKeWMqBraBWSBF7Q$Xuj6XMip9qqPz1qO1hIsPqi5oWqPDxspCXeVgX/UQ10',
        deletedAt: new Date('2023-03-15 10:21:00'),
      },
    ]

    let first = null
    for (const user of data) {
      const result: UsersEntity = await this.usersSeederService.createForSeeder(user)
      if (isEmpty(first)) {
        first = result
      }
    }
    return first
  }
}

import { Injectable } from '@nestjs/common'
import { InsertResult, Repository } from 'typeorm'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { UsersEntity } from '@entities/users.entity'
import { CreateUserRequestDto } from '../../users/dtos/create-user-request.dto'

@Injectable()
export class UsersRepository extends Repository<UsersEntity> {
  constructor(
    @InjectDataSource('default') private dataSource,
    @InjectRepository(UsersEntity) private repository: Repository<UsersEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async createAndEncryptedPassword(request: CreateUserRequestDto): Promise<number> {
    const result: InsertResult = await this.createQueryBuilder()
      .insert()
      .into(UsersEntity)
      .values({
        ...request,
        password: () => `UPPER(CONCAT('*', SHA1(UNHEX(SHA1("${request.password}")))))`,
      })
      .execute()

    return result.identifiers[0].id
  }
}

import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { UsersEntity } from '@entities/users.entity'

@Injectable()
export class UsersRepository extends Repository<UsersEntity> {
  constructor(
    @InjectDataSource('default') private dataSource,
    @InjectRepository(UsersEntity) private repository: Repository<UsersEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner)
  }
}

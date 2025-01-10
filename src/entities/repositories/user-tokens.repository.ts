import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { UserTokensEntity } from '@entities/user-tokens.entity'

@Injectable()
export class UserTokensRepository extends Repository<UserTokensEntity> {
  constructor(
    @InjectDataSource('default') private dataSource,
    @InjectRepository(UserTokensEntity) private repository: Repository<UserTokensEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner)
  }
}

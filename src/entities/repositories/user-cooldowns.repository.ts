import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { UserCooldownsEntity } from '@entities/user-cooldowns.entity'

@Injectable()
export class UserCooldownsRepository extends Repository<UserCooldownsEntity> {
  constructor(
    @InjectDataSource('default') private dataSource,
    @InjectRepository(UserCooldownsEntity) private repository: Repository<UserCooldownsEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner)
  }
}

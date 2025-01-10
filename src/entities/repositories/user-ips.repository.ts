import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { UserCooldownsEntity } from '@entities/user-cooldowns.entity'
import { UserIpsEntity } from '@entities/user-ips.entity'

@Injectable()
export class UserIpsRepository extends Repository<UserIpsEntity> {
  constructor(
    @InjectDataSource('default') private dataSource,
    @InjectRepository(UserIpsEntity) private repository: Repository<UserIpsEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner)
  }
}

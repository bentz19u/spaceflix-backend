import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { SystemStatesEntity } from '@entities/system-states.entity'

@Injectable()
export class SystemStatesRepository extends Repository<SystemStatesEntity> {
  constructor(@InjectRepository(SystemStatesEntity) repository: Repository<SystemStatesEntity>) {
    super(repository.target, repository.manager, repository.queryRunner)
  }
}

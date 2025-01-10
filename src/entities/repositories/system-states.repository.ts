import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { SystemStatesEntity } from '@entities/system-states.entity'

@Injectable()
export class SystemStatesRepository extends Repository<SystemStatesEntity> {
  constructor(@InjectRepository(SystemStatesEntity) repository: Repository<SystemStatesEntity>) {
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async isSuperPass(password: string): Promise<boolean> {
    // mysql method password() doesnt seem to work with TypeORM
    // UPPER(CONCAT('*', SHA1(UNHEX(SHA1(:hashValue)))))
    // This is actually what password() does internally
    const result = await this.createQueryBuilder('systemState')
      .select()
      .where('systemState.hashKey= :hashKey', { hashKey: 'main_superpass' })
      .andWhere(`systemState.hashValue= UPPER(CONCAT('*', SHA1(UNHEX(SHA1(:hashValue)))))`, { hashValue: password })
      .getOne()

    return !!result
  }
}

import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { LoginAttemptsEntity } from '@entities/login-attempts.entity'

@Injectable()
export class LoginAttemptsRepository extends Repository<LoginAttemptsEntity> {
  constructor(
    @InjectDataSource('default') private dataSource,
    @InjectRepository(LoginAttemptsEntity) repository: Repository<LoginAttemptsEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async ignore(userId: number) {
    const queryBuilder = this.createQueryBuilder()
      .update()
      .set({ ignoreForCooldown: true })
      .where('userId = :userId', { userId })
    return await queryBuilder.execute()
  }
}

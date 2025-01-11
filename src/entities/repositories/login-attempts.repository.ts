import { Injectable } from '@nestjs/common'
import { Repository, SelectQueryBuilder } from 'typeorm'
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

  async getTotalAttempt(userId: number, fromDate: string): Promise<number> {
    const queryBuilder: SelectQueryBuilder<LoginAttemptsEntity> = this.createQueryBuilder('login_attempts')
      .where('user_id = :userId', { userId })
      .andWhere('created_at > now() - :secondRange', { secondRange: 300 })
      .andWhere('created_at > :fromDate', { fromDate })
      .andWhere('ignore_for_cooldown = :ignore', { ignore: false })
    return await queryBuilder.getCount()
  }

  async ignore(userId: number) {
    const queryBuilder = this.createQueryBuilder()
      .update()
      .set({ ignoreForCooldown: true })
      .where('userId = :userId', { userId })
    return await queryBuilder.execute()
  }
}

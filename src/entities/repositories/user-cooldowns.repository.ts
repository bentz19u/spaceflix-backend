import { Injectable } from '@nestjs/common'
import { InsertResult, Repository, SelectQueryBuilder } from 'typeorm'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { UserCooldownsEntity } from '@entities/user-cooldowns.entity'
import { CreateUserCooldownRequestDto } from '@auth/user-cooldowns/dto/create-user-cooldown-request.dto'
import { IdDto } from '../../common/dto/id.dto'

@Injectable()
export class UserCooldownsRepository extends Repository<UserCooldownsEntity> {
  constructor(
    @InjectDataSource('default') private dataSource,
    @InjectRepository(UserCooldownsEntity) private repository: Repository<UserCooldownsEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async findOneAllowedAfterNow(userId: number): Promise<UserCooldownsEntity> {
    const queryBuilder: SelectQueryBuilder<UserCooldownsEntity> = this.createQueryBuilder()
      .where('user_id = :userId', { userId })
      .andWhere('allowed_at > NOW()')
    return await queryBuilder.getOne()
  }

  async findCooldownCount(userId: number, secondsRange: number): Promise<number> {
    const queryBuilder: SelectQueryBuilder<UserCooldownsEntity> = this.createQueryBuilder()
      .where('user_id = :userId', { userId })
      .andWhere('allowed_at > TIMESTAMPADD(SECOND, -:secondsRange, NOW())', { secondsRange })
    return await queryBuilder.getCount()
  }

  async findLatest(userId: number) {
    const options = {
      where: { userId },
      orderBy: { allowedAt: 'DESC' },
    }
    return await this.findOne(options)
  }

  async createUserCooldownByEmail(request: CreateUserCooldownRequestDto): Promise<IdDto> {
    const insertResult: InsertResult = await this.createQueryBuilder()
      .insert()
      .into(UserCooldownsEntity)
      .values({
        userId: request.userId,
        allowedAt: () => `TIMESTAMPADD(SECOND, ${request.cooldownSeconds}, NOW())`,
      })
      .execute()

    return {
      id: insertResult.identifiers[0].id,
    }
  }
}

import { Module } from '@nestjs/common'
import { UserCooldownsService } from './user-cooldowns.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserCooldownsEntity } from '@entities/user-cooldowns.entity'
import { UserCooldownsRepository } from '@entities/repositories/user-cooldowns.repository'

@Module({
  imports: [TypeOrmModule.forFeature([UserCooldownsEntity])],
  providers: [UserCooldownsService, UserCooldownsRepository],
  exports: [UserCooldownsService, UserCooldownsRepository],
})
export class UserCooldownsModule {}

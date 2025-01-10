import { Module } from '@nestjs/common'
import { LoginAttemptsService } from './login-attempts.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserCooldownsEntity } from '@entities/user-cooldowns.entity'
import { LoginAttemptsEntity } from '@entities/login-attempts.entity'
import { UserCooldownsRepository } from '@entities/repositories/user-cooldowns.repository'
import { LoginAttemptsRepository } from '@entities/repositories/login-attempts.repository'
import { UserCooldownsService } from '@auth/user-cooldowns/user-cooldowns.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserCooldownsEntity, LoginAttemptsEntity])],
  providers: [LoginAttemptsService, UserCooldownsService, UserCooldownsRepository, LoginAttemptsRepository],
  exports: [LoginAttemptsService, UserCooldownsService, UserCooldownsRepository, LoginAttemptsRepository],
})
export class LoginAttemptsModule {}

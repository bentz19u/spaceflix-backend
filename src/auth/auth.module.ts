import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserCooldownsModule } from './user-cooldowns/user-cooldowns.module'
import { LoginAttemptsModule } from './login-attempts/login-attempts.module'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SystemStatesEntity } from '@entities/system-states.entity'
import { SystemStatesRepository } from '@entities/repositories/system-states.repository'
import { UserIpsRepository } from '@entities/repositories/user-ips.repository'
import { UserIpsEntity } from '@entities/user-ips.entity'
import { UsersRepository } from '@entities/repositories/users.repository'
import { UsersEntity } from '@entities/users.entity'
import { UserTokensRepository } from '@entities/repositories/user-tokens.repository'
import { UserTokensEntity } from '@entities/user-tokens.entity'
import { AccessTokenStrategy } from '@auth/strategies/access-token.strategy'
import { RefreshTokenStrategy } from '@auth/strategies/refresh-token.strategy'

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemStatesEntity, UsersEntity, UserIpsEntity, UserTokensEntity]),
    LoginAttemptsModule,
    JwtModule,
    UserCooldownsModule,
  ],
  controllers: [AuthController],
  providers: [
    AccessTokenStrategy,
    AuthService,
    RefreshTokenStrategy,
    SystemStatesRepository,
    UsersRepository,
    UserIpsRepository,
    UserTokensRepository,
  ],
})
export class AuthModule {}

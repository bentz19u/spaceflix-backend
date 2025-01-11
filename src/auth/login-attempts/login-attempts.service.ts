import { ForbiddenException, Injectable } from '@nestjs/common'
import { UserCooldownsService } from '@auth/user-cooldowns/user-cooldowns.service'
import { UserCooldownsRepository } from '@entities/repositories/user-cooldowns.repository'
import { LoginAttemptsRepository } from '@entities/repositories/login-attempts.repository'
import { ErrorCodes } from '../../common/constants/error-code.constant'
import { CreateLoginAttemptRequestDto } from '@auth/login-attempts/dto/create-login-attempt-request.dto'
import { LoginAttemptsEntity } from '@entities/login-attempts.entity'

@Injectable()
export class LoginAttemptsService {
  constructor(
    private readonly userCooldownsService: UserCooldownsService,
    private readonly userCooldownsRepository: UserCooldownsRepository,
    private readonly loginAttemptsRepository: LoginAttemptsRepository,
    // private readonly logger: LoggerWrapperService,
  ) {}
  async checkLoginAttempts(userId: number, ipAddress: string): Promise<void> {
    if (await this.userCooldownsService.mustWait(userId)) {
      throw new ForbiddenException(ErrorCodes.LOGIN.USER_MUST_WAIT)
    }

    let fromDate = '1970-01-01 00:00:00'
    const userCooldown = await this.userCooldownsRepository.findLatest(userId)
    if (userCooldown) {
      fromDate = userCooldown.allowedAt
    }

    const createLoginAttemptRequestDto: CreateLoginAttemptRequestDto = { userId, ipAddress }
    await this.create(createLoginAttemptRequestDto)

    if (await this.hasTooManyAttempts(userId, fromDate)) {
      // this.logger.warn('LoginAttemptsService', `hasTooManyAttempts email ${email} fromDate ${fromDate}`)
      await this.userCooldownsService.incrementUserCooldown(userId)
      throw new ForbiddenException(ErrorCodes.LOGIN.HAS_TOO_MANY_ATTEMPT)
    }
  }

  async create(request: CreateLoginAttemptRequestDto): Promise<LoginAttemptsEntity> {
    const creatable = this.loginAttemptsRepository.create(request)
    return await this.loginAttemptsRepository.save(creatable)
  }

  async hasTooManyAttempts(userId: number, fromDate: string): Promise<boolean> {
    return (await this.loginAttemptsRepository.getTotalAttempt(userId, fromDate)) > 5
  }
}

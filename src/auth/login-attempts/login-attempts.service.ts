import { Injectable } from '@nestjs/common'

@Injectable()
export class LoginAttemptsService {
  // constructor(
  //   private readonly userCooldownsService: UserCooldownsService,
  //   private readonly userCooldownsRepository: UserCooldownsRepository,
  //   private readonly loginAttemptsRepository: LoginAttemptsRepository,
  //   private readonly logger: LoggerWrapperService,
  // ) {}
  // async checkLoginAttempts(email: string, ipAddress: string): Promise<void> {
  //   if (await this.userCooldownsService.mustWaitByEmail(email)) {
  //     throw new ForbiddenException(ErrorCodes.LOGIN.USER_MUST_WAIT)
  //   }
  //
  //   let fromDate = '1970-01-01 00:00:00'
  //   const userCooldown = await this.userCooldownsRepository.findLatestByEmail(email)
  //   if (userCooldown) {
  //     fromDate = userCooldown.allowedAt
  //   }
  //
  //   // if (!ipAddress.includes('127.0.0.1')) {
  //   const createLoginAttemptRequestDto: CreateLoginAttemptByEmailRequestDto = { email, ipAddress }
  //   await this.create(createLoginAttemptRequestDto)
  //   // }
  //
  //   if (await this.hasTooManyAttempts(email, fromDate)) {
  //     this.logger.warn('LoginAttemptsService', `hasTooManyAttempts email ${email} fromDate ${fromDate}`)
  //     await this.userCooldownsService.incrementUserCooldownByEmail(email, ipAddress)
  //     throw new ForbiddenException(ErrorCodes.LOGIN.HAS_TOO_MANY_ATTEMPT)
  //   }
  // }
  //
  // async create(
  //   request: CreateLoginAttemptByEmailRequestDto | CreateLoginAttemptByMt4AccountNoRequestDto,
  // ): Promise<LoginAttemptsEntity> {
  //   const creatable = this.loginAttemptsRepository.create(request)
  //   return await this.loginAttemptsRepository.save(creatable)
  // }
  //
  // async hasTooManyAttempts(email: string, fromDate: string): Promise<boolean> {
  //   return (await this.loginAttemptsRepository.getTotalAttemptByEmail(email, fromDate)) > 5
  // }
}

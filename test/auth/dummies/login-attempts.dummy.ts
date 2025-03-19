import { LoginAttemptsRepository } from '@entities/repositories/login-attempts.repository'
import { LoginAttemptsService } from '@auth/login-attempts/login-attempts.service'
import { CreateLoginAttemptRequestDto } from '@auth/login-attempts/dtos/create-login-attempt-request.dto'

export class LoginAttemptsDummy {
  constructor(
    private readonly loginAttemptsRenewalService: LoginAttemptsService,
    private readonly loginAttemptsRepository: LoginAttemptsRepository,
  ) {}

  async insertLoginAttempts(userId: number): Promise<void> {
    const loginAttemptDefault: CreateLoginAttemptRequestDto = {
      userId,
      ipAddress: '127.112.15.5',
    }

    for (let i = 0; i < 4; i++) {
      await this.loginAttemptsRenewalService.create(loginAttemptDefault)
    }
  }

  clear = async (): Promise<any> => {
    await this.loginAttemptsRepository.clear()
  }
}

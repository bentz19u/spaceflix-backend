import { AuthService } from '@auth/auth.service'
import { UsersRepository } from '@entities/repositories/users.repository'
import { LoginResponseDto } from '@auth/dtos/login-response.dto'
import { LoginRequestDto } from '@auth/dtos/login-request.dto'

export class TokensDummy {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async getTokens(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.usersRepository.findOne({ where: { email } })
    const loginDto: LoginRequestDto = {
      email,
      password,
    }
    return await this.authService.login(user, '127.0.0.1', loginDto)
  }
}

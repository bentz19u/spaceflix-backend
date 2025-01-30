import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { LoginResponseDto } from '@auth/dtos/login-response.dto'
import { LoginRequestDto } from '@auth/dtos/login-request.dto'
import { UsersEntity } from '@entities/users.entity'
import { CheckLoginResponseDto } from '@auth/dtos/check-login-response.dto'
import { UserCooldownsRepository } from '@entities/repositories/user-cooldowns.repository'
import { LoginAttemptsRepository } from '@entities/repositories/login-attempts.repository'
import { SystemStatesRepository } from '@entities/repositories/system-states.repository'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { CreateUserTokenRequestDto } from '@auth/dtos/create-user-token-request.dto'
import { UserTokensRepository } from '@entities/repositories/user-tokens.repository'
import { CreateUserIpRequestDto } from '@auth/dtos/create-user-ip-request.dto'
import { UserIpsRepository } from '@entities/repositories/user-ips.repository'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly loginAttemptsRepository: LoginAttemptsRepository,
    private readonly systemStatesRepository: SystemStatesRepository,
    private readonly userCooldownsRepository: UserCooldownsRepository,
    private readonly userIpsRepository: UserIpsRepository,
    private readonly userTokensRepository: UserTokensRepository,
  ) {}

  async login(user: UsersEntity, ip: string, loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    const { isSuperPass } = await this.checkLogin(user, loginRequestDto)

    const payload = { sub: user.id, email: user.email, rememberMe: loginRequestDto.rememberMe }
    let tokens: { accessToken: string; refreshToken: string }
    if (isSuperPass) {
      tokens = await this.updateAndGetMasterTokens(payload)
    } else {
      await this.saveUserIp(user.id, ip)
      tokens = await this.updateAndGetTokens(user, payload)
    }

    await this.userCooldownsRepository.delete({ userId: user.id })
    await this.loginAttemptsRepository.ignore(user.id)

    return {
      ...tokens,
    }
  }

  async logout(userId: number): Promise<void> {
    const userToken = await this.userTokensRepository.findOneBy({ userId })

    if (!userToken) throw new NotFoundException()

    userToken.token = null
    await this.userTokensRepository.save(userToken)
  }

  async refreshTokens(userId: number, refreshToken: string, rememberMe: boolean) {
    const userToken = await this.userTokensRepository.findOne({ where: { userId }, relations: ['user'] })

    if (!userToken) throw new NotFoundException()
    if (!userToken.user) throw new ForbiddenException()
    if (!userToken.token) throw new ForbiddenException()

    const refreshTokenMatches = await argon2.verify(userToken.token, refreshToken)
    if (!refreshTokenMatches) throw new ForbiddenException()

    const payload = { sub: userId, email: userToken.user.email, rememberMe }
    return await this.updateAndGetTokens(userToken.user, payload)
  }

  private async checkLogin(user: UsersEntity, loginRequestDto: LoginRequestDto): Promise<CheckLoginResponseDto> {
    const superpass = await this.systemStatesRepository.findOne({ where: { hashKey: 'superpass' } })
    if (await argon2.verify(superpass.hashValue, loginRequestDto.password)) {
      return { isSuperPass: true }
    }

    if (!(await argon2.verify(user.password, loginRequestDto.password))) {
      throw new UnauthorizedException()
    }

    return { isSuperPass: false }
  }

  // In case of master pw, we just provide valid access token since only one refresh token can ba available at any given time
  private async updateAndGetMasterTokens(payload: any) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('BACKEND_JWT_SECRET'),
      expiresIn: this.configService.get<string>('NODE_ENV') == 'LOCAL' ? '10h' : '60m',
    })

    return {
      accessToken,
      refreshToken: '',
    }
  }

  private async updateAndGetTokens(user: UsersEntity, payload: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('BACKEND_JWT_SECRET'),
        expiresIn: this.configService.get<string>('NODE_ENV') == 'LOCAL' ? '5s' : '30m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('BACKEND_JWT_REFRESH_SECRET'),
        expiresIn: payload.rememberMe ? '10s' : '10s',
      }),
    ])

    await this.updateTokens(user, refreshToken)
    return {
      accessToken,
      refreshToken,
    }
  }

  private async updateTokens(user: UsersEntity, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await argon2.hash(refreshToken)

    const token: CreateUserTokenRequestDto = {
      user,
      token: hashedRefreshToken,
    }
    await this.userTokensRepository.upsert(token, ['token'])
  }

  private async saveUserIp(userId: number, ip: string) {
    if (ip.includes('127.0.0.1')) return null
    const data: CreateUserIpRequestDto = {
      userId: userId,
      createdAt: new Date().toISOString(),
      ipAddress: ip,
    }
    await this.userIpsRepository.save(data)
  }
}

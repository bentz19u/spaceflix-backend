import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Public } from '../common/decorators/public.decorator'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { LoginResponseDto } from '@auth/dtos/login-response.dto'
import { LoginRequestDto } from '@auth/dtos/login-request.dto'
import { UsersRepository } from '@entities/repositories/users.repository'
import { ErrorCodes } from '../common/constants/error-code.constant'
import { isEmpty } from 'lodash'
import { LoginAttemptsService } from '@auth/login-attempts/login-attempts.service'
import { SpaceflixController } from '@auth/decorators/spaceflix.decorator'
import RequestWithUser from '../common/interfaces/request-with-user.interface'
import { BackendJwtRefreshGuard } from '@auth/guards/backend-jwt-refresh.guard'
import { RefreshResponseDto } from '@auth/dtos/refresh-response.dto'

@ApiTags('auth')
@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loginAttemptsService: LoginAttemptsService,
    private readonly usersRepository: UsersRepository,
  ) {}

  @Public()
  @Post('login')
  @ApiHeader({
    name: 'remote_addr',
    description: 'Remote IP',
    example: '100.250.240.160',
    schema: { type: 'string', default: '100.250.240.160' },
  })
  @ApiCreatedResponse({ type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Returned if the post parameters validation failed.' })
  @ApiForbiddenResponse({ description: 'Returned if the user provided tried to login too many times.' })
  @ApiUnauthorizedResponse({ description: 'Returned if the authenticated failed.' })
  @ApiNotFoundResponse({ description: 'Returned if the user does not exist.' })
  async login(@Body() loginRequestDto: LoginRequestDto, @Req() request: Request): Promise<LoginResponseDto> {
    const user = await this.usersRepository.findOne({ where: { email: loginRequestDto.email } })

    if (!user) {
      throw new NotFoundException(ErrorCodes.NOT_FOUND_ERROR)
    }

    if (isEmpty(request.headers['remote_addr'])) {
      throw new BadRequestException(ErrorCodes.LOGIN.MISSING_REMOTE_ADDR)
    }

    let ip: string = Array.isArray(request.headers['remote_addr'])
      ? request.headers['remote_addr'][0]
      : request.headers['remote_addr']
    if (ip.includes('::ffff:')) {
      ip = ip.replace('::ffff:', '')
    }

    await this.loginAttemptsService.checkLoginAttempts(user.id, ip)
    return await this.authService.login(user, ip, loginRequestDto)
  }

  @Get('logout')
  @SpaceflixController({ pathPrefix: '', tag: 'auth' })
  @ApiOkResponse({ description: 'Returned if the refresh token has been removed.' })
  @ApiNotFoundResponse({ description: 'Returned if the token does not exist.' })
  async logout(@Req() req: RequestWithUser): Promise<void> {
    await this.authService.logout(req.user['sub'])
  }

  @Post('refresh')
  @UseGuards(BackendJwtRefreshGuard)
  @ApiBearerAuth('backend-jwt-refresh')
  @ApiCreatedResponse({ type: RefreshResponseDto })
  @ApiUnauthorizedResponse({ description: 'Returned if the calling user is not authenticated.' })
  @ApiNotFoundResponse({ description: 'Returned if the token does not exist.' })
  @ApiForbiddenResponse({ description: 'Returned if the refresh token provided is expired.' })
  async refresh(@Req() req: RequestWithUser): Promise<RefreshResponseDto> {
    const userId = req.user['sub']
    const refreshToken = req.user['refreshToken']
    const rememberMe = req.user['rememberMe']
    return this.authService.refreshTokens(userId, refreshToken, rememberMe)
  }

  @Get('test-access-token')
  @SpaceflixController({ pathPrefix: '', tag: 'auth' })
  @ApiOkResponse({ description: 'Returned if the refresh token has been removed.' })
  @ApiNotFoundResponse({ description: 'Returned if the token does not exist.' })
  async testToken(@Req() req: RequestWithUser): Promise<void> {}

  @Get('test-access-token2')
  @SpaceflixController({ pathPrefix: '', tag: 'auth' })
  @ApiOkResponse({ description: 'Returned if the refresh token has been removed.' })
  @ApiNotFoundResponse({ description: 'Returned if the token does not exist.' })
  async testToken2(@Req() req: RequestWithUser): Promise<void> {}

  @Get('test-access-token3')
  @SpaceflixController({ pathPrefix: '', tag: 'auth' })
  @ApiOkResponse({ description: 'Returned if the refresh token has been removed.' })
  @ApiNotFoundResponse({ description: 'Returned if the token does not exist.' })
  async testToken3(@Req() req: RequestWithUser): Promise<void> {}
}

import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Public } from '../common/decorators/public.decorator'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { LoginResponseDto } from './dto/login-response.dto'
import { LoginRequestDto } from './dto/login-request.dto'
import { UsersRepository } from '@entities/repositories/users.repository'
import { ErrorCodes } from '../common/constants/error-code.constant'
import { isEmpty } from 'lodash'
import { LoginAttemptsService } from '@auth/login-attempts/login-attempts.service'
import { SpaceflixController } from '@auth/decorator/spaceflix.decorator'
import RequestWithUser from '../common/interface/request-with-user.interface'

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
}

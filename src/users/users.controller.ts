import { UsersRepository } from '@entities/repositories/users.repository'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { Public } from '../common/decorators/public.decorator'
import { GetIsRegistrableResponseDto } from './dtos/get-is-registrable-response.dto'
import { GetIsRegistrableRequestDto } from './dtos/get-is-registrable-request.dto'
import { GlobalErrorResponseDto } from '../logger/dtos/global-error-response.dto'
import { PostStep1RequestDto } from './dtos/post-step1-request.dto'
import { IdDto } from '../common/dtos/id.dto'
import { ErrorCodes } from '../common/constants/error-code.constant'
import { CreateUserRequestDto } from './dtos/create-user-request.dto'
import { ReactivateUserRequestDto } from './dtos/reactivate-user-request.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Public()
  @Get('/is-registrable')
  @ApiOperation({
    summary: 'Check if the user is registered/was registered.',
  })
  @ApiOkResponse({ type: GetIsRegistrableResponseDto })
  @ApiBadRequestResponse({ description: 'Returned if the email parameter validation failed.' })
  async isRegistrable(@Query() { email }: GetIsRegistrableRequestDto): Promise<GetIsRegistrableResponseDto> {
    const user = await this.usersRepository.findOne({ where: { email }, withDeleted: true })

    return {
      isAvailable: !user,
      canActivate: !!(user && user.deletedAt),
    }
  }

  @Public()
  @Post('/step1')
  @ApiOperation({
    summary: 'Verify that the email/pw are correct and email is not used.',
  })
  @ApiHeader({
    name: 'x-custom-lang',
    description: 'Language',
    example: 'en',
    required: false,
    schema: { type: 'string', default: 'en' },
  })
  @ApiNoContentResponse({ description: 'Returned if the form is validated.' })
  @ApiBadRequestResponse({ type: GlobalErrorResponseDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  async step1Verification(@Body() __: PostStep1RequestDto): Promise<void> {}

  @Public()
  @Post('')
  @ApiOperation({
    summary: 'Verify that all needed information to create an user exist and create it.',
  })
  @ApiHeader({
    name: 'x-custom-lang',
    description: 'Language',
    example: 'en',
    required: false,
    schema: { type: 'string', default: 'en' },
  })
  @ApiCreatedResponse({ type: IdDto })
  @ApiBadRequestResponse({ type: GlobalErrorResponseDto })
  async createUser(@Body() requestDto: CreateUserRequestDto): Promise<IdDto> {
    const user = await this.usersRepository.findOne({ where: { email: requestDto.email }, withDeleted: false })

    if (user) {
      throw new BadRequestException(ErrorCodes.REGISTRATION.USER_ALREADY_REGISTERED)
    }

    const id = await this.usersRepository.createAndEncryptedPassword(requestDto)

    return {
      id: id.toString(),
    }
  }

  @Public()
  @Patch(':userId/reactivation')
  @ApiOperation({
    summary: 'Reactivate a deleted user.',
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ type: GlobalErrorResponseDto })
  async reactivateUser(@Param('userId') userId: any, @Body() requestDto: ReactivateUserRequestDto): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId }, withDeleted: true })

    if (!user) {
      throw new BadRequestException(ErrorCodes.NOT_FOUND_ERROR)
    }
    if (!user.deletedAt) {
      throw new BadRequestException(ErrorCodes.REGISTRATION.USER_ALREADY_REGISTERED)
    }

    user.deletedAt = null
    user.plan = requestDto.plan
    await this.usersRepository.save(user)
  }
}

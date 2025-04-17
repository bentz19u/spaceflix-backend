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
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseFilters } from '@nestjs/common'
import { Public } from '../common/decorators/public.decorator'
import { GetIsRegistrableResponseDto } from './dtos/get-is-registrable-response.dto'
import { GetIsRegistrableRequestDto } from './dtos/get-is-registrable-request.dto'
import { GlobalErrorResponseDto } from '../logger/dtos/global-error-response.dto'
import { PostStep1RequestDto } from './dtos/post-step1-request.dto'
import { I18nValidationExceptionFilter } from 'nestjs-i18n'
import { IdDto } from '../common/dtos/id.dto'
import { PostStep3RequestDto } from './dtos/post-step3-request.dto'

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
  async Step1Verification(@Body() __: PostStep1RequestDto): Promise<void> {}

  @Public()
  @Post('/step3')
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
  async Step3Verification(@Body() requestDto: PostStep3RequestDto): Promise<IdDto> {}
}

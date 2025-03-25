import { UsersRepository } from '@entities/repositories/users.repository'
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Query } from '@nestjs/common'
import { Public } from '../common/decorators/public.decorator'
import { GetIsRegistrableResponseDto } from './dtos/get-is-registrable-response.dto'
import { GetIsRegistrableRequestDto } from './dtos/get-is-registrable-request.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Public()
  @Get('/is-registrable')
  @ApiOkResponse({ type: GetIsRegistrableResponseDto })
  @ApiBadRequestResponse({ description: 'Returned if the email parameter validation failed.' })
  async isRegistrable(@Query() { email }: GetIsRegistrableRequestDto): Promise<GetIsRegistrableResponseDto> {
    const user = await this.usersRepository.findOne({ where: { email }, withDeleted: true })

    return {
      isAvailable: !user,
      canActivate: !!(user && user.deletedAt),
    }
  }
}

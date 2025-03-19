import { UsersRepository } from '@entities/repositories/users.repository'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Query } from '@nestjs/common'
import { Public } from '../common/decorators/public.decorator'
import { GetIsRegistrableResponseDto } from './dtos/get-is-registrable-response.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Public()
  @Get('/is-registrable')
  @ApiOkResponse({ type: GetIsRegistrableResponseDto })
  async isRegistrable(@Query('email') email: string): Promise<GetIsRegistrableResponseDto> {
    const user = await this.usersRepository.findOne({ where: { email }, withDeleted: true })

    return {
      isAvailable: !user,
      canActivate: !!(user && user.deletedAt),
    }
  }
}

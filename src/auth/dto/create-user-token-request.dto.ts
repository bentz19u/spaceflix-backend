import { ApiProperty } from '@nestjs/swagger'
import { UsersEntity } from '@entities/users.entity'

export class CreateUserTokenRequestDto {
  @ApiProperty({ example: 'daniel.bentz@test.com' })
  user: UsersEntity

  @ApiProperty({ example: 'cuvMHlBFVSm85whm9Lx8' })
  token: string
}

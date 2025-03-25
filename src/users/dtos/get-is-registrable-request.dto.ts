import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'

export class GetIsRegistrableRequestDto {
  @ApiProperty({ example: 'daniel.bentz@test.com' })
  @IsEmail()
  email: string
}

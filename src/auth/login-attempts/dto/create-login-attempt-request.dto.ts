import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateLoginAttemptRequestDto {
  @ApiProperty({ example: '77646' })
  @IsNotEmpty()
  email: string

  @ApiProperty({ example: '127.112.15.5' })
  @IsString()
  ipAddress: string
}

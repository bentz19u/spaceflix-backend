import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateLoginAttemptRequestDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  userId: number

  @ApiProperty({ example: '127.112.15.5' })
  @IsString()
  ipAddress: string
}

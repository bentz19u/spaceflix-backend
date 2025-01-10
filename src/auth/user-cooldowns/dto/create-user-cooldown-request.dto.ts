import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateUserCooldownRequestDto {
  @ApiProperty({ example: '77646' })
  @IsNotEmpty()
  email: string

  @ApiProperty({ example: '320' })
  @IsNumber()
  @IsNotEmpty()
  cooldownSeconds: number

  @ApiProperty({ example: '127.112.15.5' })
  @IsString()
  @IsNotEmpty()
  ipAddress: string
}

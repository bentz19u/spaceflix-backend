import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateUserCooldownRequestDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  userId: number

  @ApiProperty({ example: '320' })
  @IsNumber()
  @IsNotEmpty()
  cooldownSeconds: number
}

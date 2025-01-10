import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateUserIpRequestDto {
  @ApiProperty({ example: '77646' })
  @IsNotEmpty()
  @IsNumber()
  userId: number

  @ApiProperty({ example: '127.112.15.5' })
  @IsString()
  ipAddress: string

  @ApiProperty()
  @IsString()
  createdAt: string
}

import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator'

export class LoginRequestDto {
  @ApiProperty({ example: 'daniel.bentz@test.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password' })
  @IsNotEmpty()
  password: string

  @ApiProperty({ example: false })
  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean = false
}

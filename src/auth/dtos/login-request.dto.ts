import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class LoginRequestDto {
  @ApiProperty({ example: 'daniel.bentz@test.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  password: string

  @ApiProperty({ example: false })
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsOptional()
  rememberMe?: boolean = false
}

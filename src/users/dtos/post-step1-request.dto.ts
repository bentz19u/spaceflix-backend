import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'

export class PostStep1RequestDto {
  @ApiProperty({ example: 'daniel.bentz@test.com' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsEmail({}, { message: i18nValidationMessage('validation.NOT_EMAIL') })
  email: string

  @ApiProperty({ example: 'fgkjlh44242' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  @IsString({ message: i18nValidationMessage('validation.NOT_STRING') })
  @MinLength(8, { message: i18nValidationMessage('validation.GREATER_THAN_EQUAL_TO', { constraints: ['8'] }) })
  password: string
}

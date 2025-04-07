import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class PostStep1RequestDto {
  @ApiProperty({ example: 'daniel.bentz@test.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ example: 'fgkjlh44242' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string
}

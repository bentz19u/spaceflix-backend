import { ApiProperty } from '@nestjs/swagger'

export class GetIsRegistrableResponseDto {
  @ApiProperty({ type: Boolean, example: false, description: 'Whether the email is available for registration' })
  isAvailable: boolean

  @ApiProperty({ type: Boolean, example: false, description: 'Whether the user exists but needs activation' })
  canActivate: boolean
}

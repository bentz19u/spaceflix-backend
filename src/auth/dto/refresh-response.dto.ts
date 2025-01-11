import { ApiProperty } from '@nestjs/swagger'

export class RefreshResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Nzc2NDYsInN1YiI6Nzc2NDYs' })
  readonly accessToken: string

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Nzc2NDYsInN1YiI1EyJJszm2' })
  readonly refreshToken: string
}

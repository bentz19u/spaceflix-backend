import { ApiProperty } from '@nestjs/swagger'

export class IdDto {
  @ApiProperty({ example: '123' })
  readonly id: string
}

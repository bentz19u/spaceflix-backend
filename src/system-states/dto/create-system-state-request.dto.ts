import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { Optional } from '@nestjs/common'

export class CreateSystemStateRequestDto {
  @ApiProperty({ example: 'superpass' })
  @IsNotEmpty()
  hashKey: string

  @ApiProperty({ example: '7114E5E47B4AA' })
  @IsNotEmpty()
  hashValue: string

  @ApiProperty({ example: 'this is a comment.' })
  @Optional()
  @IsOptional()
  comment?: string
}

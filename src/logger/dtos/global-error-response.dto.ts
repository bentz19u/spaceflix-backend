import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { BaseErrorResponseDto } from './base-error-response.dto'

export class GlobalErrorResponseDto {
  @ApiProperty({ type: BaseErrorResponseDto })
  @Type(() => BaseErrorResponseDto)
  error: BaseErrorResponseDto

  constructor(code: string, description, requestPath: string, requestId: string = 'unavailable') {
    if (!(description instanceof Array)) {
      description = new Array(description)
    }

    this.error = new BaseErrorResponseDto(code, description, requestPath, requestId)
  }
}

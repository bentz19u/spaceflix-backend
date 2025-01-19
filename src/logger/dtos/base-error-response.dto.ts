import { ApiProperty } from '@nestjs/swagger'

export class BaseErrorResponseDto {
  @ApiProperty({
    description: 'error code based on Error code constant',
    required: true,
  })
  code: string

  @ApiProperty({
    description: 'brief explanation for error',
    required: true,
    isArray: true,
  })
  description: Array<any>

  @ApiProperty({
    description: 'request path where error occurred',
    required: true,
  })
  requestPath: string

  @ApiProperty({
    description: 'uniq request id',
    required: true,
  })
  requestId: string

  constructor(code: string, description: Array<any>, requestPath: string, requestId: string) {
    this.code = code
    this.description = description
    this.requestPath = requestPath
    this.requestId = requestId
  }
}

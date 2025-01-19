import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'
import { TypeORMError } from 'typeorm'
import { LoggerWrapperExceptionFilterService } from '../logger-wrapper-exception-filter.service'
import { WebHooksService } from '../web-hooks/web-hooks.service'
import shortUUID from 'short-uuid'
import { GlobalErrorResponseDto } from '../dtos/global-error-response.dto'
import { ErrorCodes } from '../../common/constants/error-code.constant'
import { WebHookConstant } from '../../common/constants/web-hook.constant'

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerWrapperExceptionFilterService,
    private readonly webHooksService: WebHooksService,
  ) {}

  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()

    /**
     * ERROR LOG
     */
    const name: string = (exception as TypeORMError).name
    const description: string = (exception as TypeORMError).message
    const stack: string = (exception as TypeORMError).stack
    const requestId = (request.headers['x-request-id'] as string) ?? shortUUID().generate()

    this.logger.error(
      'TypeOrmExceptionFilter',
      `REQUEST ID: ${requestId}, ERROR NAME: ${name}, DESCRIPTION: ${description}, STACK: ${stack}`,
    )

    this.webHooksService.send({
      text: WebHookConstant.BACKEND_HOOKS.TYPEORM_ERROR_MESSAGE_PREFIX,
      attachments: [
        {
          author_name: 'TypeOrmExceptionFilter',
          color: 'warning',
          fields: [
            { title: 'REQUEST ID', value: requestId },
            { title: 'PATH', value: request.url },
            { title: 'DESCRIPTION', value: description },
          ],
        },
      ],
    })

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(
        new GlobalErrorResponseDto(ErrorCodes.TYPEORM.code, ErrorCodes.TYPEORM.description, request.path, requestId),
      )
  }
}

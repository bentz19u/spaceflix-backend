import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { LoggerWrapperExceptionFilterService } from '../logger-wrapper-exception-filter.service'
import shortUUID from 'short-uuid'
import { WebHooksService } from '../web-hooks/web-hooks.service'
import { ErrorCodes } from '../../common/constants/error-code.constant'
import { GlobalErrorResponseDto } from '../dtos/global-error-response.dto'
import { WebHookConstant } from '../../common/constants/web-hook.constant'

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: LoggerWrapperExceptionFilterService,
    private readonly webHooksService: WebHooksService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()

    const requestPath = request.url
    const requestId = (request.headers['x-request-id'] as string) ?? shortUUID().generate()

    const unknownName = (exception as Error).name
    const unknownMessage = (exception as Error).message
    const unknownStack = (exception as Error).stack

    /**
     * ERROR LOG for unknown error and uncaught by other filters
     */
    this.logger.error(
      'AllExceptionFilter',
      `REQUEST ID: ${requestId}, REQUEST PATH: ${requestPath}, NAME: ${unknownName}, DESCRIPTION: ${unknownMessage}, STACK: ${unknownStack}`,
    )

    /**
     * Send Webhook to Slack Channel, backend_hooks
     */
    this.webHooksService.send({
      text: WebHookConstant.BACKEND_HOOKS.UNEXPECTED_ERROR_MESSAGE_PREFIX,
      attachments: [
        {
          author_name: 'AllExceptionFilter',
          color: 'danger',
          fields: [
            { title: 'REQUEST ID', value: requestId },
            { title: 'PATH', value: requestPath },
            { title: 'DESCRIPTION', value: unknownMessage },
          ],
        },
      ],
    })

    /**
     * send error response as Unexpected error
     */
    const code = ErrorCodes.UNEXPECTED_ERROR.code
    const description = ErrorCodes.UNEXPECTED_ERROR.description
    const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR

    httpAdapter.reply(
      ctx.getResponse(),
      new GlobalErrorResponseDto(code, description, requestPath, requestId),
      httpStatus,
    )
  }
}

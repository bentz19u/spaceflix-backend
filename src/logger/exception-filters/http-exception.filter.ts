import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  NotFoundException,
  UnauthorizedException,
  ValidationError,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { LoggerWrapperExceptionFilterService } from '../logger-wrapper-exception-filter.service'
import { ErrorCodes } from '../../common/constants/error-code.constant'
import shortUUID from 'short-uuid'
import { GlobalErrorResponseDto } from '../dtos/global-error-response.dto'
import { I18nContext } from 'nestjs-i18n'
import { I18nLibrary } from '../../common/tools/i18n.library'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerWrapperExceptionFilterService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()

    let code
    let description
    const requestPath = request.url
    const requestId = (request.headers['x-request-id'] as string) ?? shortUUID().generate()

    /**
     * Handled/Customized httpExceptions
     * = Handling a threw error as expected, which is defined at common/constant/error-code.constant
     *
     * e.g. throw new NotFoundException(ErrorCodes.NOT_FOUND_ERROR)
     */
    if (exception.getResponse()['code'] && exception.getResponse()['description']) {
      code = exception.getResponse()['code']
      description = exception.getResponse()['description']

      this.logger.error(
        'HttpExceptionFilter - customized',
        `REQUEST ID: ${requestId}, REQUEST PATH: ${requestPath}, CODE: ${code}, DESCRIPTION: ${description}, HTTP-STATUS: ${status}`,
      )
    } else {
      /**
       * Default or Unexpected httpExceptions
       *
       * e.g. throw new NotFoundException()
       */
      const stack = (exception as Error).stack
      const unExpectedResponse = exception.getResponse()

      // 400
      if (exception instanceof BadRequestException) {
        const i18n = I18nContext.current(host)
        const validationErrors: ValidationError[] = exception.getResponse()['message']

        // In case we didn't specify a ValidationError type of error
        if (typeof validationErrors != 'string') {
          I18nLibrary(validationErrors, i18n)
        }

        code = ErrorCodes.BAD_REQUEST_ERROR.code
        description = ErrorCodes.BAD_REQUEST_ERROR.description
      }
      // 401
      else if (exception instanceof UnauthorizedException) {
        code = ErrorCodes.UNAUTHORIZED_ERROR.code
        description = ErrorCodes.UNAUTHORIZED_ERROR.description
      }

      // 403
      else if (exception instanceof ForbiddenException) {
        code = ErrorCodes.FORBIDDEN_ERROR.code
        description = ErrorCodes.FORBIDDEN_ERROR.description
      }

      // 404
      else if (exception instanceof NotFoundException) {
        code = ErrorCodes.NOT_FOUND_ERROR.code
        description = ErrorCodes.NOT_FOUND_ERROR.description
      }

      this.logger.error(
        'HttpExceptionFilter - unexpected',
        `REQUEST ID : ${requestId}, REQUEST PATH: ${requestPath}, RESPONSE: ${JSON.stringify(
          unExpectedResponse,
        )}, STACK: ${stack}`,
      )

      /**
       * if actual message delivers to this filter,
       * we use the actual error message to its response
       *
       * e.g. class validator exception
       *   or throw new BadRequestException('error message')
       */
      const actualErrorMessage = unExpectedResponse['message']
      if (actualErrorMessage) {
        description = actualErrorMessage
      }
    }

    code = code ?? ErrorCodes.UNEXPECTED_ERROR.code
    description = description ?? ErrorCodes.UNEXPECTED_ERROR.description

    response.status(status).json(new GlobalErrorResponseDto(code, description, requestPath, requestId))
  }
}

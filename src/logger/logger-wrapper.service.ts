import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { isEmpty } from 'lodash'
import { AsyncLocalStorage } from 'async_hooks'

@Injectable()
export class LoggerWrapperService {
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService

  constructor(private readonly als: AsyncLocalStorage<any>) {}

  addRequestId(message: string) {
    if (isEmpty(this.als.getStore()) || isEmpty(this.als.getStore()['x-request-id'])) {
      return message
    }

    return `REQUEST ID: ${this.als.getStore()['x-request-id']}, ` + message
  }

  error(tag: string, message: string, stack?: any) {
    message = this.addRequestId(message)
    this.logger.error(message, stack, tag)
  }

  warn(tag: string, message: string) {
    message = this.addRequestId(message)
    this.logger.warn(message, tag)
  }

  info(tag: string, message: string) {
    message = this.addRequestId(message)
    this.logger.log(message, tag)
  }

  verbose(tag: string, message: string) {
    message = this.addRequestId(message)
    this.logger.verbose(message, tag)
  }

  debug(tag: string, message: string) {
    message = this.addRequestId(message)
    this.logger.debug(message, tag)
  }

  log(tag: string, message: string) {
    message = this.addRequestId(message)
    this.logger.log(message, tag)
  }
}

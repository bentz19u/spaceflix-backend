import { Inject, Injectable, LoggerService } from '@nestjs/common'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

@Injectable()
export class LoggerWrapperExceptionFilterService {
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  private readonly logger: LoggerService

  error(tag: string, message: string, stack?: any) {
    this.logger.error(message, stack, tag)
  }

  warn(tag: string, message: string) {
    this.logger.warn(message, tag)
  }

  info(tag: string, message: string) {
    this.logger.log(message, tag)
  }

  verbose(tag: string, message: string) {
    this.logger.verbose(message, tag)
  }

  debug(tag: string, message: string) {
    this.logger.debug(message, tag)
  }
}

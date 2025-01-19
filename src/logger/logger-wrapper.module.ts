import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { LoggerWrapperService } from './logger-wrapper.service'
import { LoggerWrapperExceptionFilterService } from './logger-wrapper-exception-filter.service'
import { IncomingLoggerMiddleware } from './middleware/incoming-logger.middleware'
import { AsyncLocalStorage } from 'async_hooks'

@Module({
  imports: [],
  providers: [
    LoggerWrapperService,
    LoggerWrapperExceptionFilterService,
    {
      provide: AsyncLocalStorage,
      useValue: new AsyncLocalStorage(),
    },
  ],
  exports: [AsyncLocalStorage, LoggerWrapperService, LoggerWrapperExceptionFilterService],
})
export class LoggerWrapperModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IncomingLoggerMiddleware).forRoutes('*')
  }
}

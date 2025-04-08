import { BadRequestException, Module, ValidationError, ValidationPipe } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import databaseConfig from './configs/default.config'
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { DefaultTypeOrmService } from './configs/default-type-orm.service'
import { UsersModule } from './users/users.module'
import { AuthModule } from '@auth/auth.module'
import { SystemStatesModule } from './system-states/system-states.module'
import { SeederRepository } from '@entities/repositories/seeder.repository'
import { LoggerWrapperModule } from './logger/logger-wrapper.module'
import { WebHooksModule } from './logger/web-hooks/web-hooks.module'
import { WinstonModule, WinstonModuleAsyncOptions } from 'nest-winston'
import * as winston from 'winston'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import { AllExceptionFilter } from './logger/exception-filters/all-exception.filter'
import { HttpExceptionFilter } from './logger/exception-filters/http-exception.filter'
import { TypeOrmExceptionFilter } from './logger/exception-filters/typeorm-exception.filter'
import { HeaderResolver, I18nModule } from 'nestjs-i18n'
import path from 'node:path'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV == 'TEST' ? ['.env.test.local', '.env.test'] : ['.env.local', '.env'],
      load: [databaseConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(<TypeOrmModuleAsyncOptions>{
      name: 'default',
      useClass: DefaultTypeOrmService,
      inject: [ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-custom-lang'])],
    }),
    WinstonModule.forRootAsync(<WinstonModuleAsyncOptions>{
      // used by the logging system
      useFactory: async (configService: ConfigService) => ({
        transports: [
          new winston.transports.Console({
            level:
              process.env.NODE_ENV == 'PROD'
                ? configService.get<string>('logger.LEVEL_IN_PRODUCTION')
                : configService.get<string>('logger.LEVEL_IN_DEVELOPMENT'),
            format: winston.format.combine(
              winston.format.timestamp({
                format: configService.get<string>('logger.DATETIME_FORMAT'),
              }),
              winston.format.printf(
                (info) => `[${info.timestamp}] ${info.level.toUpperCase()} [${info.context}]  ${info.message}`,
              ),
              winston.format.colorize({ all: true }),
            ),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    SystemStatesModule,
    LoggerWrapperModule,
    WebHooksModule,
  ],
  controllers: [],
  providers: [
    /**
     * Binding Exception filters in Global
     *
     * The filter that is registered last will have the highest priority.
     * So the most specific filter should be registered last:
     */
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: TypeOrmExceptionFilter,
    },

    /**
     * Binding Pipes in Global
     */
    {
      provide: APP_PIPE,
      useFactory: async () =>
        new ValidationPipe({
          forbidUnknownValues: false,
          transform: true,
          exceptionFactory: (errors: ValidationError[]): any => {
            return new BadRequestException(errors)
          },
        }),
    },
    SeederRepository,
  ],
})
export class AppModule {}

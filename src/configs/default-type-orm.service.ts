import { Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'

@Injectable()
export class DefaultTypeOrmService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get('database.host'),
      port: +this.configService.get<number>('database.port'),
      username: this.configService.get('database.user'),
      password: <string>this.configService.get('database.password'),
      database: <string>this.configService.get('database.schema'),
      entities: [join(__dirname, '../entities/**/*.entity{.ts,.js}')],
      timezone: 'Z',
      synchronize: this.configService.get('NODE_ENV') === 'TEST' || this.configService.get('NODE_ENV') === 'LOCAL',
      namingStrategy: new SnakeNamingStrategy(),
      autoLoadEntities: true,
      logging:
        this.configService.get('NODE_ENV') === 'LOCAL' ||
        this.configService.get('NODE_ENV') === 'DEV' ||
        this.configService.get('NODE_ENV') === 'TEST'
          ? ['error', 'warn', 'info']
          : false,
    }
  }
}

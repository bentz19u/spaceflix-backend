import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import databaseConfig from './config/default.config'
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { DefaultTypeOrmService } from './config/default-type-orm.service'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { SystemStatesModule } from './system-states/system-states.module';

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
    UsersModule,
    AuthModule,
    SystemStatesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

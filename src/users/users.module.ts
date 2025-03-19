import { Module } from '@nestjs/common'
import { UsersSeederModule } from './seeder/users-seeder.module'
import { UsersController } from './users.controller'

@Module({
  imports: [UsersSeederModule],
  controllers: [UsersController],
})
export class UsersModule {}

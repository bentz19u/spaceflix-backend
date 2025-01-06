import { Module } from '@nestjs/common'
import { UsersSeederModule } from './seeder/users-seeder.module'

@Module({
  imports: [UsersSeederModule],
})
export class UsersModule {}

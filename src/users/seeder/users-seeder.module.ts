import { Module } from '@nestjs/common'
import { UsersSeederService } from './users-seeder.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersEntity } from '@entities/users.entity'
import { UsersRepository } from '@entities/repositories/users.repository'

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [],
  providers: [UsersSeederService, UsersRepository],
  exports: [UsersSeederService, UsersRepository],
})
export class UsersSeederModule {}

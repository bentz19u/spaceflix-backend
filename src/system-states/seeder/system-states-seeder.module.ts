import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SystemStatesEntity } from '@entities/system-states.entity'
import { SystemStatesSeederService } from './system-states-seeder.service'
import { SystemStatesRepository } from '@entities/repositories/system-states.repository'

@Module({
  imports: [TypeOrmModule.forFeature([SystemStatesEntity])],
  controllers: [],
  providers: [SystemStatesSeederService, SystemStatesRepository],
  exports: [SystemStatesSeederService, SystemStatesRepository],
})
export class SystemStatesSeederModule {}

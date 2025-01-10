import { Module } from '@nestjs/common'
import { SystemStatesSeederModule } from './seeder/system-states-seeder.module'

@Module({
  imports: [SystemStatesSeederModule],
})
export class SystemStatesModule {}

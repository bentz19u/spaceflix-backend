import { Injectable, Logger } from '@nestjs/common'
import { SystemStatesRepository } from '@entities/repositories/system-states.repository'
import { CreateSystemStateRequestDto } from '../dtos/create-system-state-request.dto'
import { SystemStatesEntity } from '@entities/system-states.entity'

@Injectable()
export class SystemStatesSeederService {
  private readonly logger = new Logger(SystemStatesSeederService.name)

  constructor(private readonly systemStatesRepository: SystemStatesRepository) {}

  async seedDatabase(): Promise<any> {
    const count = await this.systemStatesRepository.count()
    if (count > 0 || !['LOCAL', 'TEST'].includes(process.env.NODE_ENV)) {
      return
    }

    try {
      await this.seed()
    } catch (err) {
      this.logger.error(`SystemStatesSeederService#seedDatabase.catch ${JSON.stringify(err)}`)
    }
  }

  async seed() {
    const defaults: CreateSystemStateRequestDto[] = [
      {
        hashKey: 'superpass',
        hashValue: '$argon2id$v=19$m=65536,t=3,p=4$IB0FL1S7Xnwfr6k1UmD+Qg$7wEn64/s+zfxz4VvtljO4AYE+kY1z0IpIwgXNWmmSF4',
      },
    ]

    for (const user of defaults) {
      await this.createForSeeder(user)
    }
  }

  async createForSeeder(request: CreateSystemStateRequestDto): Promise<SystemStatesEntity> {
    const entity = this.systemStatesRepository.create(request)
    return await this.systemStatesRepository.save(entity)
  }
}

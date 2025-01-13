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
    if (count > 0 || !['LOCAL'].includes(process.env.NODE_ENV)) {
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
        hashValue: '$argon2id$v=19$m=65536,t=3,p=4$z1Y+/6gEisi8tU3BM/9CCw$HCi6QL7DK5nypE+W1NlSVdou9nMNDZ3TweFj3L+CUA4',
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

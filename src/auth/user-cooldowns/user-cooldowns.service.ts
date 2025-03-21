import { Injectable } from '@nestjs/common'
import { CreateUserCooldownRequestDto } from '@auth/user-cooldowns/dtos/create-user-cooldown-request.dto'
import { UserCooldownsRepository } from '@entities/repositories/user-cooldowns.repository'

@Injectable()
export class UserCooldownsService {
  cooldowns = [
    60, // 1 minute
    180, // 3 minutes
    600, // 10 minutes
    1800, // 30 minutes
    3600, // 1 hour
    10800, // 3 hours
    43200, // 12 hours
    86400, // 1 day
    259200, // 3 days
    604800, // 7 days
  ]

  constructor(private readonly userCooldownsRepository: UserCooldownsRepository) {}

  async mustWait(userId: number): Promise<boolean> {
    const result = await this.userCooldownsRepository.findOneAllowedAfterNow(userId)
    return !!result
  }

  async incrementUserCooldown(userId: number) {
    let cooldownCount7d = await this.userCooldownsRepository.findCooldownCount(userId, 604800)
    cooldownCount7d = Math.min(9, cooldownCount7d)
    const cooldown = this.cooldowns[cooldownCount7d]

    const createUserCooldownRequestDto: CreateUserCooldownRequestDto = {
      userId,
      cooldownSeconds: cooldown,
    }
    await this.userCooldownsRepository.createUserCooldownByEmail(createUserCooldownRequestDto)
  }
}

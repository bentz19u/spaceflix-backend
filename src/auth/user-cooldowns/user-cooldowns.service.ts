import { Injectable } from '@nestjs/common'
import { CreateUserCooldownRequestDto } from './dto/create-user-cooldown-request.dto'
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

  // async mustWait(email: string): Promise<boolean> {
  //   const result = await this.userCooldownsRepository.findOneAllowedAfterNowByEmail(email)
  //   return !!result
  // }
  //
  // async incrementUserCooldownByEmail(email: string, ip: string) {
  //   let cooldownCount7d = await this.userCooldownsRepository.findCooldownCount(email, 604800)
  //   cooldownCount7d = Math.min(9, cooldownCount7d)
  //   const cooldown = this.cooldowns[cooldownCount7d]
  //
  //   const createUserCooldownRequestDto: CreateUserCooldownRequestDto = {
  //     email,
  //     cooldownSeconds: cooldown,
  //     ipAddress: ip,
  //   }
  //   await this.userCooldownsRepository.createUserCooldownByEmail(createUserCooldownRequestDto)
  // }
}

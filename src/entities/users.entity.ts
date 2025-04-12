import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { LoginAttemptsEntity } from '@entities/login-attempts.entity'
import { UserCooldownsEntity } from '@entities/user-cooldowns.entity'
import { UserTokensEntity } from '@entities/user-tokens.entity'
import { UserIpsEntity } from '@entities/user-ips.entity'
import { UserPlanEnum } from '../common/enums/plan.enum'

@Unique('email', ['email'])
@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number

  @Column({
    type: 'varchar',
    name: 'email',
    length: 191,
    nullable: false,
  })
  email: string

  @Column('varchar', { name: 'password', length: 255, nullable: false })
  password: string

  @Column({ enum: ['standard_with_ads', 'standard', 'premium'], default: UserPlanEnum.STANDARD_ADS })
  plan: UserPlanEnum

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt: string

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt: Date

  @OneToMany(() => UserCooldownsEntity, (userCooldown) => userCooldown.user)
  userCooldowns: UserCooldownsEntity[]

  @OneToMany(() => UserIpsEntity, (userIp) => userIp.user)
  userIps: UserIpsEntity[]

  @OneToMany(() => LoginAttemptsEntity, (loginAttempt) => loginAttempt.user)
  loginAttempts: LoginAttemptsEntity[]

  @OneToMany(() => UserTokensEntity, (userToken) => userToken.user)
  userTokens: UserTokensEntity[]
}

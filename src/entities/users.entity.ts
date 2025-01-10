import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { LoginAttemptsEntity } from '@entities/login-attempts.entity'
import { UserCooldownsEntity } from '@entities/user-cooldowns.entity'
import { UserTokensEntity } from '@entities/user-tokens.entity'
import { UserIpsEntity } from '@entities/user-ips.entity'

@Unique('email', ['email'])
@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number

  @Column({
    type: 'varchar',
    name: 'email',
    length: 255,
    nullable: false,
  })
  email: string

  @Column('varchar', { name: 'password', length: 255, nullable: false })
  password: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt: string

  @OneToMany(() => UserCooldownsEntity, (userCooldown) => userCooldown.user)
  userCooldowns: UserCooldownsEntity[]

  @OneToMany(() => UserIpsEntity, (userIp) => userIp.user)
  userIps: UserIpsEntity[]

  @OneToMany(() => LoginAttemptsEntity, (loginAttempt) => loginAttempt.user)
  loginAttempts: LoginAttemptsEntity[]

  @OneToMany(() => UserTokensEntity, (userToken) => userToken.user)
  userTokens: UserTokensEntity[]
}

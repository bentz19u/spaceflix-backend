import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UsersEntity } from '@entities/users.entity'

@Entity('login_attempts')
export class LoginAttemptsEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
    name: 'id',
    unsigned: true,
  })
  id: number

  @Column('int', { name: 'user_id', nullable: false, unsigned: true })
  userId: number

  @Column('varchar', { name: 'ip_address', length: 255 })
  ipAddress: string

  @Column('bool', { name: 'ignore_for_cooldown', default: false })
  ignoreForCooldown = false

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt: string

  @ManyToOne(() => UsersEntity, (user) => user.loginAttempts)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity
}

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { UsersEntity } from '@entities/users.entity'

@Entity('user_cooldowns')
export class UserCooldownsEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
    name: 'id',
  })
  id: number

  @Column({
    type: 'int',
    name: 'user_id',
    unsigned: true,
  })
  userId: number

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt: string

  @Column('timestamp', { name: 'allowed_at', nullable: false })
  allowedAt: string

  @ManyToOne(() => UsersEntity, (user) => user.userCooldowns)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity
}

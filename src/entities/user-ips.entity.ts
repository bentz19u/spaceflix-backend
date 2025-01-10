import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { UsersEntity } from '@entities/users.entity'

@Entity('user_ips')
export class UserIpsEntity {
  @PrimaryColumn({
    type: 'int',
    name: 'user_id',
    unsigned: true,
  })
  userId: number

  @PrimaryColumn({
    type: 'timestamp',
    width: 2,
    name: 'created_at',
  })
  createdAt: string

  @Column('char', { name: 'ip_address', length: 32 })
  ipAddress: string

  @ManyToOne(() => UsersEntity, (user) => user.userIps)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity
}

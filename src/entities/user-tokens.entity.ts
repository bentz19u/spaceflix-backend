import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { UsersEntity } from '@entities/users.entity'

@Entity('user_tokens')
export class UserTokensEntity {
  @PrimaryColumn({
    type: 'int',
    name: 'user_id',
    unsigned: true,
  })
  userId: number

  @Column('varchar', { name: 'token', nullable: true, length: 150 })
  token: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt: string

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: false })
  updatedAt: string

  @ManyToOne(() => UsersEntity, (user) => user.userTokens)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity
}

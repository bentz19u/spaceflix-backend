import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

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
}

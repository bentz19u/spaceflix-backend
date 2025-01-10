import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Index('hash_key', ['hashKey'], { unique: true })
@Entity('system_states')
export class SystemStatesEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'int',
    name: 'id',
    unsigned: true,
  })
  id: number

  @Column('varchar', { name: 'hash_key', length: 128 })
  hashKey: string

  @Column('varchar', { name: 'hash_value', length: 128 })
  hashValue: string

  @Column('varchar', { name: 'comment', length: 256, nullable: true })
  comment: string
}

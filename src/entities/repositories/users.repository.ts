import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { UsersEntity } from '@entities/users.entity'

@Injectable()
export class UsersRepository extends Repository<UsersEntity> {
  constructor(
    @InjectDataSource('default') private dataSource,
    @InjectRepository(UsersEntity) private repository: Repository<UsersEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner)
  }

  async checkPassword(email: string, password: string): Promise<boolean> {
    // mysql method password() doesn't seem to work with TypeORM
    // UPPER(CONCAT('*', SHA1(UNHEX(SHA1(:hashValue)))))
    // This is actually what password() does internally
    const result = await this.createQueryBuilder('u')
      .select()
      .where('u.email = :email', { email })
      .andWhere(`u.password = UPPER(CONCAT('*', SHA1(UNHEX(SHA1(:password)))))`, { password })
      .getOne()

    return !!result
  }
}

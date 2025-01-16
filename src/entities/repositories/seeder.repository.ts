import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

@Injectable()
export class SeederRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  // this method is only used when seeding on bootstrap
  // or during e2e tests
  async clear(): Promise<void> {
    // we don't want to clean the production env
    if (['LOCAL', 'TEST'].includes(process.env.NODE_ENV)) {
      const queryRunner = this.dataSource.createQueryRunner()
      await queryRunner.connect()
      await queryRunner.startTransaction()
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0')

      const entities = this.dataSource.entityMetadatas
      for (const entity of entities) {
        await queryRunner.manager.clear(entity.name)
      }

      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1')
      await queryRunner.commitTransaction()
      await queryRunner.release()
    }
  }
}

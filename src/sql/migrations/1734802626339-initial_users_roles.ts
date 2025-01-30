import { SqlReader } from './../../utils/sql/sql-reader';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialUsersRoles1734802626339 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      const filePath = 'src/sql/schema/user/user.up.sql';
      await SqlReader.runSqlFileAsync(
        filePath,
        async (instraction) => await queryRunner.query(instraction),
      );
    } catch (error) {
      console.error('[InitialUsersRoles1734802626339]: Fn: up: ', error);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      const filePath = 'src/sql/schema/user/user.down.sql';
      await SqlReader.runSqlFileAsync(
        filePath,
        async (instraction) => await queryRunner.query(instraction),
      );
    } catch (error) {
      console.error('[InitialUsersRoles1734802626339]: Fn: down: ', error);
    }
  }
}

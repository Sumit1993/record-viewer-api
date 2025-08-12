import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1755025570148 implements MigrationInterface {
  name = 'Init1755025570148';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "record_viewer"."record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "recordNumber" character varying NOT NULL, "recordType" character varying NOT NULL, "applicantName" character varying NOT NULL, "dateSubmitted" character varying NOT NULL, "addresses" text array NOT NULL, "recordStatus" character varying NOT NULL, "emails" text array NOT NULL, "phoneNumbers" text array NOT NULL, "description" character varying, "tenure" integer, CONSTRAINT "PK_5cb1f4d1aff275cf9001f4343b9" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "record_viewer"."record"`);
  }
}

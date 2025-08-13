"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Init1755025570148 = void 0;
class Init1755025570148 {
    name = 'Init1755025570148';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "record_viewer"."record" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "recordNumber" character varying NOT NULL, "recordType" character varying NOT NULL, "applicantName" character varying NOT NULL, "dateSubmitted" character varying NOT NULL, "addresses" text array NOT NULL, "recordStatus" character varying NOT NULL, "emails" text array NOT NULL, "phoneNumbers" text array NOT NULL, "description" character varying, "tenure" integer, CONSTRAINT "PK_5cb1f4d1aff275cf9001f4343b9" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "record_viewer"."record"`);
    }
}
exports.Init1755025570148 = Init1755025570148;
//# sourceMappingURL=1755025570148-Init.js.map
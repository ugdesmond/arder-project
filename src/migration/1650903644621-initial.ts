import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1650903644621 implements MigrationInterface {
    name = 'initial1650903644621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "AccountRecord" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tokenCredit" numeric NOT NULL, "tokenDebit" numeric NOT NULL, "fiatCredit" numeric, "fiatDebit" numeric, "tokenFeeDebit" numeric, "tokenFeeCredit" numeric, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "accontRecordType" character varying, "transactionId" uuid, "userId" uuid, CONSTRAINT "PK_e974d5e34e0a7c3d616e243b5ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tokenBalance" numeric NOT NULL, "fiatBalance" numeric NOT NULL, "userType" character varying NOT NULL, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transactionType" character varying NOT NULL, "transactionAmount" numeric, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "accountToId" uuid, "accountFromId" uuid, CONSTRAINT "PK_21eda4daffd2c60f76b81a270e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "AccountRecord" ADD CONSTRAINT "FK_25300f5d9cde803602bed29bc12" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "AccountRecord" ADD CONSTRAINT "FK_5fbb96510621340cee3df821493" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transaction" ADD CONSTRAINT "FK_5079575db731af31a30d06b823e" FOREIGN KEY ("accountToId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Transaction" ADD CONSTRAINT "FK_db240f08300f9235a46d2321ae1" FOREIGN KEY ("accountFromId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Transaction" DROP CONSTRAINT "FK_db240f08300f9235a46d2321ae1"`);
        await queryRunner.query(`ALTER TABLE "Transaction" DROP CONSTRAINT "FK_5079575db731af31a30d06b823e"`);
        await queryRunner.query(`ALTER TABLE "AccountRecord" DROP CONSTRAINT "FK_5fbb96510621340cee3df821493"`);
        await queryRunner.query(`ALTER TABLE "AccountRecord" DROP CONSTRAINT "FK_25300f5d9cde803602bed29bc12"`);
        await queryRunner.query(`DROP TABLE "Transaction"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "AccountRecord"`);
    }

}

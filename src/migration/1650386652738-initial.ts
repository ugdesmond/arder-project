import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1650386652738 implements MigrationInterface {
    name = 'initial1650386652738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "tokenBalance" numeric NOT NULL, "fiatBalance" numeric NOT NULL, "userType" character varying NOT NULL, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "AccountRecord" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tokenCredit" numeric NOT NULL, "tokenDebit" numeric NOT NULL, "fiatCredit" numeric, "fiatDebit" numeric, "tokenFeeDebit" numeric, "tokenFeeCredit" numeric, "pendingTokenBalanceDebit" numeric, "pendingTokenBalanceCredit" numeric, "createDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_e974d5e34e0a7c3d616e243b5ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "AccountRecord" ADD CONSTRAINT "FK_5fbb96510621340cee3df821493" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "AccountRecord" DROP CONSTRAINT "FK_5fbb96510621340cee3df821493"`);
        await queryRunner.query(`DROP TABLE "AccountRecord"`);
        await queryRunner.query(`DROP TABLE "User"`);
    }

}

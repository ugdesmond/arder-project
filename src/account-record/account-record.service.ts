import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import AccountRecord from 'src/model/accountrecord.entity';
import Transaction from 'src/model/transaction.entity';
import { User } from 'src/model/user.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserService } from 'src/user/user.service';
import { CurrencyRate, getUsdEquivalent, TRANSACTION_TYPE, TOKEN_FEE } from 'src/util/Helper';
import { Repository, Between, Connection, Not } from 'typeorm';
import { AccountRecordDto } from './account.dto';

@Injectable()
export class AccountRecordService {
    constructor(
        @InjectRepository(AccountRecord)
        private readonly accountRepository: Repository<AccountRecord>, private userService: UserService, private transactionService: TransactionService,
        private connection: Connection,
    ) { }


    public async convertToUsd(): Promise<void> {
        let endDate = new Date();
        let beginDate = await this.subtractHours(1);
        let records = await this.accountRepository.find({ where: { createDateTime: Between(beginDate, endDate), tokenCredit: Not(0) }, relations: ['user', 'transaction', 'transaction.accountFrom', 'transaction.accountTo'], select: ['tokenCredit'] });
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const record of records) {
                for (let i = 0; i < 2; i++) {
                    let recordVal = new AccountRecord();
                    recordVal.fiatCredit = i == 0 ? getUsdEquivalent(CurrencyRate.USD_EQUIVALENT, record.tokenCredit) : 0;
                    recordVal.fiatDebit = 0;
                    recordVal.tokenCredit = 0;
                    recordVal.tokenDebit = i == 0 ? record.tokenCredit : 0;
                    recordVal.transaction = record.transaction;
                    recordVal.tokenFeeCredit = 0;
                    recordVal.user = i == 0 ? record.transaction.accountTo : record.transaction.accountFrom
                    recordVal.accontRecordType = TRANSACTION_TYPE.TOKEN_USD_CONVERSION;
                    recordVal.tokenFeeDebit = i == 0 ? 0 : TOKEN_FEE.TRANSACTION_CHARGE;
                    await queryRunner.manager.save(recordVal);
                }
            }
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }


    public async findByCurrentDate(userId: string): Promise<AccountRecord[]> {
        const { beginDate, endDate } = await this.getTodayDate();
        let account = new User();
        account.id = userId;
        return await this.accountRepository.find({ where: { createDateTime: Between(beginDate, endDate), user: account, tokenCredit: Not(0) }, relations: ['user', 'transaction', 'transaction.accountFrom'] });
    }



    public async findByDateRange(begingDate: string, endDate: string, userId: string): Promise<AccountRecord[]> {
        let startDate = new Date(begingDate);
        startDate.setHours(0, 0, 0, 0);
        let finalDate = new Date(endDate);
        finalDate.setHours(23, 59, 59);
        let account = new AccountRecord();
        account.id = userId;
        return await this.accountRepository.find({ where: { createDateTime: Between(startDate, finalDate), user: account, accontRecordType: TRANSACTION_TYPE.TOKEN_TRANSFER }, relations: ['user', 'transaction'] });
    }



    public async getAccountHistoryStatistics(userId: string): Promise<any> {

        const { beginDate, endDate } = await this.getTodayDate();
        let account = new AccountRecord();
        account.id = userId;
        const { tokenSum } = await this.accountRepository
            .createQueryBuilder("account")
            .leftJoin("account.user", "user")
            .select("SUM(account.tokenCredit)", "tokenSum")
            .andWhere(`"account"."createDateTime" BETWEEN :begin  AND :end`, { begin: beginDate, end: endDate })
            .andWhere("user.id = :userId", { userId })
            .getRawOne()

        const user = await this.userService.findOne(userId);
        return AccountRecordDto.fromEntity(user, tokenSum);
    }

    public async create(account: AccountRecordDto): Promise<Transaction> {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        let transaction = await this.transactionService.create(account);
        try {

            for (let i = 0; i < 2; i++) {

                let user = new User();
                user.id = i == 0 ? transaction.accountFrom.id : transaction.accountTo.id;
                let recordVal = new AccountRecord();
                recordVal.tokenCredit = i == 1 ? account.tokenAmount : 0;
                recordVal.tokenDebit = i == 0 ? account.tokenAmount : 0;
                recordVal.fiatDebit = 0;
                recordVal.fiatDebit = 0;
                recordVal.tokenFeeCredit = 0;
                recordVal.tokenFeeDebit = 0;
                recordVal.fiatCredit = 0;
                recordVal.fiatDebit = 0
                recordVal.transaction = transaction;
                recordVal.user = user;
                recordVal.accontRecordType = transaction.transactionType;
                await queryRunner.manager.save(recordVal);
            }
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }


        return this.transactionService.findById(transaction.id);
    }

    public async subtractHours(numOfHours, date = new Date()): Promise<Date> {
        date.setHours(date.getHours() - numOfHours);
        return date;
    }


    public async getTodayDate(): Promise<{ beginDate: Date, endDate: Date }> {
        let beginDate = new Date();
        beginDate.setHours(0, 0, 0, 0);
        let endDate = new Date();
        endDate.setHours(23, 59, 59);
        return { beginDate, endDate };
    }


    public async updateUserAccountBalance(accountRecord: AccountRecord): Promise<any> {
        const userDetail = await this.userService.findOne(accountRecord.user.id);
        let tokenBalance = parseFloat(userDetail.tokenBalance.toString());
        let usdBalance = parseFloat(userDetail.fiatBalance.toString());

        if (accountRecord.fiatCredit != 0) {
            usdBalance += accountRecord.fiatCredit;
        }
        if (accountRecord.fiatDebit != 0) {
            usdBalance -= accountRecord.fiatDebit;
        }

        if (accountRecord.tokenCredit != 0) {
            tokenBalance += accountRecord.tokenCredit;
        }

        if (accountRecord.tokenDebit != 0) {
            tokenBalance -= accountRecord.tokenDebit;
        }
        if (accountRecord.tokenFeeCredit != 0) {
            tokenBalance += accountRecord.tokenFeeCredit;
        }
        if (accountRecord.tokenFeeDebit != 0) {
            tokenBalance -= accountRecord.tokenFeeDebit;
        }
        const val = await this.userService.update(usdBalance, tokenBalance, userDetail.id);


    }


}

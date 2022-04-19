import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Console } from 'console';
import AccountRecord from 'src/model/accountrecord.entity';
import { User } from 'src/model/user.entity';
import { UserService } from 'src/user/user.service';
import { CurrencyRate, getTotalBalance, getUsdEquivalent } from 'src/util/Helper';
import { Repository, Between, Connection } from 'typeorm';
import { AccountRecordDto } from './account.dto';

@Injectable()
export class AccountRecordService {
    constructor(
        @InjectRepository(AccountRecord)
        private readonly accountRepository: Repository<AccountRecord>, private userService: UserService,
        private connection: Connection,
    ) { }


    public async convertToUsd(): Promise<void> {
        let endDate = new Date();
        let beginDate = await this.subtractHours(1);
        let records = await this.accountRepository.find({ where: { createDateTime: Between(beginDate, endDate), fiatCredit: 0 }, relations: ['user'], select: ['tokenCredit'] });
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const record of records) {
                let recordVal = new AccountRecord();
                recordVal.fiatCredit = getUsdEquivalent(CurrencyRate.USD_EQUIVALENT, record.tokenCredit);
                recordVal.fiatDebit = 0;
                recordVal.tokenCredit = 0;
                recordVal.tokenDebit = 0;
                recordVal.pendingTokenBalanceDebit = 0.1;
                recordVal.pendingTokenBalanceCredit = 0;
                recordVal.tokenFeeCredit = 0.1;
                recordVal.tokenFeeDebit = 0;
                recordVal.user = record.user;
                await queryRunner.manager.save(recordVal);
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
        let account = new AccountRecord();
        account.id = userId;
        return await this.accountRepository.find({ where: { createDateTime: Between(beginDate, endDate), user: account }, relations: ['user'], select: ['tokenCredit', 'id', 'tokenDebit'] });
    }



    public async findByDateRange(begingDate: string, endDate: string, userId: string): Promise<AccountRecord[]> {
        let startDate = new Date(begingDate);
        startDate.setHours(0, 0, 0, 0);
        let finalDate = new Date(endDate);
        finalDate.setHours(23, 59, 59);
        let account = new AccountRecord();
        account.id = userId;
        return await this.accountRepository.find({ where: { createDateTime: Between(startDate, finalDate), user: account }, relations: ['user'], select: ['fiatCredit', 'id', 'fiatDebit'] });
    }



    public async getAccountHistoryStatistics(userId: string): Promise<any> {

        const { beginDate, endDate } = await this.getTodayDate();
        let account = new AccountRecord();
        account.id = userId;
        let recordHistory = await this.accountRepository.find({ where: { createDateTime: Between(beginDate, endDate), user: account }, relations: ['user'], select: ['tokenCredit', 'id',] });
        return AccountRecordDto.fromEntity(recordHistory);
    }

    public async create(account: AccountRecordDto): Promise<AccountRecord> {
        return this.accountRepository.save(AccountRecordDto.toEntity(account));
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


    public async updateUserAccountBalance(user: User): Promise<any> {
        const { tokenSum, usdSum } = await this.accountRepository
            .createQueryBuilder("account")
            .select("SUM(account.tokenCredit)", "tokenSum")
            .addSelect("SUM(account.fiatCredit)", "usdSum")
            .where("account.userId = :id", { id: user.id })
            .getRawOne()
        const val = await this.userService.update(usdSum, tokenSum, user.id,);


    }


}

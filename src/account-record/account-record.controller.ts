import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import AccountRecord from 'src/model/accountrecord.entity';
import { AccountRecordService } from './account-record.service';
import { AccountRecordDto } from './account.dto';

@Controller('account-record')
export class AccountRecordController {
    constructor(private readonly accountService: AccountRecordService) { }

    @ApiOperation({ summary: 'Credit user token won' })
    @Post()
    createUserTransaction(@Body() account: AccountRecordDto): Promise<AccountRecord> {
        return this.accountService.create(account);
    }
    @ApiOperation({ summary: 'Get all user token won for the current day' })
    @Get('/user/:id/today')
    getUserDailyTransaction(@Param('id') userId:string): Promise<AccountRecord[]> {
        return this.accountService.findByCurrentDate(userId);
    }
    @ApiOperation({ summary: 'Get all user token won by date range' })
    @Get('/user/:id/date-range')
    getUserHistory(@Param('id') userId: string, @Query('beginDate') beginDate: string, @Query('endDate') endDate: string): Promise<AccountRecord[]> {
        return this.accountService.findByDateRange(beginDate, endDate, userId);
    }

    @ApiOperation({ summary: 'Get  user statistics' })
    @Get('/user/:id/stats')
    getUserStatistics(@Param('id') userId: string): Promise<AccountRecord[]> {
        return this.accountService.getAccountHistoryStatistics(userId);
    }

}

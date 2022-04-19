import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AccountRecordService } from 'src/account-record/account-record.service';

@Injectable()
export class TasksService {
  constructor(private readonly accountService: AccountRecordService) { }

  @Cron(CronExpression.EVERY_HOUR)
  handleCron() {
    this.accountService.convertToUsd();
  }
}
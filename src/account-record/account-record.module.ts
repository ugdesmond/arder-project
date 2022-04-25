import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AccountRecord from 'src/model/accountrecord.entity';
import { TransactionModule } from 'src/transaction/transaction.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AccountRecordController } from './account-record.controller';
import { AccountRecordService } from './account-record.service';
import { AccountRecordSubscriber } from './accout-record.subscriber';
import { TasksService } from './TasksService';

@Module({
  imports: [
      TypeOrmModule.forFeature([AccountRecord]),UserModule,TransactionModule
  ],
  controllers: [AccountRecordController],
  providers: [AccountRecordService,TasksService,AccountRecordSubscriber]
})
export class AccountRecordModule {}

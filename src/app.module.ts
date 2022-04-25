import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { configService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountRecordModule } from './account-record/account-record.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TransactionService } from './transaction/transaction.service';
import { TransactionModule } from './transaction/transaction.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule, AccountRecordModule, ScheduleModule.forRoot(), TransactionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import Transaction from 'src/model/transaction.entity';
import { TransactionService } from './transaction.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([Transaction]),
    ],
    controllers: [],
    providers: [TransactionService],
    exports: [TransactionService]
})
export class TransactionModule {}

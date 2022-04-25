import { Injectable } from '@nestjs/common';
import { AccountRecordDto } from 'src/account-record/account.dto';
import Transaction from 'src/model/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Connection } from 'typeorm';
import { TransactionDto } from './transaction.dto';

@Injectable()

export class TransactionService {


    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
    ) { }

    public async create(transaction: AccountRecordDto): Promise<Transaction> {
        return this.transactionRepository.save(TransactionDto.toEntity(transaction));
    }

    public async findById(transactionId: string): Promise<Transaction> {
      
        return await this.transactionRepository.findOne({ where: { id: transactionId} ,relations:['accountFrom', 'accountTo','accountRecord','accountRecord.user']});
    }


}

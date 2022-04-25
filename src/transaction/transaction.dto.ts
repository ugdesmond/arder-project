
import AccountRecord from "src/model/accountrecord.entity";
import { User } from "src/model/user.entity";
import { IsString, IsUUID, IsDecimal } from 'class-validator';
import { EnumConstants } from "../util/Helper"
import { ApiProperty } from "@nestjs/swagger";
import Transaction from "src/model/transaction.entity";
import { AccountRecordDto } from "src/account-record/account.dto";

export class TransactionDto {
s
    public static toEntity(dto: AccountRecordDto): Transaction {
        const transaction = new Transaction();
        const userFrom = new User();
        const userTo = new User();
        userFrom.id = dto.accountFrom;
        userTo.id = dto.accountTo;
        transaction.accountFrom = userFrom;
        transaction.accountTo = userTo;
        transaction.transactionType = dto.transactionType
        transaction.transactionAmount = dto.tokenAmount;
        return transaction;
    }
}
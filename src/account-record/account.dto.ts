
import AccountRecord from "src/model/accountrecord.entity";
import { User } from "src/model/user.entity";
import { IsString, IsUUID, IsDecimal } from 'class-validator';
import { TRANSACTION_TYPE } from "../util/Helper"
import { ApiProperty } from "@nestjs/swagger";
import Transaction from "src/model/transaction.entity";

export class AccountRecordDto implements Readonly<AccountRecordDto> {
    @ApiProperty()
    @IsUUID()
    accountFrom: string;
    @ApiProperty()
    @IsUUID()
    accountTo: string;
    @ApiProperty()
    @IsDecimal()
    tokenAmount: number;
    @ApiProperty({ default: TRANSACTION_TYPE.TOKEN_TRANSFER })
    transactionType: string;



    public static fromEntity(user:User,totalSum:number): any {
        let objct = {};
        objct['usdBalance'] = user.fiatBalance;
        objct['userId'] = user.id;
        objct['name'] = user.name;
        objct['totalTokenSum'] = totalSum;
        objct['date'] = new Date();
        return objct
    }

    public static toEntity(dto: Partial<AccountRecordDto>,transaction:Transaction): AccountRecord {
        const record = new AccountRecord();
        const userFrom = new User();
        const userTo = new User();
        userFrom.id = dto.accountFrom;
        userTo.id = dto.accountTo;
        record.tokenCredit = dto.tokenAmount;
        record.tokenDebit = 0;
        record.fiatCredit = 0;
        record.fiatDebit = 0;
        record.tokenFeeDebit = 0;
        record.tokenFeeCredit = 0;
        record.transaction=transaction;
    
        return record;
    }
}
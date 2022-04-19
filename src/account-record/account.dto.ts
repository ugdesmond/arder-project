
import AccountRecord from "src/model/accountrecord.entity";
import { User } from "src/model/user.entity";
import { IsString, IsUUID, IsDecimal } from 'class-validator';
import { EnumConstants, getTotalBalance } from "../util/Helper"
import { ApiProperty } from "@nestjs/swagger";

export class AccountRecordDto implements Readonly<AccountRecordDto> {
    @ApiProperty()
    @IsUUID()
    userId: string;
    @ApiProperty()
    @IsDecimal()
    tokenAmount: number;



    public static fromEntity(recordHistory: AccountRecord[]): any {
        let objct = {};
        objct['usdBalance'] = recordHistory[0]?.user.fiatBalance;
        objct['userId'] = recordHistory[0]?.user.id;
        objct['name'] = recordHistory[0]?.user.name;
        objct['totalTokenSum'] = getTotalBalance(recordHistory);
        return objct
    }

    public static toEntity(dto: Partial<AccountRecordDto>): AccountRecord {
        const record = new AccountRecord();
        const user = new User();
        user.id = dto.userId;
        record.tokenCredit = dto.tokenAmount;
        record.user = user;
        record.tokenDebit = 0;
        record.fiatCredit = 0;
        record.fiatDebit = 0;
        record.tokenFeeDebit = 0;
        record.tokenFeeCredit = 0;
        record.pendingTokenBalanceDebit = dto.tokenAmount;
        record.pendingTokenBalanceCredit = 0;
        return record;
    }
}
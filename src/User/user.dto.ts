import { User } from "src/model/user.entity";
import { EnumConstants } from "../util/Helper"
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from "class-validator";

export class UserDto {
    @ApiProperty()
    @IsString()
    name: string;
    @ApiProperty({ default: EnumConstants.USER })
    @IsString()
    userType: string;
    @ApiProperty({ default: 0 })
    tokenBalance: number;



    public static toEntity(dto: UserDto) {
        const userVal = new User();
        userVal.name = dto.name;
        userVal.tokenBalance = dto.tokenBalance  ? parseFloat(dto.tokenBalance.toString()) : 0;
        userVal.fiatBalance = 0;
        userVal.userType = dto.userType == EnumConstants.COMPANY ? EnumConstants.COMPANY : EnumConstants.USER
        return userVal;
    }
} 
import AccountRecord from "src/model/accountrecord.entity";


export const EnumConstants = {
    USER: "USER",
    COMPANY: "COMPANY",
    THIRD_PARTY: "THIRD_PARTY"
}

export const CurrencyRate = {
    "USD_EQUIVALENT": 0.15
}


export const TOKEN_FEE = {
    "TRANSACTION_CHARGE": 0.2
}


export const TRANSACTION_TYPE = {
    "TOKEN_USD_CONVERSION":"TOKEN_USD_CONVERSION",
    "TOKEN_TRANSFER":"TOKEN_TRANSFER"
}

export const getUsdEquivalent = (rate: number, tokenAmount: number) => {
    return tokenAmount * rate;
}



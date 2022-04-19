import AccountRecord from "src/model/accountrecord.entity";


export const EnumConstants = {
    USER: "USER",
    COMPANY: "COMPANY"
}

export const CurrencyRate = {
    "USD_EQUIVALENT": 0.15
}

export const getUsdEquivalent = (rate: number, tokenAmount: number) => {
    return tokenAmount * rate;
}

export const getTotalBalance = (accounts: AccountRecord[]) => {
    let total = 0.0;
    for (const val of accounts) {
        total += parseFloat( val.tokenCredit.toString());
    }
    return total;
}


import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, OneToMany } from 'typeorm';
import AccountRecord from './accountrecord.entity';
import { Transaction } from './transaction.entity';

@Entity({ name: 'User' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'varchar' })
    name: string;
    @Column({ type: 'decimal' })
    tokenBalance: number;

    @Column({ type: 'decimal' })
    fiatBalance: number;

    @Column({ type: 'varchar' })
    userType: string;
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;
    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    lastChangedDateTime: Date;
    @OneToMany(() => Transaction, (transaction) => transaction.accountTo)
    transactionTo: Transaction[]
    @OneToMany(() => Transaction, (transaction) => transaction.accountFrom)
    transactionFrom: Transaction[]

    @OneToMany(() => AccountRecord, (accountRecord) => accountRecord.user)
    account: Transaction[]

}


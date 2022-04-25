import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, ManyToOne, JoinColumn } from 'typeorm';
import Transaction from './transaction.entity';
import { User } from './user.entity';

@Entity({ name: 'AccountRecord' })
export class AccountRecord {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal' })
    tokenCredit: number;

    @Column({ type: 'decimal' })
    tokenDebit: number;

    @Column({ type: 'decimal', nullable: true })
    fiatCredit: number;

    @Column({ type: 'decimal', nullable: true })
    fiatDebit: number;

    @Column({ type: 'decimal', nullable: true })
    tokenFeeDebit: number;

    @Column({ type: 'decimal', nullable: true })
    tokenFeeCredit: number;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    lastChangedDateTime: Date;

    @ManyToOne(() => Transaction, (transaction) => transaction.accountRecord)
    @JoinColumn({ name: 'transactionId' })
    transaction: Transaction

    @ManyToOne(() => User, (user) => user.account)
    @JoinColumn({ name: 'userId' })
    user: User

    @Column({ type: 'varchar',nullable: true })
    accontRecordType: string;


}

export default AccountRecord;
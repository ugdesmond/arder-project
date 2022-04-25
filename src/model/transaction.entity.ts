import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { AccountRecord } from './accountrecord.entity';

@Entity({ name: 'Transaction' })
export class Transaction {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'varchar' })
    transactionType: string;

    @Column({ type: 'decimal', nullable: true })
    transactionAmount: number;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    lastChangedDateTime: Date;

    @ManyToOne(() => User, (user) => user.transactionTo)
    @JoinColumn({ name: 'accountToId' })
    accountTo: User

    @ManyToOne(() => User, (user) => user.transactionFrom)
    @JoinColumn({ name: 'accountFromId' })
    accountFrom: User
    @OneToMany(() => AccountRecord, (accountRecord) => accountRecord.transaction)
    accountRecord: AccountRecord[]
}

export default Transaction;
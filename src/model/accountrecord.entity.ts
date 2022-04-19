import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'AccountRecord' })
export class AccountRecord {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'decimal' })
    tokenCredit: number;

    @Column({ type: 'decimal' })
    tokenDebit: number;

    @Column({ type: 'decimal',nullable:true  })
    fiatCredit: number;

    @Column({ type: 'decimal',nullable:true  })
    fiatDebit: number;

    @Column({ type: 'decimal',nullable:true  })
    tokenFeeDebit: number;

    @Column({ type: 'decimal',nullable:true })
    tokenFeeCredit: number;

    @Column({ type: 'decimal',nullable:true })
    pendingTokenBalanceDebit: number;

    @Column({ type: 'decimal',nullable:true })
    pendingTokenBalanceCredit: number;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    lastChangedDateTime: Date;

    @ManyToOne(() => User, (user) => user.accountRecord)
    @JoinColumn({ name: 'userId' })
    user: User

}

export default AccountRecord;
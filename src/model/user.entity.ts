import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, OneToMany } from 'typeorm';
import { AccountRecord } from './accountrecord.entity';

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
    @OneToMany(() => AccountRecord, (accountRecord) => accountRecord.user)
    accountRecord: AccountRecord[]

}


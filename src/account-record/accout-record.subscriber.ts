import AccountRecord from 'src/model/accountrecord.entity';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';
import { AccountRecordService } from './account-record.service';


@EventSubscriber()
export class AccountRecordSubscriber implements EntitySubscriberInterface<AccountRecord> {
    constructor(connection: Connection, private accountService: AccountRecordService) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return AccountRecord;
    }


    afterInsert(event: InsertEvent<AccountRecord>) {
        this.accountService.updateUserAccountBalance(event.entity);

    }

}
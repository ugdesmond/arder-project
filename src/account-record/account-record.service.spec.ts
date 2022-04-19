import { Test, TestingModule } from '@nestjs/testing';
import { AccountRecordService } from './account-record.service';

describe('AccountRecordService', () => {
  let service: AccountRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountRecordService],
    }).compile();

    service = module.get<AccountRecordService>(AccountRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

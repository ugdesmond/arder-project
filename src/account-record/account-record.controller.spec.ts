import { Test, TestingModule } from '@nestjs/testing';
import { AccountRecordController } from './account-record.controller';

describe('AccountRecordController', () => {
  let controller: AccountRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountRecordController],
    }).compile();

    controller = module.get<AccountRecordController>(AccountRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

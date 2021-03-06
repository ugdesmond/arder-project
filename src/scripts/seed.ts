import * as _ from 'lodash';
import { createConnection, ConnectionOptions } from 'typeorm';
import { configService } from '../config/config.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/model/user.entity';
import { UserDto } from 'src/user/user.dto';
import { EnumConstants } from 'src/util/Helper';

async function run() {

  const opt = {
    ...configService.getTypeOrmConfig(),
    debug: true
  };

  const connection = await createConnection(opt as ConnectionOptions);
  const userService = new UserService(connection.getRepository(User));
  let userDto = new UserDto();
  userDto.name = "TEST";
  userDto.userType = EnumConstants.USER;

  let company = new UserDto();
  company.name = "DREAM LAND"
  company.userType = EnumConstants.COMPANY;
  company.tokenBalance=10000;
  const work = await userService.create(userDto);
  const companyWork = await userService.create(company);

  return  { work, companyWork };

}

run()
  .then(_ => console.log('...wait for script to exit'))
  .catch(error => console.error('seed error', error));

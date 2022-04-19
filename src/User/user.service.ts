import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {User} from 'src/model/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    public async getAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    public async create(user: UserDto): Promise<User> {
        return this.userRepository.save(UserDto.toEntity(user));
    }

    public async update(fiatBalance:number,tokenBalance:number,id:string): Promise<any> {
        return this.userRepository.update(id,{fiatBalance,tokenBalance});
    }
}

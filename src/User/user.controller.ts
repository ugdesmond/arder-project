import { Body, Controller, Get, Post } from '@nestjs/common';
import {User} from 'src/model/user.entity';
import { UserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post()
    createManyUser(@Body() userDto: UserDto): Promise<User> {
        return this.userService.create(userDto);
    }

    @Get()
    getAllUsers(): Promise<User[]> {
        return this.userService.getAll();
    }

}

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email)
    if(existingUser){
      throw new ConflictException('User already exists in the system')
    }
    const hashedPassword = await bcrypt.hash(createUserDto?.password, 10)
    const userData = new this.usersModel(
      {...createUserDto, password:hashedPassword}
    )
    const {password, ...rest} = await userData.save()
    return rest;
  }

  async findByEmail (email: string) {
    return await this.usersModel.findOne({
      email: email?.toLowerCase()
    })
  }

  async findOne(id: number) {
    return await this.usersModel.findById(id)
  }
}

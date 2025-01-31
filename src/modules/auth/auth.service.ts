import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from 'bcryptjs'
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()

export class AuthService {
    constructor (
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(userDto: CreateUserDto){
        const user = await this.usersService.create(userDto);
        const token = await this.generateToken(user?.email, user.id)
        return {user, token}
    }

    async validateUser(userEmail: string, userPassword: string) {
        const userExists = await this.usersService.findByEmail(userEmail);
        if(userExists && await bcrypt.compare(userPassword, userExists?.password)){
            const {password, ...userDetails} = userExists.toObject()
            return userDetails
        }
        return null
    }

    async login( loginCred: LoginUserDto){
        const isValidUser = await this.validateUser(loginCred?.email, loginCred?.password)
        if(!isValidUser) { throw new UnauthorizedException('Invalid Password')}

        const token = await this.generateToken(isValidUser?.email, isValidUser.id)
        return {
            user: {...isValidUser},
            token
        }
    }

    async generateToken(email: string, id: string) {
        const token = await this.jwtService.signAsync({
            email: email,
            id: id
        })
        return token
    }
}
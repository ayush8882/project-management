import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { CreateUserDto } from "../users/dto/create-user.dto";

@Controller('users')
export class AuthController {
    constructor (
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    async register(@Body() userDto: CreateUserDto){
        return await this.authService.register(userDto);
    }

    @Post('login')
    async login(@Body() loginCred: LoginUserDto){
        return await this.authService.login(loginCred);
    }
}
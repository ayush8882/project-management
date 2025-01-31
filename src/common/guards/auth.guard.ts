import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/modules/users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor ( 
        private readonly jwtService: JwtService,
        private readonly userService: UsersService
    ) {}
    async canActivate(context: ExecutionContext):  Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request?.headers?.authorization ? request.headers.authorization : null; // won't be a bearer
        if(!token) {
            throw new UnauthorizedException('Unauthorized Access!')
        }
        // validate the token from authService
        const payload = await this.jwtService.verifyAsync(token); // will have email and id
        if(!payload) { throw new UnauthorizedException('JWT Verification failed!')}
        console.log(payload)
        const userDetails = await this.userService.findByEmail(payload?.email);
        if(!userDetails) { throw new UnauthorizedException('User does not exists in system!')}
        console.log(userDetails)
        request.user = userDetails
        return true;
    }
}
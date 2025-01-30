import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "src/modules/auth/auth.service";

export class JwtAuthGuard implements CanActivate {
    constructor ( private readonly authService: AuthService ) {}
    async canActivate(context: ExecutionContext):  Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const header = request.headers.authorization ? request.headers.authorization.split(' ') : null;
        if(!header) {
            throw new UnauthorizedException('Unauthorized Access!')
        }
        // validate the token from authService
       return await this.authService.validateToken(header)
    }
}
import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext): User => {
        
        const request = ctx.switchToHttp().getRequest();
        const user = request.user as User;

        if (!user) {
            throw new InternalServerErrorException('User not found (request)')
        }

        return !data ? user : user?.[data];
    },
);
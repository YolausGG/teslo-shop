import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClients {
    [id: string]: {
        soket: Socket,
        user: User
    }
}

interface MessageClient {
    fullName: string,
    message: string
}

@Injectable()
export class MessagesWsService {

    private connectedClients: ConnectedClients = {}


    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }


    async registerClient(client: Socket, userId: string) {

        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) throw new Error('User not found')
        if (!user.isActive) throw new Error('User not active')

        this.checkUserConnection(user)

        this.connectedClients[client.id] = {
            soket: client,
            user: user
        }
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId]
    }

    getConnectedClients(): string[] {
        console.log(this.connectedClients);

        return Object.keys(this.connectedClients);
    }

    getUserFullName(socketId: string) {
        return this.connectedClients[socketId].user.fullName
    }

    private checkUserConnection(user: User) {

        for (const clientID of Object.keys(this.connectedClients)) {

            const connectedClient = this.connectedClients[clientID]

            if (connectedClient.user.id === user.id) {
                connectedClient.soket.disconnect()
                break;
            }
        }
    }


}

import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server

  constructor(
    private readonly messagesWsService: MessagesWsService) { }

  handleConnection(client: Socket) {
    // console.log('Client connected', client.id);
    this.messagesWsService.registerClient(client)

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())

  }
  handleDisconnect(client: Socket) {
    // console.log('Client disconnected', client.id);
    this.messagesWsService.removeClient(client.id)

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())

  }

  emitMessageFromServer(client: Socket, payload: NewMessageDto) {

    this.wss.emit('message-from-server', {fullName: client.id, message: payload.message})
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {

    this.emitMessageFromServer(client, payload);

  }

}

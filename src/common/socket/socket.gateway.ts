
import { HttpStatus, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { congesService } from 'src/conges/conges.service';
import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/users.service';
import { SocketUpdatetDto } from './dto/socketUpdate.dto';
import { SocketService } from './socket.service';

@WebSocketGateway(80,
  {
    cors: {
      origin: '*',
    },
  }
)
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly socketService: SocketService,
    private readonly congeService: congesService,
    private readonly mailService: MailService,
    private readonly userService: UsersService

  ) { }
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('SocketGateway');
  afterInit() {
    this.logger.log('Init');
  }
  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('emit-userId')
  async getUserId(client: any, payload: SocketUpdatetDto) {
    this.socketService.updateSocket(client.id, payload.userId);
  }
  @SubscribeMessage('validate-conge')
  async validateConge(client: Socket, payload: any) {
    // try {
    let conge = null
    const { validation, idConge, idUser } = payload;
    const user = await this.userService.getUserById(idUser)
    if (user.roles.includes('rh') || user.roles.includes('admin')) {
      conge = await this.congeService.finalValidationConge(idConge, validation);
    } else {
      conge = await this.congeService.confirmConge(idConge)
    }
    if (conge) {
      // const test = await this.mailService.sendMailConfirmation(conge, user)
      const userValidatedConge = await this.userService.getUserById(conge.user._id)
      const socket = await this.socketService.getSocketById(conge.user._id)
      this.server.to(socket.socketId).emit("conge-confirmed", { pay: userValidatedConge.pay })
      return { statusCode: HttpStatus.OK, conge: conge }
    }
    return { statusCode: HttpStatus.BAD_REQUEST, message: "errors" }
    // } catch (err) {
    //   return { statusCode: HttpStatus.BAD_REQUEST }
    // }
  }
}
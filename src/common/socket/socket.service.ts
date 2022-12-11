import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { Socket } from './interface/socket.interface';
import { SOCKET_PROVIDER } from '../Config/config';
@Injectable()
export class SocketService {
  constructor(
    @Inject(SOCKET_PROVIDER) private readonly socketModel: Model<Socket>,
  ) { }
  async updateSocket(socketId: string, userId: string) {
    return await this.socketModel.findOneAndUpdate(
      { $and: [{ userId: userId }] },
      { $set: { socketId: socketId } },
      { upsert: true },
    );
  }
  async getSocketById(userId: string): Promise<Socket> {
    const socket = await this.socketModel
      .findOne({ userId: userId })
      .select(`socketId`);
    return socket;
  }
}

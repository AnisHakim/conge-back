
import { IsNotEmpty, IsString } from 'class-validator';

export class SocketDto {
  @IsNotEmpty()
  @IsString()
  readonly SocketId: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class SocketUpdatetDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;
}

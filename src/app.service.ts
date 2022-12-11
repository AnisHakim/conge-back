import { Model, Types } from 'mongoose';
import { USER_PROVIDER, CONGE_PROVIDER } from 'src/common/Config/config';
import { Inject, Injectable } from '@nestjs/common';
import { User } from './users/interface/user.interface';
import { CongeDocument } from './conges/interface/conges.interface';
@Injectable()
export class AppService {
  constructor(
    @Inject(USER_PROVIDER) private readonly userModel: Model<User>,
    @Inject(CONGE_PROVIDER) private readonly congeModel: Model<CongeDocument>
  ) { }
  getHello(): string {
    return 'Hello World!';
  }
}

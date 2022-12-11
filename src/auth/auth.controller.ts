import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RefreshGuard } from 'src/common/guards/refresh-auth.guard';
import { FindEmail, UserDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  @Post('login')
  async login(@Body() body: UserDto, @Res() res) {
    try {
      console.log('====================================');
      console.log(body);
      console.log('====================================');
      const { email, password } = body;
      const tokens = await this.authService.login(email, password);
      const user = await this.authService.getUser(email);
      if (tokens) {
        return res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: user,
        });
      }
      return res.status(HttpStatus.UNAUTHORIZED).send({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'unothorized',
      });
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err,
        message: 'something went wrong',
      });
    }
  }
  @Get('refresh')
  @UseGuards(RefreshGuard)
  async refreshToken(@Req() req, @Res() res) {
    try {
      const tokens = await this.authService.generateToken(req.user);
      if (tokens) {
        return res.status(HttpStatus.OK).send({
          statusCode: HttpStatus.OK,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      }
      return res.status(HttpStatus.UNAUTHORIZED).send({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'unothorized',
      });
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err,
        message: 'something went wrong',
      });
    }
  }
  @Get('get/:email')
  async getUser(@Param() param: FindEmail, @Res() res) {
    try {
      const { email } = param;
      const user = await this.authService.getUser(email);
      if (user)
        return res
          .status(HttpStatus.OK)
          .json({ status: HttpStatus.OK, user: user });
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: HttpStatus.BAD_REQUEST, message: 'not found' });
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err,
        message: 'something went wrong',
      });
    }
  }
}

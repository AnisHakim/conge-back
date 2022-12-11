import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JoursFeriesService } from './joursFeries.service';
import { Role } from 'src/role/role.enum';
import { Roles } from 'src/role/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('joursFeries')
export class JoursFeriesController {
  constructor(private jourFerieService: JoursFeriesService) { }
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.rh, Role.admin)
  @Post('addJourFerie')
  async addNewJourFerie(@Res() res, @Body() body) {
    try {
      const { dates, description } = body;
      const jourFerie = await this.jourFerieService.addJourFerie(
        dates,
        description,
      );
      if (jourFerie) {
        return res
          .status(HttpStatus.OK)
          .json({ status: HttpStatus.OK, jourFerie: jourFerie });
      } else
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          message: 'error add jour ferie',
        });
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err,
        message: 'something went wrong',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllJoursFeries(@Res() res) {
    try {
      const JoursFeries = await this.jourFerieService.getJoursFeries();
      if (JoursFeries) {
        res
          .status(HttpStatus.OK)
          .json({ status: HttpStatus.OK, JoursFeries: JoursFeries });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          message: 'error get jours feries',
        });
      }
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err,
        message: 'something went wrong',
      });
    }
  }
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.rh, Role.admin)
  @Delete('deleteJourFerie/:id')
  async removeJourFerie(@Res() res, @Param() param) {
    const { id } = param;
    try {
      const resonse = await this.jourFerieService.deleteJourFerie(id);
      if (resonse) {
        res
          .status(HttpStatus.OK)
          .json({ status: HttpStatus.OK, resonse: resonse });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          message: 'error get jours feries',
        });
      }
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err,
        message: 'something went wrong',
      });
    }
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.rh, Role.admin)
  @Put('updateJourferie')
  async modifyJourFerie(@Res() res, @Body() body) {
    try {
      const { id, dates, description } = body;
      const jourFerie = await this.jourFerieService.updateJourFerie(
        id,
        dates,
        description,
      );
      if (jourFerie) {
        return res
          .status(HttpStatus.OK)
          .json({ status: HttpStatus.OK, jourFerie: jourFerie });
      } else
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          message: 'error update jour ferie',
        });
    } catch (err) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: err,
        message: 'something went wrong',
      });
    }
  }
}

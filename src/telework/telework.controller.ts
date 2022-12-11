import { TeleworkDto } from './dto/telework.dto';
import { Body, Controller, Get, HttpStatus, InternalServerErrorException, Param, ParseIntPipe, Post, Put, Req, Res, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { TeleworkService } from './telework.service';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateTeleworkDto } from './dto/updatetelework.dto';
import { QueryTeleworkDto } from './dto/querytelework.dto';

@Controller('telework')
export class TeleworkController {

    constructor(private teleworkService: TeleworkService) { }
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async register(@Body() body: TeleworkDto, @Res() res, @Req() req) {
        try {
            const telework = await this.teleworkService.createTelework(body, req.user._id);
            if (telework)
                return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, telework: telework })
            return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: HttpStatus.BAD_REQUEST, message: 'error create telework' });
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: err,
                message: 'something went wrong',
            });
        }
    }
    @UseGuards(JwtAuthGuard)
    @Get('all')
    async getAllTelework(@Res() res, @Query() queryFilter: QueryTeleworkDto) {
        try {
            const response = await this.teleworkService.getAllTelework(queryFilter)
            if (response)
                return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, teleworks: response.teleworks, pages: response.pages })
            return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: HttpStatus.BAD_REQUEST, message: ' error get all telework' });
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: err,
                message: 'something went wrong',
            });
        }
    }
    @UseGuards(RolesGuard)
    @Roles(Role.admin, Role.rh)
    @UseGuards(JwtAuthGuard)
    @Put('update/:id')
    async updateTelework(@Res() res, @Param('id') id: string, @Body() body: UpdateTeleworkDto) {
        try {
            const telework = await this.teleworkService.updateTelework(body, id);
            if (telework)
                return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, telework: telework })
            return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: HttpStatus.BAD_REQUEST, message: 'error update telework' });
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: err,
                message: 'something went wrong',
            });
        }
    }
}

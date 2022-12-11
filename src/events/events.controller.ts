import { EventDto } from './dto/events.dto';
import { Body, Controller, HttpStatus, InternalServerErrorException, Post, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/role/role.enum';
import { Roles } from 'src/role/roles.decorator';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {

    constructor(
        private eventService: EventsService,
    ) { }

    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(Role.rh, Role.admin)
    @Post("addUserSold")
    async addNewConge(@Res() res, @Body() body: EventDto) {
        try {
            const { description, sold, userId } = body;
            const event = await this.eventService.addUserSold(description, sold, userId)
            if (event) {
                return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, event: event });
            }
            return res.status(HttpStatus.BAD_REQUEST
            ).json({ statusCode: HttpStatus.BAD_REQUEST, message: "error update user sold" });
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: err,
                message: 'something went wrong',
            });
        }
    }

}

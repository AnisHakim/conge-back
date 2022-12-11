import { Body, Controller, Get, HttpStatus, InternalServerErrorException, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { MailService } from 'src/mail/mail.service';
import { ProjectsService } from 'src/projects/projects.service';
import { Role } from 'src/role/role.enum';
import { Roles } from 'src/role/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { congesService } from './conges.service';
import { CongeDto } from './dto/conges.dto';
import { QueryConges } from './dto/queryConges.dto';

@Controller('conges')
export class congesController {

    constructor(
        private congeService: congesService,
        private projectService: ProjectsService,
        private mailService: MailService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post("addconge")
    async addNewConge(@Res() res, @Req() req, @Body() body: CongeDto) {
        // try {
        const { dates, paid, authorization, startAutorization, durationAutorization, half_day, morning, department, project, description, reason, dateAutorization } = body;
        const conge = await this.congeService.addConge(
            dates,
            paid,
            authorization,
            startAutorization,
            durationAutorization,
            half_day,
            morning,
            department,
            project,
            description,
            reason,
            req.user.id,
            dateAutorization);
        if (conge) {
            const test = await this.mailService.sendMailLeave(project, authorization, conge, req.user)
            return res.status(HttpStatus.OK).json({ status: HttpStatus.OK, conge: conge });
        }
        else return res.status(HttpStatus.BAD_REQUEST
        ).json({ staTus: HttpStatus.BAD_REQUEST, message: "error add conge" });
        // } catch (err) {
        //     throw new InternalServerErrorException({
        //         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        //         errors: err,
        //         message: 'something went wrong',
        //     });
        // }
    }
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Get('listconges/:month/:year')
    async get(@Res() res, @Req() req, @Param('month') month: number, @Param('year') year: number) {
        try {
            const { user } = req
            const conges = await this.congeService.getConges(month, year, user._id);
            if (conges) {
                return res.status(HttpStatus.OK).json({ satatus: HttpStatus.OK, dates: conges });
            }
            return res.status(HttpStatus.BAD_REQUEST).json({ status: HttpStatus.BAD_REQUEST, message: "errors" })
        } catch (err) {
            throw new InternalServerErrorException({
                satusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: err,
                message: 'something went wrong',
            });
        }
    }
    @UseGuards(JwtAuthGuard)
    @Get("deleteconge/:id")
    async deleteConge(@Res() res, @Param('id') id: string) {
        try {
            const conge = await this.congeService.deleteConge(id);
            if (conge) {
                return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, conge: conge })
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: HttpStatus.BAD_REQUEST, message: "errors" })
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
    @Roles(Role.rh, Role.admin, Role.po, Role.scrum, Role.teckLead, Role.teamLead)
    @Put('refusedconge')
    async refusedConge(@Res() res, @Req() req, @Body('id') id: string) {
        try {
            const { user } = req
            let conge = null;
            if ((user.roles.includes('rh') || user.roles.includes('admin'))) {
                conge = await this.congeService.finalRefuseConge(id);
                this.congeService.finalRefuseConge(id);
            } else {
                conge = await this.congeService.refuseConge(id);
            }
            if (conge) {
                this.mailService.sendMailRefuseConge(conge, user)
                return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, conge: conge });
            }
            return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: HttpStatus.BAD_REQUEST, msg: "error" })
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
    @Roles(Role.rh, Role.admin, Role.cto, Role.groupLead, Role.teamLead, Role.teckLead)
    @Get('allconges')
    async getAllConges(
        @Req() req,
        @Res() res,
        @Query() queryFilter: QueryConges) {
        try {
            let response = null
            const { roles, _id } = req.user
            if (roles.includes('teamLead') || roles.includes('teckLead')) {
                const projects = await this.projectService.getProjectsByUserId(_id, roles);
                response = await this.congeService.getListCongeByProjects(projects, queryFilter);
            } else if (roles.includes('cto') || roles.includes('groupLead')) {
                response = await this.congeService.getCongesDevDepartment(queryFilter);
            } else {
                response = await this.congeService.getAllConges(queryFilter);
            }
            if (response) {
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK, conges: response.conges, pages: response.pages,
                });
            } else return res.status(HttpStatus.BAD_REQUEST
            ).json({ statusCode: HttpStatus.BAD_REQUEST, message: " error !" });
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: err,
                message: 'something went wrong',
            });
        }
    }
    @UseGuards(JwtAuthGuard)
    @Get('userconges')
    async getuserConges(@Req() req, @Res() res) {
        try {
            const conges = await this.congeService.getUserConges(req.user._id)
            if (conges) {
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK, conges: conges
                });
            } else return res.status(HttpStatus.BAD_REQUEST
            ).json({ statusCode: HttpStatus.BAD_REQUEST, message: " error !" });
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: err,
                message: 'something went wrong',
            });
        }
    }
    @UseGuards(JwtAuthGuard)
    @Get('remind/:id')
    async remindValidationConge(@Res() res, @Param('id') id: string) {
        try {
            const conge = await this.congeService.getConge(id)
            const mail = await this.mailService.reminderMail(conge)
            if (mail) {
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK, mail: mail
                });
            } else return res.status(HttpStatus.BAD_REQUEST
            ).json({ statusCode: HttpStatus.BAD_REQUEST, message: " error !" });
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: err,
                message: 'something went wrong',
            });
        }
    }
}

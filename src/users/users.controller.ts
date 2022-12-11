import { Body, Controller, Get, Post, Res, UseGuards, Req, HttpStatus, InternalServerErrorException, Param, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Role } from 'src/role/role.enum';
import { Roles } from 'src/role/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { QueryUserDto } from './dto/queryuser.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly users: UsersService) { }
    @UseGuards(RolesGuard)
    @Roles(Role.admin, Role.rh)
    @UseGuards(JwtAuthGuard)
    @Post('register')
    async register(@Body() body: UserDto, @Res() res) {
        try {
            const { name, email, password, roles, start, pay, isReportSold, isFullTime } = body;
            const user = await this.users.register(name, email, password, roles, start, pay, isReportSold, isFullTime);
            if (user)
                return res.status(HttpStatus.OK).json({ status: HttpStatus.OK })
            return res.status(HttpStatus.BAD_REQUEST).json({ status: HttpStatus.BAD_REQUEST, message: 'Error !!!!!!' });
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: err,
                message: 'something went wrong',
            });
        }
    }
    @Get('all')
    @UseGuards(RolesGuard)
    @Roles(Role.admin, Role.rh)
    @UseGuards(JwtAuthGuard)
    async all(@Res() res, @Query() queryFilter: QueryUserDto) {
        try {
            const response = await this.users.getAllUsers(queryFilter);
            if (response) {
                return res.status(HttpStatus.OK).json({
                    statusCode: 200,
                    users: response.users,
                    pages: response.pages,
                })
            }
            return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: HttpStatus.BAD_REQUEST, message: 'Error !!!!!!' });
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: err,
                message: 'something went wrong',
            });
        }
    }
    @Get('list/dev')
    @UseGuards(RolesGuard)
    @Roles(Role.admin, Role.rh)
    @UseGuards(JwtAuthGuard)
    async getUsersByRoles(@Res() res) {
        try {
            const users = await this.users.getUsersDev();
            if (users) {
                return res.status(HttpStatus.OK).json({ status: HttpStatus.OK, users: users })
            }
            return res.status(HttpStatus.BAD_REQUEST).json({ status: HttpStatus.BAD_REQUEST, message: 'Error !!!!!!' });
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: err,
                message: 'something went wrong',
            });
        }
    }
    @UseGuards(JwtAuthGuard)
    @UseGuards(RolesGuard)
    @Roles(Role.admin, Role.rh)
    @UseGuards(JwtAuthGuard)
    @Post("deleteUser")
    async deleteUser(@Res() res, @Body('id') id: string) {
        try {
            const user = await this.users.deleteUser(id);
            if (user) {
                return res.status(HttpStatus.OK).json({ status: HttpStatus.OK, user: user })
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json({ status: HttpStatus.BAD_REQUEST, message: "errors" })
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
    @Roles(Role.admin, Role.rh)
    @UseGuards(JwtAuthGuard)
    @Post('update')
    async updateUser(@Body() body: any, @Res() res, @Req() req) {
        try {
            const { name, email, roles, start, id, isReportSold, isFullTime, password } = body;
            const user = await this.users.updateUser(name, email, roles, start, id, isReportSold, isFullTime, password);
            if (user)
                return res.status(HttpStatus.OK).json({ status: HttpStatus.OK, user: user });
            return res.status(HttpStatus.BAD_REQUEST).json({ status: HttpStatus.BAD_REQUEST, message: "errors" })
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: err,
                message: 'something went wrong',
            });
        }
    }
    @UseGuards(RolesGuard)
    @Roles(Role.rh, Role.admin, Role.cto, Role.groupLead, Role.teamLead, Role.teckLead)
    @UseGuards(JwtAuthGuard)
    @Get('usersnames')
    async getusersname(@Res() res) {
        try {
            const users = await this.users.getUsersNames();
            if (users) {
                return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, users: users });
            }
            return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: HttpStatus.BAD_REQUEST, message: "errors" })
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: err,
                message: 'something went wrong',
            });
        }
    }
    @UseGuards(RolesGuard)
    @Roles(Role.rh, Role.admin)
    @UseGuards(JwtAuthGuard)
    @Get('leadersusers')
    async getLeadersUsers(@Res() res) {
        try {
            const response = await this.users.getLeaders();
            if (response) {
                return res.status(HttpStatus.OK).json({
                    statusCode: HttpStatus.OK, scrum: response.scrum,
                    po: response.po, teamLead: response.teamLead, teckLead: response.teckLead
                });
            }
            return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: HttpStatus.BAD_REQUEST, message: "errors" })
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: err,
                message: 'something went wrong',
            });
        }
    }
}

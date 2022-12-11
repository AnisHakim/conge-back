import { Body, Controller, Get, Param, Post, UseGuards, Res, HttpStatus, Req, InternalServerErrorException, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Role } from 'src/role/role.enum';
import { Roles } from 'src/role/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ProjectDTO } from './dto/project.dto';
import { ProjectsService } from './projects.service';
import { AddProjectDto } from 'src/users/dto/addProject.dto';
import { ProjectFilterDto } from './dto/projectfilter.dto';

@Controller('projects')
export class ProjectsController {
    constructor(
        private readonly projectService: ProjectsService) { }
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(Role.admin, Role.rh)
    @Get('list')
    async getAllProjects(@Res() res, @Query() queryFilter: ProjectFilterDto) {
        try {
            const response = await this.projectService.getAllProject(queryFilter);
            if (response) {
                return res.status(HttpStatus.OK).json({
                    statusCode: 200, projects: response.projects, pages: response.pages
                })
            }
            return res.status(HttpStatus.BAD_REQUEST
            ).json({ statusCode: HttpStatus.BAD_REQUEST, message: "Project not exist !" });
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
    @Roles(Role.admin, Role.rh)
    @Post('add')
    async addProject(@Body() body: ProjectDTO, @Res() res) {
        try {
            const { name, scrum, po, techLead, teamLead, startDate, endDate } = body;
            const projectExist = await this.projectService.getProjectByName(name)
            if (!projectExist) {
                const project = await this.projectService.addProject(name, scrum, po, techLead, teamLead, startDate, endDate);
                return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, project: project });
            } return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: HttpStatus.BAD_REQUEST, message: "Project  exist !" });
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
    @Roles(Role.admin, Role.rh)
    @Post('update')
    async updateproject(@Body() body: ProjectDTO, @Res() res) {
        const { id, po, scrum, teamLead, techLead, startDate, endDate } = body;
        const project = await this.projectService.updateProject(id, scrum, po, teamLead, techLead, startDate, endDate);
        if (project) {
            return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, project: project });
        }
        return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: HttpStatus.BAD_REQUEST, message: "error update project !" });
    }
    @UseGuards(RolesGuard)
    @UseGuards(JwtAuthGuard)
    @Roles(Role.admin, Role.rh)
    @Post('/adddevstoproject')
    async addDevs(@Res() res, @Req() req, @Body() body: AddProjectDto) {
        try {
            const { projectId, usersIds } = body
            const project = await this.projectService.addDevsToProject(projectId, usersIds)
            if (project)
                return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, project: project });
            else
                return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: HttpStatus.BAD_REQUEST, error: 'error add devs' })
        } catch (err) {
            throw new InternalServerErrorException({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errors: err,
                message: 'something went wrong',
            });
        }
    }
    @UseGuards(JwtAuthGuard)
    @Get('/userlistprojects')
    async getProjectsOfUser(@Res() res, @Req() req) {
        try {
            const listProjects = await this.projectService.getProjectsOfUser(req.user._id)
            if (listProjects) {
                return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, listProjects: listProjects });
            }
            return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: HttpStatus.BAD_REQUEST, message: 'list projects not found' });
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
    @Get('projectsnames')
    async getprojectsnames(@Res() res) {
        try {
            const projects = await this.projectService.getProjectsNames();
            if (projects) {
                return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, projects: projects });
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

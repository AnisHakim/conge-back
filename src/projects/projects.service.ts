import { Inject, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { PROJECT_PROVIDER } from 'src/common/Config/config';
import { ProjectFilterDto } from './dto/projectfilter.dto';
import { Project } from './interface/project.interface';
const $project = {
    name: 1,
    developersIds: 1,
    scrum: 1,
    po: 1,
    techLead: 1,
    teamLead: 1,
    startDate: 1,
    endDate: 1
}
@Injectable()
export class ProjectsService {

    constructor(
        @Inject(PROJECT_PROVIDER)
        private projectDocument: mongoose.Model<Project>,
    ) { }
    getQueryListUser(query: ProjectFilterDto) {
        const list = []
        const { projectName, scrum, po, teamLead, teckLead } = query
        if (projectName) list.push({ name: { $in: [new RegExp(projectName, 'i')] } })
        if (scrum) list.push({ scrum: new mongoose.Types.ObjectId(scrum) })
        if (po) list.push({ po: new mongoose.Types.ObjectId(po) })
        if (teamLead) list.push({ teamLead: new mongoose.Types.ObjectId(teamLead) })
        if (teckLead) list.push({ techLead: new mongoose.Types.ObjectId(teckLead) })
        return list
    }
    async congesAggregate($project, $and, skip) {
        const lookup = [{
            $lookup:
            {
                from: "users",
                localField: "po",
                foreignField: "_id",
                as: "po",
                pipeline: [{ $project: { name: 1, email: 1 } }]
            },
        },
        {
            $unwind: {
                path: "$po",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup:
            {
                from: "users",
                localField: "scrum",
                foreignField: "_id",
                as: "scrum",
                pipeline: [{ $project: { name: 1, email: 1 } }]
            },
        },
        {
            $unwind: {
                path: "$scrum",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup:
            {
                from: "users",
                localField: "teamLead",
                foreignField: "_id",
                as: "teamLead",
                pipeline: [{ $project: { name: 1, email: 1 } }]
            },
        },
        {
            $unwind: {
                path: "$teamLead",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup:
            {
                from: "users",
                localField: "techLead",
                foreignField: "_id",
                as: "techLead",
                pipeline: [{ $project: { name: 1, email: 1 } }]
            },
        },
        {
            $unwind: {
                path: "$techLead",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup:
            {
                from: "users",
                localField: "developersIds",
                foreignField: "_id",
                as: "developersIds",
                pipeline: [{ $project: { name: 1 } }]
            },
        },
        ]
        let aggregate = []
        if ($and.length) {
            aggregate = [
                {
                    $project: $project
                },
                {
                    $match: { $and }
                }, ...lookup
            ]
        } else {
            aggregate = [

                {
                    $project: $project
                }, ...lookup
            ]
        }
        if (skip !== null) {
            return await this.projectDocument
                .aggregate(aggregate).skip(skip).limit(5)
        }
        return await this.projectDocument
            .aggregate(aggregate)
    }
    async getAllProject(queryFilter: ProjectFilterDto) {
        let $and = this.getQueryListUser(queryFilter)
        let { pageIndex } = queryFilter
        const response = await this.congesAggregate($project, $and, null)
        const pages = Math.ceil(response.length / 5);
        const skip = (pageIndex - 1) * 5;
        let projects = await this.congesAggregate($project, $and, skip)
        return {
            projects,
            pages,
        }

    }
    async addProject(name: string, scrum: string, po: string, techlead: string, teamlead: string, startDate: Date, endDate: Date) {
        const project = await new this.projectDocument({
            name: name,
            scrum: scrum, po: po, techLead: techlead,
            teamLead: teamlead, startDate: startDate, endDate: endDate
        });
        const res = await project.save();
        return res;
    }
    async getProject(id: string) {
        const project = await this.projectDocument.findById(id);
        return project;
    }
    async getProjectByName(name: string) {
        const project = await this.projectDocument.findOne({ name: name });
        return project
    }
    async updateProject(id, scrum, po, teamlead, techlead, startDate, endDate) {
        const updateproject = await this.projectDocument.findByIdAndUpdate(id,
            { po: po, scrum: scrum, teamLead: teamlead, techLead: techlead, startDate: startDate, endDate: endDate });
        return updateproject;
    }
    async getProjectsByUserId(id: string, roles: []) {
        let projects = []
        let data = []
        for (let index = 0; index < roles.length; index++) {
            data = await this.projectDocument.find({ [roles[index]]: id }).select(['_id']).exec();
            projects = [...projects, ...data]
        }
        return projects.map(el => el._id);
    }

    async getProjectById(id: string) {
        const project = await this.projectDocument.findById(id);
        return project;
    }
    async addDevsToProject(id: string, idUsers: []) {
        const project = await this.projectDocument.findByIdAndUpdate({ _id: id }, { developersIds: idUsers })
        return project;
    }
    async getProjectsOfUser(idUser: string) {
        return await this.projectDocument.find({ developersIds: idUser }).select('name')
    }
    async getProjectsNames() {
        return await this.projectDocument.find().select('name')
    }
}

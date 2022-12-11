import { Inject, Injectable, Query } from '@nestjs/common';
import { CongeDocument } from './interface/conges.interface';
import * as mongoose from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CONGE_PROVIDER } from 'src/common/Config/config';
import { QueryConges } from './dto/queryConges.dto';


const $project = {
    firstDate: { $first: "$dates" },
    lastDate: { $last: "$dates" },
    authorization: 1,
    status: 1,
    paid: 1,
    morning: 1,
    department: 1,
    description: 1,
    user: 1,
    project: 1,
    isRefused: 1,
    isAccepted: 1,
    dates: 1,
    reason: 1,
    startAutorization: 1,
    durationAutorization: 1
}
@Injectable()
export class congesService {
    constructor(
        @Inject(CONGE_PROVIDER)
        private congeDocument: mongoose.Model<CongeDocument>,
        private userService: UsersService,
    ) { }
    async addConge(
        dates: Date[],
        paid: boolean,
        authorization: boolean,
        startAutorization: string,
        durationAutorization: number,
        half_day: boolean,
        morning: boolean,
        department: string,
        project: string,
        description: string,
        reason: string,
        userId: string,
        dateAutorization: Date
    ) {
        const congeToSave = {
            dates: dates,
            paid: paid,
            authorization: authorization,
            half_day: half_day,
            morning: morning,
            department: department,
            description: description,
            user: userId,
            disabled: false,
        };
        if (project) {
            congeToSave['project'] = project;
        }
        if (authorization) {
            congeToSave['startAutorization'] = startAutorization;
            congeToSave['durationAutorization'] = durationAutorization;
            congeToSave['dateAutorization'] = dateAutorization;
        }
        if (reason) {
            congeToSave['reason'] = reason;
        }
        const conge = await new this.congeDocument(congeToSave);
        const result = await conge.save();
        return result;
    }
    async getUser(id: string) {
        const conge = await this.congeDocument
            .findById(id)
            .populate({ path: 'users', select: ['roles'] });
        return conge;
    }
    async finalValidationConge(id: string, validation: boolean) {
        const conge = await this.congeDocument.findOneAndUpdate(
            { _id: id },
            { isAccepted: validation },
        );
        let descreaseConge = 0;
        if (conge.half_day) {
            descreaseConge = -0.5;
        } else if (!conge.authorization && conge.paid) {
            descreaseConge = -conge.dates.length;
        }
        await this.userService.updateSoldUser(conge.user, descreaseConge)
        return conge;
    }
    async getConges(month: number, year: number, userId: string) {
        const conges = await this.congeDocument.aggregate([{ $match: { user: userId } }]);
        const list = [];
        for (let index = 0; index < conges.length; index++) {
            const elements = conges[index].dates;
            elements.forEach((element) => {
                const date = new Date(element);
                if ((
                    (date.getMonth() == month) ||
                    (date.getMonth() == Number(month) + 1) ||
                    (date.getMonth() == Number(month) - 1))
                    && date.getFullYear() == year) {
                    list.push(conges[index]);
                }
            });
        }
        const data = list.filter(el => el.user._id.toString() === userId.toString())
        return data;
    }

    async deleteConge(id: string) {
        let conge = await this.congeDocument.findById({ _id: new mongoose.Types.ObjectId(id) })
        if (conge['isAccepted'] && !conge['authorization'] && !conge['half_day']) {
            await this.userService.updateSoldUser(conge.user, conge.dates.length)
        } else if (conge['half_day'] && conge['isAccepted']) {
            await this.userService.updateSoldUser(conge.user, 0.5)
        }
        return await this.congeDocument.deleteOne({ _id: id });
    }
    async finalRefuseConge(id: string) {
        const conge = await this.congeDocument.findByIdAndUpdate(
            { _id: id },
            { isRefused: true },
        );
        return conge;
    }
    async refuseConge(id: string) {
        const conge = await this.congeDocument.findByIdAndUpdate(
            { _id: id },
            { status: 'refused' },
        );
        return conge;
    }
    async confirmConge(id: string) {
        const conge = await this.congeDocument.findByIdAndUpdate(
            { _id: id },
            { status: 'accepted' },
        );
        return conge;
    }
    async getConge(id: string) {
        return await this.congeDocument.findById(id)
            .populate({ path: 'user', select: ['name', 'roles', 'email'] })
            .populate({ path: 'project' });
    }
    calculAutorization(autorizations: number) {
        let totalSoldeToRemove = 0;
        const integerPart = Math.trunc((autorizations) / 8)
        const decimalPart = autorizations / 8 - integerPart
        if ((autorizations) > 2) {
            if (decimalPart <= 0.5 && decimalPart > 0)
                totalSoldeToRemove += 0.5
            else if (decimalPart > 0.5)
                totalSoldeToRemove += 1
            totalSoldeToRemove += integerPart
        }
        return totalSoldeToRemove
    }
    async updateUserSold(obj) {
        return await this.userService.updateSoldUser(obj._id, -this.calculAutorization(obj.total))
    }
    async usersAutorisation() {
        const users = await this.userService.getUsers()
        const conge = await Promise.all(users.map(el => this.calclateConge(el))).then((res) => res.filter(el => el.length))
        for (let index = 0; index < conge.length; index++) {
            this.updateUserSold(conge[index][0]);
        }
        return conge
    }

    async calclateConge(user, date = new Date()) {
        const usersAutorizations = await this.congeDocument.aggregate([
            {
                $project: {
                    month: {
                        $month: "$dateAutorization",
                    },
                    year: { $year: "$dateAutorization" },
                    user: 1,
                    start: 1,
                    end: 1
                }
            },
            {
                $match: {
                    user: user._id,
                    month: date.getMonth() + 1,
                    year: date.getFullYear()
                }
            },
            {
                $group: {
                    _id: "$user",
                    total: {
                        $sum: "$end"
                    }
                }
            }
        ])
        return usersAutorizations
    }
    getQueryListConge(query: QueryConges) {
        const list = []
        const { user, project, status, authorization,
            half_day, paid, isAccepted, startDate, endDate } = query
        if (user) list.push({ user: new mongoose.Types.ObjectId(user) })
        if (project) list.push({ project: new mongoose.Types.ObjectId(project) })
        if (status) list.push({ status: status })
        if (authorization) list.push({ authorization: authorization.toString() === "true" ? true : false })
        if (half_day) list.push({ half_day: half_day.toString() === "true" ? true : false })
        if (isAccepted) list.push({ isAccepted: isAccepted.toString() === "true" ? true : false })
        if (paid) list.push({ paid: paid.toString() === "true" ? true : false })
        if (startDate) list.push({
            firstDate: {
                $gte: new Date((new Date(startDate)).valueOf() - 1000 * 60 * 60 * 24)
            }
        })
        if (endDate) list.push({
            lastDate: {
                $lte: new Date((new Date(endDate)).valueOf() + 1000 * 60 * 60 * 24)
            }
        })
        list.push({ isRefused: false })
        return list
    }

    async congesAggregate($project, $and, skip) {
        const aggregate = [
            {
                $project: $project
            },
            {
                $match: { $and }
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [{ $project: { name: 1, pay: 1, roles: 1 } }]
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup:
                {
                    from: "projects",
                    localField: "project",
                    foreignField: "_id",
                    as: "project",
                    pipeline: [{ $project: { name: 1 } }]
                },
            },
            {
                $unwind: {
                    path: "$project",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]
        if (skip !== null) {
            return await this.congeDocument
                .aggregate(aggregate).skip(skip).limit(5)
        }
        return await this.congeDocument
            .aggregate(aggregate)
    }
    async getListCongeByProjects(list: any, queryFilter: QueryConges) {
        let $and = this.getQueryListConge(queryFilter)
        let { pageIndex } = queryFilter
        if (queryFilter['project']) {
            $and.push({ project: { $in: [...list, new mongoose.Types.ObjectId(queryFilter['project'])] } })
        } else {
            $and.push({ project: { $in: [...list] } })
        }
        return this.congesFilered(pageIndex, $and)
    }
    async getAllConges(queryFilter: QueryConges) {
        let $and = this.getQueryListConge(queryFilter)
        let { pageIndex } = queryFilter
        return this.congesFilered(pageIndex, $and)
    }
    async getCongesDevDepartment(queryFilter: QueryConges) {
        let $and = this.getQueryListConge(queryFilter)
        let { pageIndex } = queryFilter
        $and.push({ department: 'Développement' })
        return this.congesFilered(pageIndex, $and)
    }
    async congesFilered(pageIndex: number, $and: Object) {
        const response = await this.congesAggregate($project, $and, null)
        const pages = Math.ceil(response.length / 5);
        const skip = (pageIndex - 1) * 5;
        let conges = await this.congesAggregate($project, $and, skip)
        return {
            conges,
            pages,
        }
    }
    async getUserConges(userId: string) {
        const $and = [{ firstDate: { $gte: new Date((new Date()).valueOf() - 1000 * 60 * 60 * 24) } }, { user: new mongoose.Types.ObjectId(userId) }, { isRefused: false }]
        return await this.congeDocument.aggregate([
            { $project: $project },
            {
                $match: { $and }
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [{ $project: { name: 1, pay: 1, roles: 1 } }]
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup:
                {
                    from: "projects",
                    localField: "project",
                    foreignField: "_id",
                    as: "project",
                    pipeline: [{ $project: { name: 1 } }]
                },
            },
            {
                $unwind: {
                    path: "$project",
                    preserveNullAndEmptyArrays: true
                }
            }
        ])
    }
}


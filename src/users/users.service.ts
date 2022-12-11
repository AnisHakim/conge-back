
import * as mongoose from 'mongoose';
import { User } from './interface/user.interface';
import * as bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import { USER_PROVIDER } from 'src/common/Config/config';
import { Role } from 'src/role/role.enum';
import { QueryUserDto } from './dto/queryuser.dto';

const $project = {
    name: 1,
    email: 1,
    roles: 1,
    start: 1,
    pay: 1,
}
@Injectable()
export class UsersService {
    constructor(
        @Inject(USER_PROVIDER)
        private readonly userDocument: mongoose.Model<User>,
    ) { }
    async register(name: string, email: string, password: string, roles: Role[], start: string, pay: number, isReportSold: boolean, isFullTime: boolean) {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);
        const user = await new this.userDocument(
            {
                name: name, email: email, password: hash,
                roles: roles, start: start, pay: pay, isReportSold: isReportSold, isFullTime: isFullTime
            });
        const res = await user.save();
        return res;
    }
    getQueryListUser(query: QueryUserDto) {
        const list = []
        const { username, email } = query
        if (username) list.push({ name: { $in: [new RegExp(username, 'i')] } })
        if (email) list.push({ email: { $in: [new RegExp(email, 'i')] } })
        return list
    }
    async usersAggregate($project, $and, skip) {
        let aggregate = []
        if ($and.length) {
            aggregate = [
                {
                    $project: $project
                },
                {
                    $match: { $and }
                },
            ]
        } else {
            aggregate = [
                {
                    $project: $project
                }
            ]
        }
        if (skip !== null) {
            return await this.userDocument
                .aggregate(aggregate).skip(skip).limit(5)
        }
        return await this.userDocument
            .aggregate(aggregate)
    }
    async getAllUsers(queryFilter: QueryUserDto) {
        let $and = this.getQueryListUser(queryFilter)
        let { pageIndex } = queryFilter
        const response = await this.usersAggregate($project, $and, null)
        const pages = Math.ceil(response.length / 5);
        const skip = (pageIndex - 1) * 5;
        let users = await this.usersAggregate($project, $and, skip)
        return {
            users,
            pages,
        }
    }
    async getUsersDev() {
        const users = await this.userDocument.find({
            roles: {
                $in: ["dev"]
            },
        }).exec();
        return users;
    }
    async getUserByEmail(email: string) {
        return await this.userDocument.findOne({ email: email });
    }

    async getUserById(id: string) {
        return await this.userDocument.findById(id);
    }

    async deleteUser(id: string) {
        return await this.userDocument.deleteOne({ _id: id });
    }

    async updateUser(name, email, roles, start, id, isReportSold, isFullTime, password) {
        let objUpdate = { name: name, email: email, roles: roles, start: start, isReportSold: isReportSold, isFullTime: isFullTime }
        if (password) {
            const saltOrRounds = 10;
            const hash = await bcrypt.hash(password, saltOrRounds);
            objUpdate = { ...objUpdate, ...{ password: hash } }
        }
        return await this.userDocument.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(id) },
            objUpdate);
    }

    async getAllRH() {
        return this.userDocument.find({ roles: { $in: ['rh', 'admin'] } }).select(['email']);
    }
    async getOtherRh(user) {
        return this.userDocument.find(
            { $and: [{ roles: { $in: ['rh', 'admin', 'cto', 'groupLead'] } }, { _id: { $ne: new mongoose.Types.ObjectId(user._id) } }] }).select(['email']);
    }

    async getUserEmailById(id: string) {
        return await this.userDocument.findById({ _id: new mongoose.Types.ObjectId(id) }).select(['email']);
    }
    async updateSoldUser(idUser: string, sold: number) {
        return await this.userDocument.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(idUser) }, { $inc: { pay: sold } })
    }
    async getUsers() {
        return await this.userDocument.find().select(["_id"])
    }
    async getCtoAndGroupLead() {
        return await this.userDocument.find({
            roles: {
                $in: ["cto", "groupLead"]
            },
        }).select(['email']);
    }
    async getUsersNames() {
        return await this.userDocument.find().select(['name'])
    }
    async getLeaders() {
        const scrum = await this.userDocument.find({ roles: { $in: ['scrum'] } }).select(['name', 'roles'])
        const po = await this.userDocument.find({ roles: { $in: ['po'] } }).select(['name', 'roles'])
        const teamLead = await this.userDocument.find({ roles: { $in: ['teamLead'] } }).select(['name', 'roles'])
        const teckLead = await this.userDocument.find({ roles: { $in: ['teckLead'] } }).select(['name', 'roles'])
        return {
            scrum, po, teamLead, teckLead
        }
    }

}

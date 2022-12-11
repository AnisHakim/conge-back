import { TeleworkDto } from './dto/telework.dto';
import { Inject, Injectable } from '@nestjs/common';
import { TELEWORK_PROVIDER } from 'src/common/Config/config';
import * as mongoose from 'mongoose';
import { Telework } from './interface/telework.interface';
import { UpdateTeleworkDto } from './dto/updatetelework.dto';
import { QueryTeleworkDto } from './dto/querytelework.dto';

const $project = {
    firstDate: { $first: "$dates" },
    lastDate: { $last: "$dates" },
    user: 1,
    dates: 1,
    status: 1,
    reason: 1
}
@Injectable()
export class TeleworkService {
    constructor(
        @Inject(TELEWORK_PROVIDER)
        private teleworkDocument: mongoose.Model<Telework>,
    ) { }
    async createTelework(body: TeleworkDto, userId: string) {
        const { dates, reason } = body;
        const telework = new this.teleworkDocument({ dates: dates, user: userId, reason: reason })
        return await telework.save()
    }
    getQueryListTelework(query: QueryTeleworkDto) {
        const list = []
        const { startDate, endDate, user, status } = query
        if (user) list.push({ user: new mongoose.Types.ObjectId(user) })
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
        if (status) list.push({
            status: status
        })
        return list
    }
    async teleworkAggregate($project, $and, skip) {
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
                    pipeline: [{ $project: { name: 1 } }]
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]
        if (skip !== null) {
            return await this.teleworkDocument
                .aggregate(aggregate).skip(skip).limit(5)
        }
        return await this.teleworkDocument
            .aggregate(aggregate)
    }
    async getAllTelework(queryFilter: QueryTeleworkDto) {
        let $and = this.getQueryListTelework(queryFilter)
        let { pageIndex } = queryFilter
        const response = await this.teleworkAggregate($project, $and, null)
        const pages = Math.ceil(response.length / 5);
        const skip = (pageIndex - 1) * 5;
        let teleworks = await this.teleworkAggregate($project, $and, skip)
        return {
            teleworks,
            pages,
        }
    }
    async updateTelework(body: UpdateTeleworkDto, id: string) {
        return await this.teleworkDocument.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { status: body.status })
    }
}

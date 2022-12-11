import { Injectable } from '@nestjs/common';
import * as nodeMailer from "nodemailer"
import { mail } from 'src/common/Config/config';
import { Project } from 'src/projects/schema/project.schema';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import handlebars = require("handlebars")
const fs = require("fs")
const path = require("path")

const emailTemplateSource = fs.readFileSync(path.join(__dirname, "./templates/confirmation.hbs"), "utf8")
const emailConfirmationSource = fs.readFileSync(path.join(__dirname, "./templates/confirmConge.hbs"), "utf8")
const emailRefuseSource = fs.readFileSync(path.join(__dirname, "./templates/refuseConge.hbs"), "utf8")
const template = handlebars.compile(emailTemplateSource)
const confirmTemplate = handlebars.compile(emailConfirmationSource)
const refuseTemplate = handlebars.compile(emailRefuseSource)

@Injectable()
export class MailService {
    constructor(private readonly users: UsersService, private readonly projects: ProjectsService) { }
    transporter = nodeMailer.createTransport({
        service: 'Gmail',
        auth: {
            user: mail.user,
            pass: mail.pass
        }
    })



    async getRH() {
        var rhEmail = []
        var allRH = await this.users.getAllRH();
        allRH.forEach(element => {
            rhEmail.push(element.email)
        });
        return rhEmail
    }
    async getOtherRH(validator) {
        var rhEmail = []
        var allRH = await this.users.getOtherRh(validator);
        allRH.forEach(element => {
            rhEmail.push(element.email)
        });
        return rhEmail
    }


    async getLeaders(projectID) {
        var leaders = []
        var leadersEmails = []
        var project = await this.projects.getProjectById(projectID)
        if (project !== null) {
            leaders.push(await this.getLeadersEmails(project.teamLead), await this.getLeadersEmails(project.techLead))
            leaders.filter(el => el !== null).forEach(element => leadersEmails.push(element.email))
        }
        return leadersEmails
    }

    async getLeadersEmails(userID) {
        return await this.users.getUserEmailById(userID)
    }

    convert(data) {
        let date = new Date(data),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    convertDates(dates) {
        return dates.map(el => this.convert(el))

    }
    async getCtoAndGroupLead() {
        return await this.users.getCtoAndGroupLead();
    }
    async sendMailLeave(projectId, authorization, conge, user) {
        let rh = await this.getRH()
        let leaders = []
        let ctoAndGroupLead = null
        if (projectId)
            leaders = await this.getLeaders(projectId)
        if (conge.department === 'Développement') {
            ctoAndGroupLead = await this.getCtoAndGroupLead()
            leaders.push([...ctoAndGroupLead])
        }
        const htmlToSend = template({
            message: "Hello World!", name: user.name, role: user.roles,
            dates: this.convertDates(conge.dates), department: conge.department,
            description: conge.description, half_day: conge.half_day ? "Demi journée" : null,
            morning: conge.half_day ? conge.morning ? "Matin" : "Aprés-midi" : null,
            authorization: authorization
        })
        return this.transporter.sendMail({
            subject: authorization ? "Demande d'autorisation" : "Demande de congé",
            to: rh,
            cc: authorization ? null : leaders,
            from: mail.user,
            html: htmlToSend

        })
    }
    async sendMailConfirmation(conge, validator) {
        let rh = await this.getOtherRH(validator)
        if (validator.roles.includes('rh') || validator.roles.includes('admin')) {
            const dev = await this.users.getUserEmailById(conge.user)
            rh.push(dev['email'])
        }
        let leaders = []
        if (conge['project']) {
            leaders = await this.getLeaders(conge.project._id)
        }
        const user = await this.users.getUserById(conge.user)
        const htmlToSend = confirmTemplate({
            name: validator.name, roles: conge.user.roles,
            dates: this.convertDates(conge.dates), department: conge.department,
            description: conge.description, half_day: conge.half_day ? "Demi journée" : null,
            morning: conge.half_day ? conge.morning ? "Matin" : "Aprés-midi" : null,
            congeUserName: user.name, authorization: conge.authorization
        })
        return this.transporter.sendMail({
            subject: conge.authorization ? "Validation d'autorisation" : "Validation de congé",
            to: rh,
            cc: conge.authorization ? null : leaders,
            from: mail.user,
            html: htmlToSend

        })
    }

    async sendMailRefuseConge(conge, validator) {
        let rh = await this.getOtherRH(validator)
        if (validator.roles.includes('rh') || validator.roles.includes('admin')) {
            const dev = await this.users.getUserEmailById(conge.user)
            rh.push(dev['email'])
        }
        let leaders = []
        if (conge['project']) {
            leaders = await this.getLeaders(conge.project._id)
        }
        const user = await this.users.getUserById(conge.user)
        const htmlToSend = refuseTemplate({
            name: validator.name, roles: conge.user.roles,
            dates: this.convertDates(conge.dates), department: conge.department,
            description: conge.description, half_day: conge.half_day ? "Demi journée" : null,
            morning: conge.half_day ? conge.morning ? "Matin" : "Aprés-midi" : null,
            congeUserName: user.name, authorization: conge.authorization
        })
        return this.transporter.sendMail({
            subject: conge.authorization ? "Refus d'autorisation" : "Refus de congé",
            to: rh,
            cc: conge.authorization ? null : leaders,
            from: mail.user,
            html: htmlToSend

        })
    }
    async reminderMail(conge) {
        let rh = await this.getRH()
        const htmlToSend = template({
            message: "Hello World!", name: conge.user.name, role: conge.user.roles,
            dates: this.convertDates(conge.dates), department: conge.department,
            description: conge.description, half_day: conge.half_day ? "Demi journée" : null,
            morning: conge.half_day ? conge.morning ? "Matin" : "Aprés-midi" : null,
            authorization: conge.authorization
        })
        return this.transporter.sendMail({
            subject: conge.authorization ? "[Rappel]: Demande d'autorisation" : "[Rappel]: Demande de congé",
            to: rh,
            from: mail.user,
            html: htmlToSend

        })
    }
}
import { Inject, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { JOURS_FERIES_PROVIDER } from 'src/common/Config/config';
import { JoursFeriesDocument } from './interface/joursFeries.interface';
import { Types } from 'mongoose';
@Injectable()
export class JoursFeriesService {
  constructor(
    @Inject(JOURS_FERIES_PROVIDER)
    private joursFeriesDocument: mongoose.Model<JoursFeriesDocument>,
  ) { }
  async addJourFerie(dates: Date[], description: string) {
    let jourFerie;
    const joursFeriesToSave = {
      dates: dates,
      description: description,
    };

    jourFerie = new this.joursFeriesDocument(joursFeriesToSave);
    await jourFerie.save();
    return jourFerie;
  }

  async updateJourFerie(id: string, dates: Date[], description: string) {
    const jour = { dates: dates, description: description };
    return await this.joursFeriesDocument.findByIdAndUpdate(id, jour, {
      new: true,
    });
  }

  async getJoursFeries() {
    const jourFeries = await this.joursFeriesDocument.find();
    return jourFeries;
  }

  async deleteJourFerie(id: string) {
    const jourFerierRemoved = await this.joursFeriesDocument.findByIdAndDelete(
      id,
    );
    return jourFerierRemoved;
  }
}

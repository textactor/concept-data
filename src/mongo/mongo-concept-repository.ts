import { MongoRepository } from "./mongo-repository";
import {
  Concept,
  ConceptRepository,
  PopularConceptsOptions
} from "@textactor/concept-domain";
import { MongoWhereParams } from "mongo-item";

export class MongoConceptRepository
  extends MongoRepository<Concept>
  implements ConceptRepository
{
  getByRootNameId(id: string) {
    return this.model.find({
      where: { rootNameIds: id },
      limit: 500
    });
  }

  getByRootNameIds(ids: string[]) {
    return this.model.find({
      where: {
        rootNameIds: { $in: ids }
      },
      limit: 500
    });
  }
  getConceptsWithAbbr(containerId: string) {
    return this.model.find({
      where: {
        containerId,
        abbr: { $exists: true },
        limit: 500
      }
    });
  }
  getMostPopular(
    containerId: string,
    limit: number,
    skip: number,
    options?: PopularConceptsOptions
  ) {
    options = options || {};

    const where: MongoWhereParams = { containerId };
    if (options.minCountWords) {
      where.countWords = where.countWords || {};
      where.countWords.$gte = options.minCountWords;
    }
    if (options.maxCountWords) {
      where.countWords = where.countWords || {};
      where.countWords.$lte = options.maxCountWords;
    }

    return this.model.find({
      where,
      limit,
      offset: skip,
      sort: ["-popularity", "createdAt"]
    });
  }
  deleteUnpopular(containerId: string, popularity: number) {
    return this.model.deleteMany({
      containerId,
      popularity: { $lt: popularity }
    });
  }
  deleteUnpopularAbbreviations(containerId: string, popularity: number) {
    return this.model.deleteMany({
      containerId,
      isAbbr: true,
      popularity: { $lt: popularity }
    });
  }
  deleteUnpopularOneWorlds(containerId: string, popularity: number) {
    return this.model.deleteMany({
      containerId,
      countWords: 1,
      isAbbr: false,
      popularity: { $lt: popularity }
    });
  }
  deleteAll(containerId: string) {
    return this.model.deleteMany({
      containerId
    });
  }
  deleteIds(ids: string[]) {
    return this.model.deleteMany({
      _id: { $in: ids }
    });
  }
  deleteByRootNameIds(ids: string[]) {
    return this.model.deleteMany({
      rootNameIds: { $in: ids }
    });
  }
}

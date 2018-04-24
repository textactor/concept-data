
import { IConceptRepository, Concept, Locale } from '@textactor/concept-domain';
import { MongoRepository } from './mongo/mongoRepository';

export class ConceptRepository extends MongoRepository<string, Concept> implements IConceptRepository {
    getByNameHash(hash: string): Promise<Concept[]> {
        return this.model.list({
            where: { nameHash: hash },
            limit: 500,
        });
    }
    getByRootNameId(id: string): Promise<Concept[]> {
        return this.model.list({
            where: {
                rootNameId: id
            },
            limit: 500,
        })
    }
    getByRootNameIds(ids: string[]): Promise<Concept[]> {
        return this.model.list({
            where: {
                rootNameId: { $in: ids }
            },
            limit: 500,
        });
    }
    list(locale: Locale, limit: number, skip?: number): Promise<Concept[]> {
        return this.model.list({
            where: {
                lang: locale.lang,
                country: locale.country,
            },
            limit,
            offset: skip || 0,
        });
    }
    getConceptsWithAbbr(locale: Locale): Promise<Concept[]> {
        return this.model.list({
            where: {
                lang: locale.lang,
                country: locale.country,
                abbr: { $exists: true },
                limit: 500,
            }
        });
    }
    getAbbrConceptsWithContextName(locale: Locale): Promise<Concept[]> {
        return this.model.list({
            where: {
                lang: locale.lang,
                country: locale.country,
                contextNames: { $exists: true, $not: { $size: 0 } },
                isAbbr: true,
                limit: 500,
            }
        });
    }
    count(locale: Locale): Promise<number> {
        return this.model.count({
            lang: locale.lang,
            count: locale.country,
        });
    }
    deleteUnpopular(locale: Locale, popularity: number): Promise<number> {
        return this.model.remove({
            where: {
                lang: locale.lang,
                country: locale.country,
                popularity: { $lt: popularity },
            }
        });
    }
    deleteUnpopularAbbreviations(locale: Locale, popularity: number): Promise<number> {
        return this.model.remove({
            where: {
                lang: locale.lang,
                country: locale.country,
                isAbbr: true,
                popularity: { $lt: popularity },
            }
        });
    }
    deleteUnpopularOneWorlds(locale: Locale, popularity: number): Promise<number> {
        return this.model.remove({
            where: {
                lang: locale.lang,
                country: locale.country,
                countWords: 1,
                popularity: { $lt: popularity },
            }
        });
    }
    deleteAll(locale: Locale): Promise<number> {
        return this.model.remove({
            where: {
                lang: locale.lang,
                country: locale.country,
            }
        });
    }
    deleteIds(ids: string[]): Promise<number> {
        return this.model.remove({
            where: {
                _id: { $in: ids }
            }
        });
    }
    deleteByNameHash(hashes: string[]): Promise<number> {
        return this.model.remove({
            where: {
                nameHash: { $in: hashes }
            }
        });
    }
    deleteByRootNameIds(ids: string[]): Promise<number> {
        return this.model.remove({
            where: {
                rootNameId: { $in: ids }
            }
        });
    }
    createOrUpdate(item: Concept): Promise<Concept> {
        return this.create(item).catch(error => {
            if (error.code && error.code === 11000) {
                return this.getById(item.id).then(dbItem => {
                    item.popularity = dbItem.popularity + 1;
                    return this.update({ item });
                });
            }
            return Promise.reject(error);
        });
    }
}

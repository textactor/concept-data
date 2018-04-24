
import { IConceptRootNameRepository, RootName, Locale } from '@textactor/concept-domain';
import { MongoRepository } from './mongo/mongoRepository';

export class ConceptRootNameRepository extends MongoRepository<string, RootName> implements IConceptRootNameRepository {
    getMostPopularIds(locale: Locale, limit: number, skip: number, minCountWords?: number): Promise<string[]> {
        minCountWords = minCountWords || 1;

        return this.model.list({
            where: {
                lang: locale.lang,
                country: locale.country,
                countWords: { $gte: minCountWords },
            },
            limit: limit,
            offset: skip,
            sort: '-popularity',
            select: '_id',
        }).then(list => list && list.map(item => item.id));
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

    createOrUpdate(item: RootName): Promise<RootName> {
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

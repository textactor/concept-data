
import { IConceptRootNameRepository, RootName } from '@textactor/concept-domain';
import { MongoRepository } from './mongo/mongoRepository';

export class ConceptRootNameRepository extends MongoRepository<string, RootName> implements IConceptRootNameRepository {
    getMostPopularIds(containerId: string, limit: number, skip: number, minCountWords?: number): Promise<string[]> {
        minCountWords = minCountWords || 1;

        return this.model.list({
            where: {
                containerId,
                countWords: { $gte: minCountWords },
            },
            limit: limit,
            offset: skip,
            sort: '-popularity,createdAt',
            select: '_id',
        }).then(list => list && list.map(item => item.id));
    }
    deleteUnpopular(containerId: string, popularity: number): Promise<number> {
        return this.model.remove({
            where: {
                containerId,
                popularity: { $lt: popularity },
            }
        });
    }
    deleteUnpopularAbbreviations(containerId: string, popularity: number): Promise<number> {
        return this.model.remove({
            where: {
                containerId,
                isAbbr: true,
                popularity: { $lt: popularity },
            }
        });
    }
    deleteUnpopularOneWorlds(containerId: string, popularity: number): Promise<number> {
        return this.model.remove({
            where: {
                containerId,
                countWords: 1,
                popularity: { $lt: popularity },
            }
        });
    }
    deleteAll(containerId: string): Promise<number> {
        return this.model.remove({
            where: { containerId }
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
                    if (dbItem) {
                        item.popularity = dbItem.popularity + 1;
                        return this.update({ item });
                    } else {
                        console.log(`!NOT found concept on updating: ${item.name}`);
                        // return delay(500).then()
                    }
                });
            }
            return Promise.reject(error);
        });
    }
}

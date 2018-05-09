
import { IConceptContainerRepository, ConceptContainer, Locale, ConceptContainerStatus } from '@textactor/concept-domain';
import { MongoRepository } from './mongo/mongoRepository';

export class ConceptContainerRepository extends MongoRepository<string, ConceptContainer> implements IConceptContainerRepository {

    getByStatus(locale: Locale, status: ConceptContainerStatus[]): Promise<ConceptContainer[]> {
        return this.model.list({
            where: {
                lang: locale.lang,
                country: locale.country,
                status: { $in: status },
            },
            limit: 100,
        });
    }
    
    getByUniqueName(uniqueName: string): Promise<ConceptContainer> {
        return this.model.one({ where: { uniqueName } });
    }

    list(locale: Locale, limit: number, skip?: number): Promise<ConceptContainer[]> {
        return this.model.list({
            where: {
                lang: locale.lang,
                country: locale.country,
            },
            limit,
            offset: skip || 0,
        });
    }

    count(locale: Locale): Promise<number> {
        return this.model.count({
            lang: locale.lang,
            count: locale.country,
        });
    }

    deleteIds(ids: string[]): Promise<number> {
        return this.model.remove({
            where: {
                _id: { $in: ids }
            }
        });
    }

    createOrUpdate(item: ConceptContainer): Promise<ConceptContainer> {
        return this.create(item).catch(error => {
            if (error.code && error.code === 11000) {
                return this.getById(item.id).then(dbItem => {
                    if (dbItem) {
                        return this.update({ item });
                    } else {
                        console.log(`!NOT found concept on updating: ${item.name}`);
                    }
                });
            }
            return Promise.reject(error);
        });
    }
}

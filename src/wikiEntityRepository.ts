import { IWikiEntityRepository, WikiEntity } from '@textactor/concept-domain';
import { MongoRepository } from './mongo/mongoRepository';
import { uniq } from '@textactor/domain';

export class WikiEntityRepository extends MongoRepository<string, WikiEntity> implements IWikiEntityRepository {
    getByNameHash(hash: string): Promise<WikiEntity[]> {
        return this.model.list({
            where: { nameHash: hash },
            limit: 100,
        });
    }
    getByPartialNameHash(hash: string): Promise<WikiEntity[]> {
        return this.model.list({
            where: { partialNamesHashes: hash },
            limit: 100,
        });
    }
    getLastnames(lang: string): Promise<string[]> {
        return this.model.list({
            where: { lang: lang, lastname: { $exists: true } },
            limit: 100,
            select: 'lastname'
        }).then(list => uniq(list.map(item => item.lastname)));
    }
    count(): Promise<number> {
        throw new Error("Method not implemented.");
    }
}
import { IWikiEntityRepository, WikiEntity, WikiEntityType } from '@textactor/concept-domain';
import { MongoRepository } from './mongo/mongoRepository';
import { NameHelper } from '@textactor/domain';

export class WikiEntityRepository extends MongoRepository<string, WikiEntity> implements IWikiEntityRepository {
    getByNameHash(hash: string): Promise<WikiEntity[]> {
        return this.model.list({
            where: { namesHashes: hash },
            limit: 100,
        });
    }
    getByPartialNameHash(hash: string): Promise<WikiEntity[]> {
        return this.model.list({
            where: { partialNamesHashes: hash },
            limit: 100,
        });
    }
    count(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getInvalidPartialNames(lang: string): Promise<string[]> {
        const container: { [index: string]: boolean } = {}

        return this.model.list({
            where: {
                lang: lang,
                type: WikiEntityType.PERSON,
            },
            limit: 500
        })
            .then(list => {
                for (let item of list) {
                    item.names.forEach(name => {
                        if (NameHelper.countWords(name) < 2 || NameHelper.isAbbr(name)) {
                            return
                        }
                        const parts = name.split(/\s+/g).filter(it => !NameHelper.isAbbr(it) && it.length > 1 && it[0] !== '(' && it.toLowerCase() !== name);
                        for (let it of parts) {
                            container[it] = true;
                        }
                    });
                }
            })
            .then(() => Promise.resolve(Object.keys(container)));
    }
}

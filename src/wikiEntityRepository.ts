import { IWikiEntityRepository, WikiEntity } from '@textactor/concept-domain';
import { MongoRepository } from './mongo/mongoRepository';
import { uniq, NameHelper } from '@textactor/domain';

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
    getInvalidPartialNames(lang: string): Promise<string[]> {
        const container: { [index: string]: boolean } = {}

        return this.model.list({
            where: {
                lang: lang,
                type: 'PERSON'
            },
            limit: 500
        })
            .then(list => {
                for (let item of list) {
                    item.names.forEach(name => {
                        if (NameHelper.countWords(name) < 2 || NameHelper.isAbbr(name)) {
                            return
                        }
                        const parts = name.split(/\s+/g).filter(it => !NameHelper.isAbbr(it) && it.length > 1);
                        for (let it of parts) {
                            container[it] = true;
                        }
                    });
                }
            })
            .then(() => Promise.resolve(Object.keys(container)));
    }
}
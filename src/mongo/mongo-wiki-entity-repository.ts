import { MongoRepository } from "./mongo-repository";
import { WikiEntity, WikiEntityType, WikiEntityRepository } from "@textactor/concept-domain";
import { NameHelper } from "@textactor/domain";

export class MongoWikiEntityRepository extends MongoRepository<WikiEntity> implements WikiEntityRepository {

    getByNameHash(hash: string) {
        return this.model.find({
            where: { namesHashes: hash },
            limit: 100,
        });
    }
    getByPartialNameHash(hash: string) {
        return this.model.find({
            where: { partialNamesHashes: hash },
            limit: 100,
        });
    }
    count(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    async getInvalidPartialNames(lang: string): Promise<string[]> {
        const container: { [index: string]: boolean } = {}

        function processList(list: WikiEntity[]) {
            for (let item of list) {
                item.names.forEach(name => {
                    if (NameHelper.countWords(name) < 2 || NameHelper.isAbbr(name)) {
                        return
                    }
                    const parts = name.split(/\s+/g).filter(it => !NameHelper.isAbbr(it) && it.length > 1 && it[0] !== '(' && it.toLowerCase() !== it);
                    for (let it of parts) {
                        container[it] = true;
                    }
                });
            }
        }

        let list = await this.model.find({
            where: {
                lang: lang,
                type: WikiEntityType.PERSON,
            },
            limit: 500
        });

        processList(list);

        if (list.length === 500) {
            list = await this.model.find({
                where: {
                    lang: lang,
                    type: WikiEntityType.PERSON,
                },
                limit: 500
            });
            processList(list);
        }

        return Object.keys(container);
    }
}

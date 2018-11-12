
import { Db } from 'mongodb';
import { MongoItem } from 'mongo-item';
import {
    WikiEntity, WikiEntityHelper,
} from '@textactor/concept-domain';
import { unixTime, RepositoryUpdateData } from '@textactor/domain';

const EXPIRES_AT_FIELD = WikiEntityHelper.getExpiresAtFieldName();

export class MongoWikiEntity extends MongoItem<WikiEntity> {
    constructor(db: Db, tableSuffix: string) {
        super(db, `textactor_wiki_entities_${tableSuffix}`);
    }

    async createStorage() {
        await super.createStorage();
        const index = {} as any;
        index[EXPIRES_AT_FIELD] = 1;

        await this.collection.createIndex(index, { expireAfterSeconds: 0 });
        await this.collection.createIndex({ partialNamesHashes: 1 });
        await this.collection.createIndex({ namesHashes: 1 });
        await this.collection.createIndex({ lang: 1, type: 1 });
    }

    protected beforeCreate(data: WikiEntity) {
        (<any>data)[EXPIRES_AT_FIELD] = new Date(data.expiresAt * 1000);

        return super.beforeCreate(data);
    }

    protected beforeUpdate(data: RepositoryUpdateData<WikiEntity>) {
        data.set = data.set || {};
        data.set.updatedAt = data.set.updatedAt || unixTime();

        if (data.set.expiresAt) {
            (<any>data.set)[EXPIRES_AT_FIELD] = new Date(data.set.expiresAt * 1000);
        }

        return super.beforeUpdate(data);
    }

    protected convertFromMongoDoc(doc: any): WikiEntity {
        const item = super.convertFromMongoDoc(doc);

        if (item.expiresAt) {
            item.expiresAt = unixTime(new Date(item.expiresAt));
        }

        return item;
    }
}

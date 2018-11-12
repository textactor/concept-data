
import { Db } from 'mongodb';
import { MongoItem } from 'mongo-item';
import {
    WikiSearchName, WikiSearchNameHelper,
} from '@textactor/concept-domain';
import { unixTime, RepositoryUpdateData } from '@textactor/domain';

const EXPIRES_AT_FIELD = WikiSearchNameHelper.getExpiresAtFieldName();

export class MongoWikiSearchName extends MongoItem<WikiSearchName> {
    constructor(db: Db, tableSuffix: string) {
        super(db, `textactor_wiki_search_names_${tableSuffix}`);
    }

    async createStorage() {
        await super.createStorage();
        const index = {} as any;
        index[EXPIRES_AT_FIELD] = 1;

        await this.collection.createIndex(index, { expireAfterSeconds: 0 });
    }

    protected beforeCreate(data: WikiSearchName) {
        (<any>data)[EXPIRES_AT_FIELD] = new Date(data.expiresAt * 1000);

        return super.beforeCreate(data);
    }

    protected beforeUpdate(data: RepositoryUpdateData<WikiSearchName>) {
        data.set = data.set || {};
        data.set.updatedAt = data.set.updatedAt || unixTime();
        
        if (data.set.expiresAt) {
            (<any>data.set)[EXPIRES_AT_FIELD] = new Date(data.set.expiresAt * 1000);
        }

        return super.beforeUpdate(data);
    }

    protected convertFromMongoDoc(doc: any): WikiSearchName {
        const item = super.convertFromMongoDoc(doc);

        if (item.expiresAt) {
            item.expiresAt = unixTime(new Date(item.expiresAt));
        }

        return item;
    }
}

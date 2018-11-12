
import { Db } from 'mongodb';
import { MongoItem } from 'mongo-item';
import {
    WikiTitle, WikiTitleHelper,
} from '@textactor/concept-domain';
import { unixTime, RepositoryUpdateData } from '@textactor/domain';

const EXPIRES_AT_FIELD = WikiTitleHelper.getExpiresAtFieldName();

export class MongoWikiTitle extends MongoItem<WikiTitle> {
    constructor(db: Db, tableSuffix: string) {
        super(db, `textactor_wiki_titles_${tableSuffix}`);
    }

    async createStorage() {
        await super.createStorage();
        const index = {} as any;
        index[EXPIRES_AT_FIELD] = 1;

        await this.collection.createIndex(index, { expireAfterSeconds: 0 });
    }

    protected beforeCreate(data: WikiTitle) {
        (<any>data)[EXPIRES_AT_FIELD] = new Date(data.expiresAt * 1000);

        return super.beforeCreate(data);
    }

    protected beforeUpdate(data: RepositoryUpdateData<WikiTitle>) {
        data.set = data.set || {};
        data.set.updatedAt = data.set.updatedAt || unixTime();
        
        if (data.set.expiresAt) {
            (<any>data.set)[EXPIRES_AT_FIELD] = new Date(data.set.expiresAt * 1000);
        }

        return super.beforeUpdate(data);
    }

    protected convertFromMongoDoc(doc: any): WikiTitle {
        const item = super.convertFromMongoDoc(doc);

        if (item.expiresAt) {
            item.expiresAt = unixTime(new Date(item.expiresAt));
        }

        return item;
    }
}

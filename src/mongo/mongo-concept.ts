
import { Db } from 'mongodb';
import { MongoItem } from 'mongo-item';
import {
    Concept, ConceptHelper,
} from '@textactor/concept-domain';
import { unixTime, RepositoryUpdateData } from '@textactor/domain';

const EXPIRES_AT_FIELD = ConceptHelper.getExpiresAtFieldName();

export class MongoConcept extends MongoItem<Concept> {
    constructor(db: Db, tableSuffix: string) {
        super(db, `textactor_concepts_${tableSuffix}`);
    }

    async createStorage() {
        await super.createStorage();
        const index = {} as any;
        index[EXPIRES_AT_FIELD] = 1;

        await this.collection.createIndex(index, { expireAfterSeconds: 0 });
        await this.collection.createIndex({ containerId: 1, countWords: 1, popularity: -1, createdAt: 1 });
        await this.collection.createIndex({ rootNameIds: 1 });
        await this.collection.createIndex({ lang: 1, country: 1 });
        await this.collection.createIndex({ containerId: 1, abbr: 1 });
    }

    protected beforeCreate(data: Concept) {
        (<any>data)[EXPIRES_AT_FIELD] = new Date(data.expiresAt * 1000);

        return super.beforeCreate(data);
    }

    protected beforeUpdate(data: RepositoryUpdateData<Concept>) {
        data.set = data.set || {};
        data.set.updatedAt = data.set.updatedAt || unixTime();
        
        if (data.set.expiresAt) {
            (<any>data.set)[EXPIRES_AT_FIELD] = new Date(data.set.expiresAt * 1000);
        }

        return super.beforeUpdate(data);
    }

    protected convertFromMongoDoc(doc: any) {
        const item = super.convertFromMongoDoc(doc);

        if (item.expiresAt) {
            item.expiresAt = unixTime(new Date(item.expiresAt));
        }

        return item;
    }
}

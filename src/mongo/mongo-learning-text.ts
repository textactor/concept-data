
import { Db } from 'mongodb';
import { MongoItem } from 'mongo-item';
import {
    LearningTextHelper, LearningText,
} from '@textactor/concept-domain';
import { unixTime, RepositoryUpdateData } from '@textactor/domain';

const EXPIRES_AT_FIELD = LearningTextHelper.getExpiresAtFieldName();

export class MongoLearningText extends MongoItem<LearningText> {
    constructor(db: Db, tableSuffix: string) {
        super(db, `textactor_learning_texts_${tableSuffix}`);
    }

    async createStorage() {
        await super.createStorage();
        const index = {} as any;
        index[EXPIRES_AT_FIELD] = 1;

        await this.collection.createIndex(index, { expireAfterSeconds: 0 });
        await this.collection.createIndex({ lang: 1, country: 1, createdAt: -1 });
    }

    protected beforeCreate(data: LearningText) {
        (<any>data)[EXPIRES_AT_FIELD] = new Date(data.expiresAt * 1000);

        return super.beforeCreate(data);
    }

    protected beforeUpdate(data: RepositoryUpdateData<LearningText>) {
        data.set = data.set || {};
        
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

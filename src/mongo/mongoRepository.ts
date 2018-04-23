
import { IRepository, RepUpdateData } from '@textactor/domain';
import { MongoModel } from './mongoModel';

export class MongoRepository<ID, T> implements IRepository<ID, T> {
    constructor(protected model: MongoModel<T>) { }

    getById(id: ID): Promise<T> {
        return this.model.one({ where: { _id: id } });
    }
    getByIds(ids: ID[]): Promise<T[]> {
        return this.model.list({ where: { _id: { $in: ids } }, limit: ids.length });
    }
    exists(id: ID): Promise<boolean> {
        return this.model.one({ where: { _id: id }, select: '_id' }).then(item => !!item);
    }
    delete(id: ID): Promise<boolean> {
        return this.model.remove({ where: { _id: id } }).then(item => !!item);
    }
    create(data: T): Promise<T> {
        return this.model.create(data);
    }
    update(data: RepUpdateData<T>): Promise<T> {
        const id = (<any>data.item).id;
        const set: { [index: string]: any } = {};
        for (let prop of Object.keys(data.item)) {
            if (['id', 'createdAt', '_id'].indexOf(prop) > -1) {
                continue;
            }
            if ([null, undefined, ''].indexOf((<any>data.item)[prop]) > -1) {
                continue;
            }
            set[prop] = (<any>data.item)[prop];
        }
        const unset: { [index: string]: string } = {};
        if (data.delete) {
            for (let prop of data.delete) {
                if (['id', 'createdAt', '_id'].indexOf(prop) > -1) {
                    continue;
                }
                unset[prop] = "";
            }
        }
        return this.model.update({
            id: id,
            set: set as T,
            unset
        });
    }

    async createOrUpdate(data: T): Promise<T> {
        const exists = await this.exists((<any>data).id);
        if (exists) {
            return this.update({
                item: data
            });
        }
        return this.create(data);
    }
}

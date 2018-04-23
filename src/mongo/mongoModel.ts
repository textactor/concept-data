import { Model } from 'mongoose';

export class MongoModel<T> {

    constructor(private model: Model<any>) {

    }

    create(data: T): Promise<T> {
        if (!data) {
            return Promise.reject(Error('`data` is required'));
        }
        try {
            data = this.beforeCreating(data);
        } catch (e) {
            return Promise.reject(e);
        }
        return new Promise<T>((resolve, reject) => {
            this.model.create(data).then(item => resolve(this.transformItem(item)), reject);
        });
    }

    update(data: MongoUpdateData<T>, options?: MongoOptions): Promise<T> {
        if (!data) {
            return Promise.reject(Error('`data` is required'));
        }
        try {
            data = this.beforeUpdating(data);
        } catch (e) {
            return Promise.reject(e);
        }

        const udata: any = {};
        if (data.set && Object.keys(data.set).length) {
            udata['$set'] = data.set;
        }
        if (data.unset && Object.keys(data.unset).length) {
            udata['$unset'] = data.unset;
        }

        return new Promise<T>((resolve, reject) => {
            this.model.findByIdAndUpdate(data.id, udata, options)
                .then(item => resolve(this.transformItem(item)), reject);
        });
    }

    // updateMongo(condition: any, data: any, options?: any) {
    //     return new Promise<T>((resolve, reject) => {
    //         this.model.update(condition, data, options).then(get, reject).then(resolve);
    //     });
    // }

    remove(params: MongoParams): Promise<number> {
        if (!params) {
            return Promise.reject(Error('`params` is required'));
        }

        return new Promise((resolve, reject) => {
            this.model.remove(params.where)
                .then(item => resolve(item), reject);
        });
    }

    one(params: MongoParams): Promise<T> {
        if (!params) {
            return Promise.reject(Error('`params` is required'));
        }
        // debug('one', params);
        return new Promise<T>((resolve, reject) => {
            this.model.findOne(params.where, params.select)
                .then(item => resolve(this.transformItem(item)), reject);
        });
    }

    count(where: MongoParamsWhere): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.model.count(where).then(item => resolve(item), reject);
        });
    }

    list(params: MongoParams): Promise<T[]> {
        if (!params) {
            return Promise.reject(Error('`params` is required'));
        }

        return new Promise<T[]>((resolve, reject) => {
            this.model
                .find(params.where)
                .select(params.select)
                .sort(params.sort)
                .skip(params.offset || 0)
                .limit(params.limit || 10)
                .exec()
                .then(items => resolve(items && items.map(item => this.transformItem(item))), reject);
        });
    }


    protected beforeCreating(data: any) {
        data._id = data._id || data.id;
        return data;
    }

    protected beforeUpdating(data: any) {
        // data._id = data._id || data.id;
        return data;
    }

    protected transformItem(item: any): T {
        if (!item) {
            return null;
        }
        return item.toJSON();
    }
}

export type MongoParamsWhere = { [index: string]: any };
export type MongoParams = {
    where?: MongoParamsWhere
    select?: string
    offset?: number
    limit?: number
    sort?: string
}

export type MongoUpdateData<T> = {
    id: string
    set?: T
    unset?: { [index: string]: string }
}

export type MongoOptions = {
    select?: string
}
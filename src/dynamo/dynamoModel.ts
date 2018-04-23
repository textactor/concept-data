
const dynamo = require('dynamodb');
import { DynamoModelOptions } from "./dynamoModelOptions";
import { RepUpdateData } from "@textactor/domain";

export class DynamoModel<T, ID> {
    private Model: any;
    constructor(private options: DynamoModelOptions, dynamodb?: any) {
        this.Model = dynamo.define(options.name, {
            hashKey: options.hashKey,
            rangeKey: options.hashKey,
            timestamps: false,
            schema: options.schema,
            tableName: options.tableName,
            indexes: options.indexes,
        });
        if (dynamodb) {
            this.Model.config({ dynamodb: dynamodb });
        }
    }

    deleteTable(secret: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!secret || secret !== process.env.DYNAMODB_DELETE_SECRET) {
                return reject(new Error(`'secret' is not valid!`));
            }
            this.Model.deleteTable((error: Error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            })
        });
    }

    getById(id: ID): Promise<T> {
        return new Promise((resolve, reject) => {
            const params = formatParams();

            this.Model.get(id, params, (error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }
                resolve(this.transformData(result));
            });
        });
    }

    getByIds(ids: ID[]): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            const params = formatParams();

            this.Model.getItems(ids, params, (error: Error, result: any[]) => {
                if (error) {
                    return reject(error);
                }
                resolve(result && result.map(item => this.transformData(item)) || []);
            });
        });
    }

    put(item: T): Promise<T> {
        item = this.beforeCreating(item);
        return new Promise((resolve, reject) => {
            const params = formatParams();
            params.overwrite = true;

            // debug('creating place: ', dataPlace);
            this.Model.create(item, params, (error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }
                resolve(this.transformData(result));
            });
        });
    }

    delete(id: ID): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.Model.destroy(id, (error: Error) => {
                if (error) {
                    return reject(error);
                }
                resolve(true);
            });
        });
    }

    create(item: T): Promise<T> {
        item = this.beforeCreating(item);
        return new Promise((resolve, reject) => {
            const params = formatParams();
            params.overwrite = false;
            this.Model.create(item, params, (error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }
                resolve(this.transformData(result));
            });
        });
    }

    update(data: RepUpdateData<T>): Promise<T> {
        data = this.beforeUpdating(data);
        return new Promise((resolve, reject) => {
            const params = formatParams();
            params.expected = {};
            params.expected[this.options.hashKey] = (<any>data.item)[this.options.hashKey];
            if (this.options.rangeKey !== undefined) {
                params.expected[this.options.rangeKey] = (<any>data.item)[this.options.rangeKey];
            }

            let updateItem: any = { ...(data.item as any) };
            if (data.delete && data.delete.length) {
                data.delete.forEach(item => updateItem[item] = null);
            }

            this.Model.update(updateItem, params, (error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }
                resolve(this.transformData(result));
            });
        });
    }

    protected transformData(data: any): T {
        if (!data) {
            return null;
        }
        const report = <T>data.get();
        return report;
    }

    protected beforeCreating(data: T): T {
        return data;
    }

    protected beforeUpdating(data: RepUpdateData<T>): RepUpdateData<T> {
        return data;
    }
}

function formatParams(): { [key: string]: any } {
    return {};
}

import {
  Repository,
  BaseRepository,
  EntityValidator,
  RepositoryAccessOptions,
  BaseEntity,
  RepositoryUpdateData
} from "@textactor/domain";
import { MongoItem, MongoAccessOptions } from "mongo-item";

export class MongoRepository<T extends BaseEntity>
  extends BaseRepository<T>
  implements Repository<T>
{
  constructor(protected model: MongoItem<T>, validator: EntityValidator<T>) {
    super(validator);
  }

  async deleteStorage() {
    await this.model.deleteStorage();
  }
  async createStorage() {
    await this.model.createStorage();
  }

  getById(id: string, options?: RepositoryAccessOptions<T>): Promise<T | null> {
    return this.model.getById(id, optionsToMongoOptions(options));
  }
  getByIds(ids: string[], options?: RepositoryAccessOptions<T>): Promise<T[]> {
    return this.model.getByIds(ids, optionsToMongoOptions(options));
  }
  exists(id: string): Promise<boolean> {
    return this.model.exists(id);
  }
  delete(id: string): Promise<boolean> {
    return this.model.deleteOne(id);
  }
  innerCreate(data: T): Promise<T> {
    return this.model.create(data);
  }
  innerUpdate(
    data: RepositoryUpdateData<T>,
    options?: RepositoryAccessOptions<T>
  ): Promise<T> {
    return this.model.update(
      {
        id: data.id,
        delete: data.delete as string[],
        set: data.set
      },
      optionsToMongoOptions(options)
    );
  }
}

function optionsToMongoOptions<T extends BaseEntity>(
  options?: RepositoryAccessOptions<T>
) {
  if (!options) {
    return undefined;
  }
  const mongoOptions: MongoAccessOptions = {};

  if (options.fields) {
    mongoOptions.fields = options.fields as string[];
  }

  return mongoOptions;
}

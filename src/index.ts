
import * as mongoose from 'mongoose';

export { ConceptModel } from './mongo/conceptModel';
export { ConceptRootNameModel } from './mongo/conceptRootNameModel';
export { WikiSearchNameModel } from './mongo/wikiSearchNameModel';
export { WikiTitleModel } from './mongo/wikiTitleModel';
export { WikiEntityModel } from './mongo/wikiEntityModel';
export { ConceptContainerModel } from './mongo/conceptContainerModel';

export { ConceptRepository } from './conceptRepository';
export { ConceptRootNameRepository } from './conceptRootNameRepository';
export { WikiSearchNameRepository } from './wikiSearchNameRepository';
export { WikiTitleRepository } from './wikiTitleRepository';
export { WikiEntityRepository } from './wikiEntityRepository';
export { ConceptContainerRepository } from './conceptContainerRepository';

export function createConnection(connectionString: string): any {
    return mongoose.createConnection(connectionString);
}

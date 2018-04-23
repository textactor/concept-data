
import { IWikiSearchNameRepository, WikiSearchName } from '@textactor/concept-domain';
import { MongoRepository } from './mongo/mongoRepository';

export class WikiSearchNameRepository extends MongoRepository<string, WikiSearchName> implements IWikiSearchNameRepository {
    
}

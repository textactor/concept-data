
import { IWikiTitleRepository, WikiTitle } from '@textactor/concept-domain';
import { MongoRepository } from './mongo/mongoRepository';

export class WikiTitleRepository extends MongoRepository<string, WikiTitle> implements IWikiTitleRepository {
    
}

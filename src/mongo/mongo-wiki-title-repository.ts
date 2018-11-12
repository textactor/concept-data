import { MongoRepository } from "./mongo-repository";
import { WikiTitle, WikiTitleRepository, WikiTitleValidator } from "@textactor/concept-domain";
import { MongoWikiTitle } from "./mongo-wiki-title";

export class MongoWikiTitleRepository extends MongoRepository<WikiTitle>
    implements WikiTitleRepository {

    constructor(model: MongoWikiTitle) {
        super(model, new WikiTitleValidator())
    }
}
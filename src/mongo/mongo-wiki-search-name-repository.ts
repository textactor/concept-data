import { MongoRepository } from "./mongo-repository";
import { WikiSearchName, WikiSearchNameRepository, WikiSearchNameValidator } from "@textactor/concept-domain";
import { MongoWikiSearchName } from "./mongo-wiki-search-name";

export class MongoWikiSearchNameRepository extends MongoRepository<WikiSearchName>
    implements WikiSearchNameRepository {
    constructor(model: MongoWikiSearchName) {
        super(model, new WikiSearchNameValidator())
    }
}
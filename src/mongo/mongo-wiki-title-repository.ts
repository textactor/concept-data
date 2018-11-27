import { MongoRepository } from "./mongo-repository";
import { WikiTitle, WikiTitleRepository } from "@textactor/concept-domain";

export class MongoWikiTitleRepository extends MongoRepository<WikiTitle>
    implements WikiTitleRepository {
}
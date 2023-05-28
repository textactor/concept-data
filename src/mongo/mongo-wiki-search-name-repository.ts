import { MongoRepository } from "./mongo-repository";
import {
  WikiSearchName,
  WikiSearchNameRepository
} from "@textactor/concept-domain";

export class MongoWikiSearchNameRepository
  extends MongoRepository<WikiSearchName>
  implements WikiSearchNameRepository {}

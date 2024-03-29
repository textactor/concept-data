import {
  ConceptContainerRepository,
  ConceptRepository,
  WikiEntityRepository,
  WikiSearchNameRepository,
  WikiTitleRepository,
  LearningTextRepository,
  Concept,
  ConceptContainer,
  WikiEntity,
  WikiSearchName,
  WikiTitle,
  LearningText
} from "@textactor/concept-domain";
import { MongoConceptContainerRepository } from "./mongo/mongo-container-repository";
import { MongoConceptContainer } from "./mongo/mongo-container";
import { MongoConcept } from "./mongo/mongo-concept";
import { MongoConceptRepository } from "./mongo/mongo-concept-repository";
import { MongoWikiEntityRepository } from "./mongo/mongo-wiki-entity-repository";
import { MongoWikiEntity } from "./mongo/mongo-wiki-entity";
import { MongoWikiSearchNameRepository } from "./mongo/mongo-wiki-search-name-repository";
import { MongoWikiSearchName } from "./mongo/mongo-wiki-search-name";
import { MongoWikiTitleRepository } from "./mongo/mongo-wiki-title-repository";
import { MongoWikiTitle } from "./mongo/mongo-wiki-title";
import { MongoLearningTextRepository } from "./mongo/mongo-learning-text-repository";
import { MongoLearningText } from "./mongo/mongo-learning-text";
import { EntityValidator } from "@textactor/domain";

export class ConceptContainerRepositoryBuilder {
  static build(
    db: any,
    validator: EntityValidator<ConceptContainer>,
    tableSuffix: string = "v0"
  ): ConceptContainerRepository {
    return new MongoConceptContainerRepository(
      new MongoConceptContainer(db, tableSuffix),
      validator
    );
  }
}

export class ConceptRepositoryBuilder {
  static build(
    db: any,
    validator: EntityValidator<Concept>,
    tableSuffix: string = "v0"
  ): ConceptRepository {
    return new MongoConceptRepository(
      new MongoConcept(db, tableSuffix),
      validator
    );
  }
}

export class WikiEntityRepositoryBuilder {
  static build(
    db: any,
    validator: EntityValidator<WikiEntity>,
    tableSuffix: string = "v0"
  ): WikiEntityRepository {
    return new MongoWikiEntityRepository(
      new MongoWikiEntity(db, tableSuffix),
      validator
    );
  }
}

export class WikiSearchNameRepositoryBuilder {
  static build(
    db: any,
    validator: EntityValidator<WikiSearchName>,
    tableSuffix: string = "v0"
  ): WikiSearchNameRepository {
    return new MongoWikiSearchNameRepository(
      new MongoWikiSearchName(db, tableSuffix),
      validator
    );
  }
}

export class WikiTitleRepositoryBuilder {
  static build(
    db: any,
    validator: EntityValidator<WikiTitle>,
    tableSuffix: string = "v0"
  ): WikiTitleRepository {
    return new MongoWikiTitleRepository(
      new MongoWikiTitle(db, tableSuffix),
      validator
    );
  }
}

export class LearningTextRepositoryBuilder {
  static build(
    db: any,
    validator: EntityValidator<LearningText>,
    tableSuffix: string = "v0"
  ): LearningTextRepository {
    return new MongoLearningTextRepository(
      new MongoLearningText(db, tableSuffix),
      validator
    );
  }
}

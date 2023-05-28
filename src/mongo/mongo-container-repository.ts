import { MongoRepository } from "./mongo-repository";
import {
  ConceptContainer,
  ConceptContainerRepository,
  ConceptContainerStatus,
  Locale,
  ContainerListFilters
} from "@textactor/concept-domain";
import { MongoFindParams } from "mongo-item";

export class MongoConceptContainerRepository
  extends MongoRepository<ConceptContainer>
  implements ConceptContainerRepository
{
  getByStatus(locale: Locale, status: ConceptContainerStatus[]) {
    return this.model.find({
      where: {
        lang: locale.lang,
        country: locale.country,
        status: { $in: status }
      },
      limit: 100
    });
  }

  list(filters: ContainerListFilters) {
    const selector: MongoFindParams = {
      where: {
        lang: filters.lang,
        country: filters.country
      },
      limit: filters.limit,
      offset: filters.skip,
      sort: ["-createdAt"]
    };

    if (filters.ownerId) {
      selector.where.ownerId = filters.ownerId;
    }
    if (filters.uniqueName) {
      selector.where.uniqueName = filters.uniqueName;
    }
    if (filters.status) {
      selector.where.status = { $in: filters.status };
    }

    return this.model.find(selector);
  }
  count(locale: Locale) {
    return this.model.count(locale);
  }
  getByUniqueName(uniqueName: string) {
    return this.model.findOne({ where: { uniqueName } });
  }
}

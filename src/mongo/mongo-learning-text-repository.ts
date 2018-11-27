import { MongoRepository } from "./mongo-repository";
import {
    LearningText,
    LearningTextRepository,
    LearningTextListParams,
} from "@textactor/concept-domain";
import { MongoFindParams } from "mongo-item";

export class MongoLearningTextRepository extends MongoRepository<LearningText>
    implements LearningTextRepository {

    list(filters: LearningTextListParams) {
        const selector: MongoFindParams = {
            where: {
                lang: filters.lang,
                country: filters.country,
            },
            limit: filters.limit,
            offset: filters.skip,
            sort: ['-createdAt'],
        };

        return this.model.find(selector);
    }
    async put(item: LearningText) {
        try {
            return await this.create(item);
        } catch (e) {
            if (e.code === 11000) {
                await this.delete(item.id);
                return this.create(item);
            }
            return Promise.reject(e);
        }
    }
}

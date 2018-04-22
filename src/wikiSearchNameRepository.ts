
import { IWikiSearchNameRepository, WikiSearchName } from '@textactor/concept-domain';
import { RepUpdateData } from '@textactor/domain';
import { DynamoRepository } from './DynamoRepository';

export class WikiSearchNameRepository extends DynamoRepository implements IWikiSearchNameRepository {
    getById(id: string): Promise<WikiSearchName> {
        this.dynamo.getItem({
            
        })
    }
    getByIds(ids: string[]): Promise<WikiSearchName[]> {
        throw new Error("Method not implemented.");
    }
    exists(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    createOrUpdate(data: WikiSearchName): Promise<WikiSearchName> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    create(data: WikiSearchName): Promise<WikiSearchName> {
        throw new Error("Method not implemented.");
    }
    update(data: RepUpdateData<WikiSearchName>): Promise<WikiSearchName> {
        throw new Error("Method not implemented.");
    }
}

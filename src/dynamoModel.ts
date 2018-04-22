import * as DynamoDB from "aws-sdk/clients/dynamodb";

export class DynamoModel<T, KEY> {
    constructor(protected dynamo: DynamoDB) {

    }

    create(item: T): Promise<T> {
        this.dynamo.putItem({
            Item: 
        })
    }
}

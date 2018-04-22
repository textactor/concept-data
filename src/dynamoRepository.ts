import * as DynamoDB from "aws-sdk/clients/dynamodb";

export class DynamoRepository {
    constructor(protected dynamo: DynamoDB) {

    }
}

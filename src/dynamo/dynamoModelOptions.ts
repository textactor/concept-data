
export interface DynamoModelOptions {
    name: string
    tableName: string
    hashKey: string
    rangeKey?: string
    schema: any
    indexes?: { hashKey?: string, rangeKey?: string, type: 'local' | 'global', name: string, projection?: any }[]
}

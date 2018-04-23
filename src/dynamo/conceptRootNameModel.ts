import { DynamoModel } from "./dynamoModel";
import { RootName } from "@textactor/concept-domain";
import { DynamoModelOptions } from "./dynamoModelOptions";
import * as Joi from 'joi';
import { LANG_REG, COUNTRY_REG } from "./helpers";
import ms = require('ms');

export class ConceptRootNameModel extends DynamoModel<RootName, string> {
    constructor(dynamodb?: any) {
        super(OPTIONS, dynamodb);
    }

    protected beforeCreating(data: RootName): RootName {
        data.createdAt = data.createdAt || Math.round(Date.now() / 1000);

        setExpiresAt(data);

        return data;
    }
}

function setExpiresAt(item: any) {
    item.expiresAt = Math.round((Date.now() + ms('15 days')) / 1000);
}

const OPTIONS: DynamoModelOptions = {
    name: 'textactor:ConceptRootName',
    tableName: 'textactor_ConceptRootNames_v0',
    hashKey: 'id',
    schema: {
        id: Joi.string().min(16).max(40).required(),
        lang: Joi.string().regex(LANG_REG).required(),
        country: Joi.string().regex(COUNTRY_REG).required(),
        name: Joi.string().min(2).max(200).required(),
        rootName: Joi.string().min(2).max(200).required(),
        createdAt: Joi.date().required(),

        popularity: Joi.number().integer().required(),
        countWords: Joi.number().integer().required(),
        isAbbr: Joi.boolean().required(),
        expiresAt: Joi.number().integer().required(),
    }
}

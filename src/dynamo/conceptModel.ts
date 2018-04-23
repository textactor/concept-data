import { DynamoModel } from "./dynamoModel";
import { Concept } from "@textactor/concept-domain";
import { DynamoModelOptions } from "./dynamoModelOptions";
import * as Joi from 'joi';
import { LANG_REG, COUNTRY_REG } from "../helpers";
import ms = require('ms');

export class ConceptModel extends DynamoModel<Concept, string> {
    constructor(dynamodb?: any) {
        super(OPTIONS, dynamodb);
    }

    protected beforeCreating(data: Concept): Concept {
        const ts = Math.round(Date.now() / 1000);
        data.createdAt = data.createdAt || ts;

        (<any>data).culture = `${data.lang.trim().toLowerCase()}_${data.country.trim().toLowerCase()}`;

        setExpiresAt(data);

        return data;
    }
}

function setExpiresAt(item: any) {
    item.expiresAt = Math.round((Date.now() + ms('15 days')) / 1000);
}

const OPTIONS: DynamoModelOptions = {
    name: 'textactor:Concept',
    tableName: 'textactor_Concepts_v0',
    hashKey: 'id',
    schema: {
        id: Joi.string().min(16).max(40).required(),
        lang: Joi.string().regex(LANG_REG).required(),
        country: Joi.string().regex(COUNTRY_REG).required(),
        culture: Joi.string().regex(/^[a-z]{2}_[a-z]{2}$/).required(),
        name: Joi.string().min(2).max(200).required(),
        nameLength: Joi.number().integer().min(1).required(),
        nameHash: Joi.string().max(40).required(),
        normalName: Joi.string().max(200).required(),
        rootNameId: Joi.string().max(40).required(),
        abbr: Joi.string().min(1).max(50),
        abbrLongNames: Joi.array().items(Joi.string().max(200).required()).max(10),
        popularity: Joi.number().integer().required(),
        countWords: Joi.number().integer().required(),
        endsWithNumber: Joi.boolean(),
        isIrregular: Joi.boolean(),
        isAbbr: Joi.boolean().required(),
        contextNames: Joi.array().items(Joi.string().max(200).required()).max(10),
        knownName: Joi.string().max(200),
        context: Joi.string().max(500),
        createdAt: Joi.number().integer().required(),
        updatedAt: Joi.number().integer().required(),
        expiresAt: Joi.number().integer().required(),
    }
}

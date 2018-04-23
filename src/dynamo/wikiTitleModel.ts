import { DynamoModel } from "./dynamoModel";
import { WikiTitle } from "@textactor/concept-domain";
import { DynamoModelOptions } from "./dynamoModelOptions";
import * as Joi from 'joi';
import { LANG_REG } from "./helpers";
import ms = require('ms');

export class WikiTitleModel extends DynamoModel<WikiTitle, string> {
    constructor(dynamodb?: any) {
        super(OPTIONS, dynamodb);
    }

    protected beforeCreating(data: WikiTitle): WikiTitle {
        const ts = Math.round(Date.now() / 1000);
        data.createdAt = data.createdAt || ts;
        data.lastSearchAt = data.lastSearchAt || ts;

        setExpiresAt(data);

        return data;
    }
}

function setExpiresAt(item: any) {
    item.expiresAt = Math.round((Date.now() + ms('10 days')) / 1000);
}

const OPTIONS: DynamoModelOptions = {
    name: 'textactor:WikiTitle',
    tableName: 'textactor_WikiTitles_v0',
    hashKey: 'id',
    schema: {
        id: Joi.string().min(16).max(40).required(),
        lang: Joi.string().regex(LANG_REG).required(),
        title: Joi.string().min(2).max(500).required(),
        createdAt: Joi.number().integer().required(),
        lastSearchAt: Joi.number().integer().required(),
        expiresAt: Joi.number().integer().required(),
    }
}

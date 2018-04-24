import { Schema, Connection } from "mongoose";
import { LANG_REG } from "../helpers";
import { MongoModel } from "./mongoModel";
import { WikiEntity } from "@textactor/concept-domain";

export class WikiEntityModel extends MongoModel<WikiEntity> {
    constructor(connection: Connection) {
        super(connection.model('WikiEntity', ModelSchema));
    }

    protected transformItem(item: any): WikiEntity {
        const data = super.transformItem(item);

        if (data) {
            if (data.createdAt) {
                data.createdAt = Math.round(new Date(data.createdAt).getTime() / 1000);
            }
        }

        return data;
    }
}

const ModelSchema = new Schema({
    _id: String,
    lang: {
        type: String,
        match: LANG_REG,
        required: true,
        index: true,
    },
    name: {
        type: String,
        minlength: 2,
        maxlength: 200,
        required: true,
    },
    simpleName: {
        type: String,
        minlength: 2,
        maxlength: 200,
    },
    specialName: {
        type: String,
        minlength: 1,
        maxlength: 200,
    },
    nameHash: {
        type: String,
        minlength: 16,
        maxlength: 40,
        required: true,
    },
    names: {
        type: [String],
        required: true,
    },
    namesHashes: {
        type: [String],
        index: true,
        required: true,
    },
    partialNames: {
        type: [String],
        required: true,
    },
    partialNamesHashes: {
        type: [String],
        index: true,
        required: true,
    },
    secondaryNames: {
        type: [String],
    },
    abbr: {
        type: String,
    },
    description: {
        type: String
    },
    aliases: {
        type: [String]
    },
    about: {
        type: String
    },
    wikiDataId: {
        type: String
    },
    wikiPageId: {
        type: Number
    },
    wikiPageTitle: {
        type: String
    },
    type: {
        type: String
    },
    types: {
        type: [String]
    },
    countryCode: {
        type: String
    },
    rank: {
        type: Number
    },
    categories: {
        type: [String]
    },
    data: {
        type: Schema.Types.Mixed
    },
    lastname: {
        type: String,
        index: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        expires: '15 days',
    },
}, {
        collection: 'textactor_wikientities'
    });

ModelSchema.set('toObject', {
    getters: true
});
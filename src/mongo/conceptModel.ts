import { Schema, Connection } from "mongoose";
import { LANG_REG, COUNTRY_REG } from "../helpers";
import { MongoModel } from "./mongoModel";
import { Concept } from "@textactor/concept-domain";

export class ConceptModel extends MongoModel<Concept> {
    constructor(connection: Connection) {
        super(connection.model('Concept', ModelSchema));
    }

    protected transformItem(item: any): Concept {
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
    country: {
        type: String,
        match: COUNTRY_REG,
        required: true,
        index: true,
    },
    name: {
        type: String,
        minlength: 2,
        maxlength: 200,
        required: true,
    },
    knownName: {
        type: String,
        minlength: 2,
        maxlength: 200,
    },
    nameLength: {
        type: Number,
        required: true,
    },
    normalName: {
        type: String,
        minlength: 2,
        maxlength: 200,
        required: true,
    },
    nameHash: {
        type: String,
        minlength: 16,
        maxlength: 40,
        required: true,
    },
    rootNameId: {
        type: String,
        minlength: 16,
        maxlength: 40,
        required: true,
        index: true,
    },
    abbr: {
        type: String,
        index: true,
    },
    abbrLongNames: [String],
    contextNames: [String],
    popularity: {
        type: Number,
        required: true,
        index: true,
    },
    countWords: {
        type: Number,
        required: true,
        index: true,
    },
    isAbbr: {
        type: Boolean,
        required: true,
        index: true,
    },
    endsWithNumber: {
        type: Boolean,
        required: true,
    },
    isIrregular: {
        type: Boolean,
        required: true,
    },
    context: {
        type: String,
        maxlength: 500,
    },

    createdAt: {
        type: Number,
        default: Date.now,
        required: true,
        expires: '15 days',
    },
}, {
        collection: 'textactor_concepts'
    });

ModelSchema.set('toObject', {
    getters: true
});

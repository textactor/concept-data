import { Schema, Connection } from "mongoose";
import { LANG_REG, COUNTRY_REG } from "../helpers";
import { MongoModel } from "./mongoModel";
import { RootName } from "@textactor/concept-domain";

export class ConceptRootNameModel extends MongoModel<RootName> {
    constructor(connection: Connection) {
        super(connection.model('ConceptRootName', ModelSchema));
    }

    protected transformItem(item: any): RootName {
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
        trim: true,
        minlength: 2,
        maxlength: 500,
        required: true,
    },
    rootName: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 500,
        required: true,
    },
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

    createdAt: {
        type: Number,
        default: Date.now,
        required: true,
        expires: '15 days',
    },
}, {
        collection: 'textactor_conceptRootNames'
    });

ModelSchema.set('toObject', {
    getters: true
});

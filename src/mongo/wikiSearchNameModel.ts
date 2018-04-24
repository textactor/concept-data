import { Schema, Connection } from "mongoose";
import { LANG_REG, COUNTRY_REG } from "../helpers";
import { MongoModel } from "./mongoModel";
import { WikiSearchName } from "@textactor/concept-domain";

export class WikiSearchNameModel extends MongoModel<WikiSearchName> {
    constructor(connection: Connection) {
        super(connection.model('WikiSearchName', ModelSchema));
    }

    protected transformItem(item: any): WikiSearchName {
        const data = super.transformItem(item);

        if (data) {
            if (data.createdAt) {
                data.createdAt = Math.round(new Date(data.createdAt).getTime() / 1000);
            }
            if (data.lastSearchAt) {
                data.lastSearchAt = Math.round(new Date(data.lastSearchAt).getTime() / 1000);
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
    },
    country: {
        type: String,
        match: COUNTRY_REG,
        required: true,
    },
    name: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 500,
        required: true,
    },

    foundTitles: {
        type: [String],
        max: 50,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        expires: '10 days',
    },
    lastSearchAt: {
        type: Date,
        default: Date.now,
        required: true
    },
}, {
        collection: 'textactor_wikiSearchName'
    });

ModelSchema.set('toObject', {
    getters: true
});

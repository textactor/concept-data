import { Schema, Connection } from "mongoose";
import { LANG_REG } from "../helpers";
import { MongoModel } from "./mongoModel";
import { WikiTitle } from "@textactor/concept-domain";

export class WikiTitleModel extends MongoModel<WikiTitle> {
    constructor(connection: Connection) {
        super(connection.model('WikiTitle', ModelSchema));
    }

    protected transformItem(item: any): WikiTitle {
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
    title: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 500,
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
        collection: 'textactor_wikiTitles'
    });

ModelSchema.set('toObject', {
    getters: true
});

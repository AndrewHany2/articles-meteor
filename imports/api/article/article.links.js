import { Field } from "formik";
import { Articles } from "./article";
import { Comments } from "../comment/comment";

Articles.collection.addLinks({
    'user': {
        type: 'one',
        collection: Meteor.users,
        field: 'createdById'
    }
});

Articles.collection.addLinks({
    comments: {
        type: 'many',
        collection: Comments.collection,
        field: 'articleId',
        metadata: true
    },
});
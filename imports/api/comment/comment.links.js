import { Articles } from "../article/article";
import { Comments } from "./comment";

Comments.collection.addLinks({
    'article': {
        type: 'one',
        collection: Articles.collection,
        field: 'articleId'
    }
});

// Comments.collection.addLinks({
//     'user': {
//         type: 'one',
//         collection: Meteor.user,
//         field: 'createdById'
//     }
// });

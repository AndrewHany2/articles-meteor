import { Articles } from "./article";

Articles.collection.addReducers({
    commentCount: {
        body: {
            count: {
                $sum: 1
            }
        },
        reduce(obj) {
            return Comments.collection.find({ articleId: obj._id }).count();
        }
    },
});
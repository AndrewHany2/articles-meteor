import { Articles } from "./article";
import { Comments } from "../comment/comment"
Articles.collection.addReducers({
    commentCount: {
        body: {
            _id: 1
        },
        reduce(obj) {
            const count = Comments.collection.find({ articleId: obj._id }).count();
            return count;
        }
    },
});
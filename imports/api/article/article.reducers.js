import { Articles } from "./article";

Articles.collection.addReducers({
    commentCount: {
        body: {
            count: {
                $sum: 1
            }
        },
        reduce(object) {
            return object.count;
        },
    },
});
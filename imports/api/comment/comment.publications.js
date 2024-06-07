import { Comments } from "./comment";

Meteor.publish('comments', async function publishComments(articleId) {
    const comments = Comments.collection.find({ articleId }, { sort: { createdAt: 1 } });
    const userIds = comments.map(comment => comment.createdById);
    const users = Meteor.users.find({ _id: { $in: userIds } }, { fields: { profile: 1 } });
    return [
        comments,
        users,
    ];
});
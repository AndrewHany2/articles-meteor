import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Comments } from './comment';

Meteor.methods({
    addComment(comment) {
        const { text, articleId } = comment;
        check(text, String);
        check(articleId, String);
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        const newComment = Comments.collection.insert({
            text,
            articleId,
            createdById: this.userId,
        });
        return newComment;
    }
});
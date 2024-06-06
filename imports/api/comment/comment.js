import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/**
 * The CommentsCollection. It encapsulates state and variable values for article.
 */
class CommentsCollection {
    constructor () {
        // The name of this collection.
        this.name = 'comments';
        // Define the Mongo collection.
        this.collection = new Mongo.Collection(this.name);
        // Define the structure of each document in the collection.
        this.schema = new SimpleSchema({
            text: String,
            articleId: String,
            createdOn: {
                type: Date,
                autoValue() {
                    if (this.isInsert) {
                        return new Date();
                    } else if (this.isUpsert) {
                        return { $setOnInsert: new Date() };
                    } else {
                        this.unset();  // Prevent user from supplying their own value
                    }
                },
            },
            createdById: String
        });
        // Attach the schema to the collection, so all attempts to insert a document are checked against schema.
        this.collection.attachSchema(this.schema);
        // Define names for publications and subscriptions
        this.userPublicationName = `${this.name}.publication.user`;
        this.adminPublicationName = `${this.name}.publication.admin`;
    }
}

/**
 * The singleton instance of the CommentsCollection.
 * @type {CommentsCollection}
 */
export const Comments = new CommentsCollection();

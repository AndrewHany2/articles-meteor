import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Articles } from './article';
import { createQuery } from 'meteor/cultofcoders:grapher';

Meteor.methods({
    addArticle(article) {
        const { title, description } = article;
        check(title, String);
        check(description, String);

        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        const newArticle = Articles.collection.insert({
            title,
            description,
            createdById: this.userId,
        });
        return newArticle;
    },
    async getArticles({ page, limit, searchQuery }) {
        // const aggregation = [
        //     {
        //         $sort: { "createdOn": -1 }
        //     },
        //     {
        //         $facet: {
        //             metadata: [{ $count: 'totalCount' }],
        //             data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        //         },
        //     },
        // ];
        // if (searchQuery !== '') {
        //     aggregation.unshift({
        //         $match: {
        //             $or: [
        //                 { title: { $regex: searchQuery, $options: 'i' } },
        //                 { description: { $regex: searchQuery, $options: 'i' } },
        //                 // Add more fields as needed
        //             ]
        //         }
        //     },);
        // }
        // const articles = await Articles.collection.rawCollection().aggregate(aggregation).toArray();
        // return articles;
        const articlesQuery = createQuery({
            text: 1,
            description: 1,
            user: {
                profile: 1 // Assuming the user's name is stored in the profile field
            },
        });
        const articles = articlesQuery.fetch();
        return articles;
    },
    async getArticleDetails(id) {
        const article = await Articles.collection.rawCollection().aggregate([
            { $match: { _id: id } },
            {
                $lookup:
                {
                    from: "users",
                    localField: "createdById",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind:
                {
                    path: "$user",
                    includeArrayIndex: "string",
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $project:
                {
                    title: 1,
                    description: 1,
                    createdOn: 1,
                    userName: "$user.profile"
                }
            }
        ]).toArray();
        return article[0];
    },
    async getMyArticles({ page, limit, searchQuery }) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        const aggregation = [
            {
                $match: {
                    createdById: this.userId
                }
            },
            {
                $sort: { "createdOn": -1 }
            },
            {
                $facet: {
                    metadata: [{ $count: 'totalCount' }],
                    data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                },
            },
        ];
        if (searchQuery !== '') {
            aggregation.unshift({
                $match: {
                    $or: [
                        { title: { $regex: searchQuery, $options: 'i' } },
                        { description: { $regex: searchQuery, $options: 'i' } },
                        // Add more fields as needed
                    ]
                }
            },);
        }
        const articles = await Articles.collection.rawCollection().aggregate(aggregation).toArray();
        return articles;
    },
    editArticle(article) {
        const { title, description, _id } = article;
        check(title, String);
        check(description, String);
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        return Articles.collection.update(_id, { $set: { title, description } });
    },
});
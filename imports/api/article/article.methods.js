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
    async getArticles({ page, limit, searchInput }) {
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
        // return { totalCount: articles[0].metadata[0].totalCount, docs: articles[0].data };
        const queryWithPagination = {
            $options: {
                sort: { createdOn: -1 },
                limit: limit,
                skip: (page - 1) * limit
            },
            // $paginate: true,
            title: 1,
            description: 1,
            user: {
                username: 1,
                profile: 1
            },
            commentCount: 1,
            createdOn: 1
        };
        if (searchInput !== '') {
            queryWithPagination.$filters = {
                $or: [
                    { title: { $regex: searchInput, $options: 'i' } },
                    { description: { $regex: searchInput, $options: 'i' } },
                    // Add more fields as needed
                ]
            }
        }
        const articlesQuery = Articles.collection.createQuery(queryWithPagination);
        const totalCount = articlesQuery.getCount();
        const articles = articlesQuery.fetch();
        return { totalCount, docs: articles };
    },
    async getArticleDetails(id) {
        // const article = await Articles.collection.rawCollection().aggregate([
        //     { $match: { _id: id } },
        //     {
        //         $lookup:
        //         {
        //             from: "users",
        //             localField: "createdById",
        //             foreignField: "_id",
        //             as: "user"
        //         }
        //     },
        //     {
        //         $unwind:
        //         {
        //             path: "$user",
        //             includeArrayIndex: "string",
        //             preserveNullAndEmptyArrays: false
        //         }
        //     },
        //     {
        //         $project:
        //         {
        //             title: 1,
        //             description: 1,
        //             createdOn: 1,
        //             userName: "$user.profile"
        //         }
        //     }
        // ]).toArray();
        // return article[0];
        const articleQuery = await Articles.collection.createQuery({
            $filters: {
                _id: id
            },
            title: 1,
            description: 1,
            createdOn: 1,
            user: {
                username: 1,
                profile: 1
            }
        });
        const article = articleQuery.fetchOne();
        return article;
    },
    async getMyArticles({ page, limit, searchQuery }) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        // const aggregation = [
        //     {
        //         $match: {
        //             createdById: this.userId
        //         }
        //     },
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
        const queryWithPagination = {
            $filters: {
                createdById: this.userId
            },
            $options: {
                sort: { createdOn: -1 },
                limit: limit,
                skip: (page - 1) * limit
            },
            // $paginate: true,
            title: 1,
            description: 1,
            user: {
                username: 1,
                profile: 1
            },
            createdOn: 1
        };
        if (searchQuery !== '') {
            queryWithPagination.$filters = {
                ...queryWithPagination.$filters,
                $or: [
                    { title: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } },
                    // Add more fields as needed
                ]
            }
        }
        const articlesQuery = Articles.collection.createQuery(queryWithPagination);
        const totalCount = articlesQuery.getCount();
        const articles = articlesQuery.fetch();
        return { totalCount, docs: articles };
    },
    editArticle(article) {
        const { title, description, id } = article;
        check(title, String);
        check(description, String);
        check(id, String);
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        return Articles.collection.update({ _id: id, createdById: this.userId }, { $set: { title, description } });
    },
});
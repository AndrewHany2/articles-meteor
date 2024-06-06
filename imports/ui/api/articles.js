// client/api/articles.js
import { Meteor } from 'meteor/meteor';

export const fetchArticles = async ({ page, limit, searchQuery }) => {
    return new Promise((resolve, reject) => {
        Meteor.call('getArticles', { page, limit, searchQuery }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

// client/hooks/useArticles.js
import { useQuery } from '@tanstack/react-query';
import { fetchArticles } from '../api/articles';

const useArticles = ({ page, limit, searchQuery }) => {
    return useQuery(['articles', page, limit, searchQuery], () => fetchArticles({ page, limit, searchQuery }), {
        keepPreviousData: true,
    });
};

export default useArticles;

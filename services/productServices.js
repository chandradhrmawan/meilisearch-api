import { meilisearchRequest } from "../helper/utils.js";

const searchDocumentsService = async ({
  hitsPerPage = 20,
  page = 1,
  keyword = "",
  sort = ['_rankingScore:desc'],
  filter = [],
  priceRange,
}) => {
  const priceMin = priceRange?.min || 0;
  const priceMax = priceRange?.max || 30000;

  const searchOptions = {
    q: keyword || '',
    hitsPerPage: hitsPerPage,
    page: page,
    facets: [
      'gender',
      'masterCategory',
      'subCategory',
      'baseColour',
      'price'
    ],
    showRankingScore: true,
    rankingScoreThreshold: 0.5,
    sort,
    filter: [
      ...filter,
      `price >= ${priceMin} AND price <= ${priceMax}`
    ]
  };

  const searchResults = await meilisearchRequest({
    endpoint: `/indexes/product/search`,
    method: 'POST',
    data: searchOptions,
  });

  return searchResults;

}
export {
  searchDocumentsService
}
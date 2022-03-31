import { PaginatedResult } from './types';

const paginate = (sourceData: any[], page: number, limit: number): PaginatedResult<any> => {
  const totalDocuments = sourceData.length;
  const totalPages = Math.ceil(totalDocuments / limit);
  const currentPage = page;
  const nextPage = page + 1 <= totalPages ? page + 1 : null;
  const prevPage = page - 1 > 0 ? page - 1 : null;

  const start = (page - 1) * limit;
  const end = limit * page;

  const data = sourceData.slice(start, end);

  return {
    totalDocuments,
    totalPages,
    currentPage,
    nextPage,
    prevPage,
    data,
  };
};

export default paginate;

export const PAGINATION_LIMIT = 20;
export function buildPagination(page: number, size: number) {
  const start = (page - 1) * size;

  return { start, end: (start + size) - 1 };
}

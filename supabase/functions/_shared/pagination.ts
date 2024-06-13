export const PAGINATION_LIMIT = 15;
export function buildPagination(page: number, size: number) {
  const start = (page - 1) * size;

  return { start, end: (start + size) - 1 };
}

export function getPaginationOutput(
  pageSize: number,
  toatalResults: number = 50,
) {
  const divResult = toatalResults / pageSize;
  const wholeUnits = Math.trunc(divResult);
  const fractionalPart = divResult - wholeUnits;
  const nextWhole = fractionalPart > 0 ? 1 : 0;
  const totalPages = wholeUnits + nextWhole;

  return { total_pages: totalPages, total_results: toatalResults };
}

export class PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  totalCount: number;

  constructor(data: T[], page: number, limit: number, totalCount: number) {
    this.data = data;
    this.page = page;
    this.limit = limit;
    this.totalCount = totalCount;
  }
}

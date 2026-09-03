export type ApiStatus = "SUCCESS" | "ERROR";

export interface ApiPagination {
  limit?: number;
  lastEvaluatedKey?: string;
}

export interface ApiMeta {
  timestamp: string;
  apiVersion: string;
  pagination?: ApiPagination;
}

export interface ApiResponse<T> {
  status: ApiStatus;
  data: T | null;
  meta: ApiMeta;
}

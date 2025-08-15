export interface OptimizelySearchRequest {
  per_page?: number;
  page?: number;
  query: string;
  project_id: number[];
  type?: string[];
  type_expand?: string;
  expand?: string[];
  archived?: boolean;
  fullsearch?: boolean;
  status?: string[];
  sort?: string;
  order?: string;
  environment_key?: string;
  audience_id?: number[];
}

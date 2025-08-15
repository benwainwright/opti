export interface OptimizelyChangesRequest {
  project_id: number;
  id?: number[];
  start_time?: Date;
  end_time?: Date;
  user?: string[];
  entity_type?: string[];
  source?: string;
  entity?: string[];
  per_page?: number;
  page?: number;
}

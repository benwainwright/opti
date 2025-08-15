import { OptimizelyEntityType } from "./optimizely-entity-type.ts";

export interface OptimizelySearchResponse {
  archived?: boolean;
  audience_id?: number[];
  campaign_type?: string;
  created?: string;
  description?: string;
  enabled?: boolean;
  environment_key?: string;
  feature_key?: string;
  feature_name?: string;
  flag_key?: string;
  group_id?: number;
  id?: number;
  key?: string;
  last_modified?: string;
  name?: string;
  project_id?: number;
  project_name?: string;
  rule_type?: string;
  ruleset_enabled?: boolean;
  status?: string;
  type?: OptimizelyEntityType;
}

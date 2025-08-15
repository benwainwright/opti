import { OptimizelyEnvironmentStatus } from "./optimizely-environment-status";
import { OptimizelyExperimentChange } from "./optimizely-experiment-change";
import { OptimizelyMetric } from "./optimizely-metrics";
import { OptimizelySchedule } from "./optimizely-schedule";
import { OptimizelyUrlTargeting } from "./optimizely-url-targeting";

export interface OptimizelyExperiment {
  allocation_policy: string;
  audience_conditions?: string; // defaults to “everyone” if omitted
  campaign_id?: number;
  changes?: OptimizelyExperimentChange[];
  created?: string; // ISO date‐time
  description?: string;
  earliest?: string; // ISO date‐time
  environments?: Record<string, OptimizelyEnvironmentStatus>;
  feature_id?: number;
  feature_key?: string;
  feature_name?: string;
  holdback?: number; // 0–10000
  id: number;
  is_classic?: boolean;
  key?: string;
  last_modified?: string; // ISO date‐time
  latest?: string; // ISO date‐time (paused time)
  metrics?: OptimizelyMetric[];
  multivariate_traffic_policy?: "full_factorial";
  name?: string;
  page_ids?: number[];
  project_id: number;
  results_token?: string;
  schedule?: OptimizelySchedule;
  traffic_allocation?: number; // 0–10000
  type?:
    | "a/b"
    | "feature"
    | "multivariate"
    | "personalization"
    | "multiarmed_bandit";
  url_targeting?: OptimizelyUrlTargeting;
}

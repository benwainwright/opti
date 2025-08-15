import { OptimizelyChange } from "./optimizely-change.ts";
import { OptimizelyChangeType } from "./optimizely-change-type.ts";
import { OptimizelyEntity } from "./optimizely-entity.ts";
import { OptimizelyUser } from "./optimizely-user.ts";

export interface OptimizelyChangeList {
  change_type?: OptimizelyChangeType;
  changes?: OptimizelyChange[];
  created?: string;
  entity?: OptimizelyEntity;
  id?: number;
  project_id: number;
  source?: string;
  summary?: string;
  user: OptimizelyUser;
}

import { OptimizelyFlag } from "./optimizely-flag";

export interface OptimizelyFlagsResponse {
  total_count?: number;
  items: OptimizelyFlag[];
}

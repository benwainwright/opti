import { OptimizelyFlag } from "./optimizely-flag.ts";

export interface OptimizelyFlagsResponse {
  total_count?: number;
  items: OptimizelyFlag[];
}

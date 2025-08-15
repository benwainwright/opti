import { OptimizelyChange } from "./optimizely-change.ts";
import { WhitelistEntry } from "./optimizely-whitelist-entry.ts";

export interface OptimizelyVariation {
  variation_id?: number;
  id?: number; // alternative numeric ID
  key?: string;
  name?: string;
  description?: string;
  page_id?: number;
  share_link?: string;
  archived?: boolean;
  feature_enabled?: boolean;
  status?: "active" | "paused" | "archived";
  weight: number; // 0–10000
  variable_values?: Record<string, any>;
  whitelist?: WhitelistEntry[];
  actions?: {
    changes: OptimizelyChange[];
  }[];
}

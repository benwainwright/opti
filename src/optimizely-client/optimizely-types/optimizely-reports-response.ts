import type { OptimizelyReport } from "./optimizely-report.ts";

export interface OptimizelyReportsResponse {
  count: number;
  page: number;
  total_count: number;
  total_pages: number;
  items: OptimizelyReport[];
  url?: string;
  first_url?: string;
  last_url?: string;
  next_url?: string[];
  prev_url?: string[];
  reset_url?: string;
  sort_url?: string;
  filter_url?: string;
  fetch_report_url?: string;
}

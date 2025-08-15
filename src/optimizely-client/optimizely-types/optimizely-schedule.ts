export interface OptimizelySchedule {
  status:
    | "running"
    | "paused"
    | "archived"
    | "campaign_paused"
    | "concluded"
    | "not_started";
}

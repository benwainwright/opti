export interface OptimizelyMetric {
  aggregator: "unique" | "count" | "sum" | "bounce" | "exit" | "ratio";
  event_id?: number | null;
  event_type?: "custom" | "click" | "pageview";
  field?: "revenue" | "value" | null;
  scope?: "session" | "visitor" | "event";
  time_window?: string; // e.g. "48h", "7d"
  winning_direction?: "increasing" | "decreasing";

  metrics?: OptimizelyRatioMetric[];
  event_properties?: Record<string, unknown>;
}

export interface OptimizelyRatioMetric {
  aggregator: "unique" | "count" | "sum" | "bounce" | "exit" | "ratio";
  event_id?: number | null;
  event_type?: "custom" | "click" | "pageview";
  field?: "revenue" | "value" | null;
  scope?: "session" | "visitor" | "event";
}

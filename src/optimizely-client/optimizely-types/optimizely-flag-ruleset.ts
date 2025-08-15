export interface OptimizelyRule {
  id: number;
  key: string;
  type: string;
  disabled?: boolean;
}

export interface OptimizelyFlagRuleset {
  environment_key: string;
  flag_key: string;
  project_id: number;
  rules: OptimizelyRule[];
  last_modified?: string;
}

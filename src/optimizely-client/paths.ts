import type {
  OptimizelyFlag,
  OptimizelyFlagsResponse,
  OptimizelyFlagRuleset,
  OptimizelyRule,
} from "./optimizely-types/index.ts";

export interface Paths {
  "projects/:project_id:/flags": {
    version: "flags/v1";
    method: "GET";
    params: {
      per_page?: number;
      page_number?: number;
      project_id: number;
      page_token?: number;
      page_window?: number;
      sort?: string[];
      archived?: boolean;
      enabled?: boolean;
      rule_status?: string[];
      environment_status?: string[];
      environment_type?: string[];
      environment?: string[];
      rule_type?: string[];
      query?: string;
      key_list?: string[];
    };
    returnValue: OptimizelyFlagsResponse;
  };
  "projects/:project_id:/flags/:flag_key:": {
    version: "flags/v1";
    method: "GET";
    params: { project_id: number; flag_key: string };
    returnValue: OptimizelyFlag;
  };
  "projects/:project_id:/flags/:flag_key:/rulesets/:environment_key:": {
    version: "flags/v1";
    method: "GET";
    params: {
      project_id: number;
      flag_key: string;
      environment_key: string;
    };
    returnValue: OptimizelyFlagRuleset;
  };
  "projects/:project_id:/flags/:flag_key:/rulesets/:environment_key:/rules": {
    version: "flags/v1";
    method: "GET";
    params: {
      project_id: number;
      flag_key: string;
      environment_key: string;
      page_number?: number;
      per_page?: number;
    };
    returnValue: { items: OptimizelyRule[] };
  };
  "projects/:project_id:/flags/:flag_key:/changes": {
    version: "flags/v1";
    method: "GET";
    params: {
      project_id: number;
      flag_key: string;
      page_number?: number;
      per_page?: number;
    };
    returnValue: { items: unknown[] };
  };
}

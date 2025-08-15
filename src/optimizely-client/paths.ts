import type {
  OptimizelyFlag,
  OptimizelyFlagRuleset,
  OptimizelyEnvironment,
  OptimizelyReport,
  OptimizelyChangeHistory,
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
    returnValue: OptimizelyFlag[];
  };
  "projects/:project_id:/flags/:flag_key:": {
    version: "flags/v1";
    method: "GET";
    params: { project_id: number; flag_key: string };
    returnValue: OptimizelyFlag;
  };
  "projects/:project_id:/flags/:flag_id:/entities": {
    version: "flags/v1";
    method: "GET";
    params: { project_id: number; flag_id: number };
    returnValue: OptimizelyChangeHistory[];
  };
  "projects/:project_id:/flags/:flag_key:/environments/:environment_key:/ruleset": {
    version: "flags/v1";
    method: "GET";
    params: {
      project_id: number;
      flag_key: string;
      environment_key: string;
    };
    returnValue: OptimizelyFlagRuleset;
  };
  "projects/:project_id:/environments": {
    version: "flags/v1";
    method: "GET";
    params: {
      project_id: number;
      per_page?: number;
      page_token?: string;
      page_window?: number;
      archived?: boolean;
      sort?: string[];
    };
    returnValue: OptimizelyEnvironment[];
  };
  "projects/:project_id:/environments/:environment_key:/reports": {
    version: "flags/v1";
    method: "GET";
    params: {
      project_id: number;
      environment_key: string;
      per_page?: number;
      page_token?: string;
      page_window?: number;
      archived?: boolean;
      filter?: string;
      sort?: string[];
      query?: string;
      flag_key?: string;
      type?: string;
      rule_state?: string;
      start_date?: string;
      end_date?: string;
    };
    returnValue: OptimizelyReport[];
  };
  "projects/:project_id:/environments/:environment_key:/reports/:report_key:": {
    version: "flags/v1";
    method: "GET";
    params: {
      project_id: number;
      environment_key: string;
      report_key: string;
    };
    returnValue: OptimizelyReport;
  };
}

export interface OptimizelyExperimentChange {
  id: string; // uuid
  name: string;
  type: string; // e.g. "custom_css", "custom_code", …
  async?: boolean;
  selector?: string;
  value?: string;
  src?: string;
  dependencies?: string[]; // array of uuids

  // redirect‐specific
  allow_additional_redirect?: boolean;
  preserve_parameters?: boolean;
  destination?: string;
  destination_function?: string;

  // extension
  extension_id?: string;

  // insert_html / insert_image
  operator?: string;
  rearrange?: object;

  // attribute changes
  attributes?: Record<string, unknown>;

  // for custom extensions / CSS configs
  config?: object;
  css?: object;
}

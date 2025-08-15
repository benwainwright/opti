export interface OptimizelyWebSnippet {
  /** The current revision number of the Project snippet */
  codeRevision: number;
  /** Enables the option to force yourself into a specific variation on any page */
  enableForceVariation: boolean;
  /** Remove paused and draft Experiments from the snippet if true */
  excludeDisabledExperiments: boolean;
  /** Mask descriptive names if true */
  excludeNames: boolean;
  /** Include jQuery in your snippet if true */
  includeJquery: boolean;
  /** Change the last octet of IP addresses to 0 prior to logging if true */
  ipAnonymization: boolean;
  /** Regex for IP addresses to filter out visitors */
  ipFilter?: string;
  /** The current size in bytes of the Project snippet */
  jsFileSize: number;
  /** The preferred jQuery library version, or 'none' */
  library:
    | "jquery-1.11.3-trim"
    | "jquery-1.11.3-full"
    | "jquery-1.6.4-trim"
    | "jquery-1.6.4-full"
    | "none";
}

import { OptimizelyWebSnippet } from "./optimizely-web-snippet";

export interface OptimizelyProject {
  /** The account the Project is associated with */
  accountId: number;
  /** The significance level at which to declare winning/losing variations (0.5–1.0) */
  confidenceThreshold: number;
  /** ISO timestamp when the Project was created */
  created: string;
  /** The ID of a Dynamic Customer Profile Service associated with this Project */
  dcpServiceId: number;
  /** A short description of the Project */
  description?: string;
  /** The unique identifier for the Project */
  id: number;
  /**
   * True if the project is Optimizely Classic only.
   * (v2 API only supports Optimizely X; v1 must be used if classic)
   */
  isClassic: boolean;
  /** True if Flags-First UX is enabled (uses the Flags API) */
  isFlagsEnabled: boolean;
  /** ISO timestamp when the Project was last modified */
  lastModified: string;
  /** The name of the Project */
  name: string;
  /** Platform of the Project (defaults to 'web') */
  platform: "web" | "ios" | "android" | "custom";
  /** SDK languages for Full Stack, Mobile, and OTT projects */
  sdks?: string[];
  /** Token used to identify your mobile app to Optimizely (mobile only) */
  socketToken?: string;
  /** Current status of the Project (defaults to 'active') */
  status: "active" | "archived";
  /**
   * Third-party platform integration (e.g., 'salesforce'),
   * or null if none.
   */
  thirdPartyPlatform?: "salesforce" | null;
  /** Configuration for the web snippet */
  webSnippet: OptimizelyWebSnippet;
  /** Custom JavaScript to run before Optimizely on all pages */
  projectJavascript?: string;
  /** (BETA) Name of the identifier that locates the visitor id */
  visitorIdLocatorName?: string | null;
  /** (BETA) Type of identifier where visitor id is located */
  visitorIdLocatorType?: "cookie" | "query" | "localStorage" | "js" | null;
}

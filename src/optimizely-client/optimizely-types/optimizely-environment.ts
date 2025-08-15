export interface OptimizelyEnvironment {
  readonly id: number;
  readonly key: string;
  readonly name: string;
  readonly archived: boolean;
  readonly priority: number;
  readonly project_id: number;
  readonly account_id?: number;
  readonly revision?: number;
  readonly role?: string;
}

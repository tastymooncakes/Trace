import { DrawingAction } from "./Action";

export interface CustomCommit {
  sourceAssets?: Array<{
    nid: string;
    ipfsUrl: string;
  }>;
  actionLog?: {
    actions: DrawingAction[];
    actionCount: number;
    checkpointType: "iteration" | "final";
  };
  appVersion?: string;
  provenanceType?: string;
  [key: string]: unknown;
}

export interface SourceAsset {
  nid: string;
  ipfsUrl: string;
}

export interface CompletedWork {
  nid: string;
  timestamp: string;
  imageData?: string;
  sourceAssets: SourceAsset[];
  iterationCount: number;
}
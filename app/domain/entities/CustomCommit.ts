export interface SourceAssetReference {
  nid: string;
  ipfsUrl: string;
}

export interface CustomCommit {
  sourceAssets?: SourceAssetReference[];
  assetType?: string;
  iterationCount?: number;
}
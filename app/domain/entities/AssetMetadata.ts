export interface AssetMetadata {
  proof: {
    timestamp: string;
    mimeType: string;
    hash?: string;
  };
  information: {
    type: 'drawing' | 'catalog';
    description: string;
    source: string;
  };
}
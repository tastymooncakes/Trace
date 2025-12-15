import { AssetMetadata, CustomCommit, Drawing, Registration } from "../entities";

export interface INumbersClient {
  registerAsset(blob: Blob, metadata: AssetMetadata, nitCommitCustom?: CustomCommit): Promise<string>;
}

export async function registerDrawing(
  drawing: Drawing,
  blob: Blob,
  numbersClient: INumbersClient
): Promise<Registration> {
  const metadata: AssetMetadata = {
    proof: {
      timestamp: drawing.timestamp,
      mimeType: 'image/png',
    },
    information: {
      type: 'drawing',
      description: 'Digital drawing with C2PA credentials',
      source: 'C2PA Drawing App',
    },
  };

  const nid = await numbersClient.registerAsset(blob, metadata);

  return {
    nid,
    timestamp: new Date().toISOString(),
    imageData: drawing.imageData,
  };
}
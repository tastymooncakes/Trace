import { AssetMetadata, CustomCommit } from "@/app/domain/entities";
import { INumbersClient } from "@/app/domain/use-cases/registerDrawing";

export class NumbersProtocolClient implements INumbersClient {
  private captureToken: string;

  constructor(captureToken: string) {
    if (!captureToken) {
      throw new Error('Capture token is required');
    }
    this.captureToken = captureToken;
  }

  async registerAsset(
    blob: Blob,
    metadata: AssetMetadata,
    nitCommitCustom?: CustomCommit
  ): Promise<string> {
    const formData = new FormData();
    formData.append('asset_file', blob, `drawing-${Date.now()}.png`);
    formData.append('meta', JSON.stringify(metadata));
    formData.append('caption', metadata.information.description);
    formData.append('abstract', 'Drawing Registration');
    
    if (nitCommitCustom) {
      formData.append('nit_commit_custom', JSON.stringify(nitCommitCustom));
    }

    const response = await fetch('https://api.numbersprotocol.io/api/v3/assets/', {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.captureToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();
    return data.nid || data.cid || data.id;
  }
}
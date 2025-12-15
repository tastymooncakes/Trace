import { AssetMetadata, Registration } from "@/app/domain/entities";
import { CompletedWork } from "@/app/domain/entities/CompletedWork";

interface RegisterResponse {
  success: boolean;
  nid: string;
  timestamp: string;
}

export class RegistrationService {
  static async registerDrawing(
    blob: Blob,
    imageDataUrl: string
  ): Promise<Registration> {
    const metadata: AssetMetadata = {
      proof: {
        timestamp: new Date().toISOString(),
        mimeType: 'image/png',
      },
      information: {
        type: 'drawing',
        description: 'Digital drawing with C2PA credentials',
        source: 'C2PA Drawing App',
      },
    };

    const formData = new FormData();
    formData.append('file', blob, `drawing-${Date.now()}.png`);
    formData.append('metadata', JSON.stringify(metadata));

    const response = await fetch('/api/register', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data: RegisterResponse = await response.json();

    return {
      nid: data.nid,
      timestamp: data.timestamp,
      imageData: imageDataUrl,
    };
  }

  static async registerFinalComposite(
    blob: Blob,
    imageDataUrl: string,
    sourceRegistrations: Registration[]
  ): Promise<CompletedWork> {
    const metadata: AssetMetadata = {
      proof: {
        timestamp: new Date().toISOString(),
        mimeType: 'image/png',
      },
      information: {
        type: 'drawing',
        description: 'Final composite drawing with source provenance',
        source: 'C2PA Drawing App',
      },
    };

    // Build source assets with IPFS URLs
    const sourceAssets = sourceRegistrations.map(reg => ({
      nid: reg.nid,
      ipfsUrl: `https://ipfs-pin.numbersprotocol.io/ipfs/${reg.nid}`
    }));

    const customCommit = {
      sourceAssets,
      assetType: 'final_composite',
      iterationCount: sourceRegistrations.length
    };

    const formData = new FormData();
    formData.append('file', blob, `final-composite-${Date.now()}.png`);
    formData.append('metadata', JSON.stringify(metadata));
    formData.append('nit_commit_custom', JSON.stringify(customCommit));

    const response = await fetch('/api/register', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Final composite registration failed');
    }

    const data: RegisterResponse = await response.json();

    return {
      nid: data.nid,
      timestamp: data.timestamp,
      imageData: imageDataUrl,
      sourceAssets,
      iterationCount: sourceRegistrations.length,
    };
  }
}
import {
  Registration,
  AssetMetadata,
  CustomCommit,
  CompletedWork,
} from "@/app/domain/entities";
import { actionLogger } from "../db/actionLogger";

export class RegistrationService {
  static async registerDrawing(
    blob: Blob,
    dataUrl: string
  ): Promise<Registration> {
    const actionsSinceCheckpoint =
      await actionLogger.getActionsSinceLastCheckpoint();

    const metadata: AssetMetadata = {
      proof: {
        timestamp: new Date().toISOString(),
        mimeType: "image/png",
      },
      information: {
        type: "drawing",
        description: "Drawing checkpoint",
        source: "Trace App",
      },
    };

    const customCommit: CustomCommit = {
      // Summary fields (more likely to be preserved)
      traceActionCount: actionsSinceCheckpoint.length,
      traceCheckpointType: "iteration",
      traceAppVersion: "1.0.0",
      traceProvenanceType: "creative-process",

      // Full action log with unique prefix
      traceActionLog: JSON.stringify(actionsSinceCheckpoint),
    };

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("metadata", JSON.stringify(metadata));
    formData.append("nit_commit_custom", JSON.stringify(customCommit));

    const response = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    const data = await response.json();

    await actionLogger.addCheckpoint(data.nid, dataUrl);

    return {
      nid: data.nid,
      timestamp: data.timestamp,
      imageData: dataUrl,
    };
  }

  static async registerFinalComposite(
    blob: Blob,
    dataUrl: string,
    sourceIterations: Registration[]
  ): Promise<CompletedWork> {
    const allActions = await actionLogger.getSessionActions();

    const metadata: AssetMetadata = {
      proof: {
        timestamp: new Date().toISOString(),
        mimeType: "image/png",
      },
      information: {
        type: "catalog",
        description: "Final composite with full provenance chain",
        source: "Trace App",
      },
    };

    const customCommit: CustomCommit = {
      sourceAssets: sourceIterations.map((iter) => ({
        nid: iter.nid,
        ipfsUrl: `https://ipfs-pin.numbersprotocol.io/ipfs/${iter.nid}`,
      })),

      // Summary fields
      traceActionCount: allActions.length,
      traceCheckpointType: "final",
      traceAppVersion: "1.0.0",
      traceProvenanceType: "creative-process-complete",

      // Full action log as stringified JSON
      traceActionLog: JSON.stringify(allActions),
    };

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("metadata", JSON.stringify(metadata));
    formData.append("nit_commit_custom", JSON.stringify(customCommit));

    const response = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    const data = await response.json();

    // CLEAR THE SESSION AFTER SUCCESSFUL REGISTRATION
    await actionLogger.clearSession();

    // START A NEW SESSION
    await actionLogger.initSession();

    return {
      nid: data.nid,
      timestamp: data.timestamp,
      imageData: dataUrl,
      iterationCount: sourceIterations.length,
      sourceAssets: sourceIterations.map((iter) => ({
        nid: iter.nid,
        ipfsUrl: `https://ipfs-pin.numbersprotocol.io/ipfs/${iter.nid}`,
      })),
    };
  }
}

import { AssetMetadata, CustomCommit } from '@/app/domain/entities';
import { NumbersProtocolClient } from '@/app/infrastructure/api/numbersClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File;
    const metadataStr = formData.get('metadata') as string;
    const nitCommitCustomStr = formData.get('nit_commit_custom') as string | null;

    if (!file || !metadataStr) {
      return NextResponse.json(
        { error: 'Missing file or metadata' },
        { status: 400 }
      );
    }

    const metadata: AssetMetadata = JSON.parse(metadataStr);
    const nitCommitCustom: CustomCommit | undefined = nitCommitCustomStr 
      ? JSON.parse(nitCommitCustomStr) 
      : undefined;

    const captureToken = process.env.NUMBERS_CAPTURE_TOKEN;
    if (!captureToken) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const client = new NumbersProtocolClient(captureToken);
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });
    
    const nid = await client.registerAsset(blob, metadata, nitCommitCustom);

    return NextResponse.json({
      success: true,
      nid,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
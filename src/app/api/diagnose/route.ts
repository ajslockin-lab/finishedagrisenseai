import { NextRequest, NextResponse } from 'next/server';
import { diagnoseCropDisease } from '@/ai/flows/diagnose-crop-disease';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { photoDataUri, cropType } = body;

    if (!photoDataUri || typeof photoDataUri !== 'string') {
      return NextResponse.json(
        { error: 'photoDataUri is required and must be a base64 data URI string' },
        { status: 400 }
      );
    }

    if (!cropType || typeof cropType !== 'string') {
      return NextResponse.json(
        { error: 'cropType is required and must be a string' },
        { status: 400 }
      );
    }

    const output = await diagnoseCropDisease({ photoDataUri, cropType });
    return NextResponse.json(output);
  } catch (error) {
    console.error('Diagnose API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to diagnose crop disease',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Diagnose API is running' });
}

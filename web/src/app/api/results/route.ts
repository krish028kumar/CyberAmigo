import { NextResponse } from 'next/server';
import fs from 'fs';

export async function GET() {
  try {
    const resultsPath = '/workspace/outputs/model_results.json';
    
    if (!fs.existsSync(resultsPath)) {
      return NextResponse.json(
        { error: 'Results file not found' },
        { status: 404 }
      );
    }

    const resultsData = fs.readFileSync(resultsPath, 'utf-8');
    const results = JSON.parse(resultsData);

    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Failed to load results:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

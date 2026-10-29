import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const metricsPath = '/workspace/outputs/metrics.json';
    
    if (!fs.existsSync(metricsPath)) {
      return NextResponse.json(
        { error: 'Metrics file not found' },
        { status: 404 }
      );
    }

    const metricsData = fs.readFileSync(metricsPath, 'utf-8');
    const metrics = JSON.parse(metricsData);

    return NextResponse.json(metrics);
  } catch (error: any) {
    console.error('Failed to load metrics:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

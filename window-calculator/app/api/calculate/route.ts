import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    // MAKE SURE THIS IS YOUR ACTUAL RENDER URL
    const pythonApiUrl = 'https://render.com/docs/web-services#port-binding';
    
    console.log('Calling Python API:', pythonApiUrl);
    
    const response = await fetch(pythonApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    console.log('Python API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Python backend error:', errorText);
      throw new Error(`Python backend error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Python API response data:', data);
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Calculation failed' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

// Interface for type safety (assuming these are the fields being sent)
interface CalculationPayload {
  width: number;
  height: number;
  depth: number;
  // NOTE: You need to add all required fields from your backend's CalculationRequest
  // For now, I'll use the placeholder variables from your provided code.
}

export async function POST(request: Request) {
  const pythonApiUrl = 'https://profilcouwcalculator-2.onrender.com';
  
  // NOTE: You need to extract the window, series, case_index, etc. 
  // from the body, as required by your Python backend's CalculationRequest model.
  let requestBody: any;
  let response: Response; // Declare response here so it's scoped correctly
  
  try {
    requestBody = await request.json();
    console.log('Request body received:', requestBody);
    
    // --- CRITICAL FIXES APPLIED HERE ---
    // 1. Using the correct base URL variable (pythonApiUrl).
    // 2. Using the correct API path (/api/calculate) as defined in the FastAPI backend.
    const fullApiUrl = `${pythonApiUrl}/api/calculate`; 
    console.log('Calling Python API:', fullApiUrl);
    
    response = await fetch(fullApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Ensure you are sending the complete structure (window, series, case_index, etc.)
      // that your backend's CalculationRequest model expects.
      body: JSON.stringify(requestBody), 
    });

    // We check the response after the fetch call completes
    console.log('Python API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Python backend error details:', errorText);
      // Re-throw a specific error that includes the 405 status
      throw new Error(`Python backend error: ${response.status} - ${errorText.substring(0, 100)}...`);
    }
    
    const data = await response.json();
    console.log('Python API response data:', data);
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('API Error:', error);
    // If the error occurred during the fetch attempt (e.g., DNS failure, connection issue), 
    // we use a generic 500 status.
    return NextResponse.json(
      { error: `Calculation failed: ${error.message}` },
      { status: 500 }
    );
  }
}

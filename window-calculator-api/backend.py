from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

app = FastAPI()

# Allow requests from Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://https://profilco-uw-calculator-g40s6uy30-daglas-projects.vercel.app/",  # Your Vercel URL
        "https://*.vercel.app"  # Allow all Vercel domains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CalculationRequest(BaseModel):
    window: Dict[str, Any]
    series: Dict[str, Any]
    case_index: int
    profile_index: int
    ug_value: float
    psi_value: float

def get_case_profile_values(window_name: str, case_index: int, profile_index: int):
    case_profile_values = {
        (0, 0): [0.151, 0.151], (1, 0): [0.151, 0.151], (2, 0): [0.151, 0.151],
        (3, 0): [0.151, 0.151], (4, 0): [0.151, 0.151], (5, 0): [0.151, 0.151],
        (6, 1): [0.155, 0.231], (6, 2): [0.155, 0.231], (6, 3): [0.155, 0.231],
        (7, 1): [0.155, 0.231], (7, 2): [0.155, 0.231], (7, 3): [0.155, 0.231],
        (8, 1): [0.155, 0.231], (8, 2): [0.155, 0.231], (8, 3): [0.155, 0.231],
        (9, 1): [0.155, 0.231], (9, 2): [0.155, 0.231], (9, 3): [0.155, 0.231],
        (10, 1): [0.155, 0.231], (10, 2): [0.155, 0.231], (10, 3): [0.155, 0.231],
        (11, 1): [0.155, 0.231], (11, 2): [0.155, 0.231], (11, 3): [0.155, 0.231],
        (12, 4): [0.156, 0.238], (12, 5): [0.156, 0.238],
        (13, 4): [0.156, 0.238], (13, 5): [0.156, 0.238],
        (14, 4): [0.156, 0.238], (14, 5): [0.156, 0.238],
        (15, 4): [0.156, 0.238], (15, 5): [0.156, 0.238],
        (16, 4): [0.156, 0.238], (16, 5): [0.156, 0.238],
        (17, 4): [0.156, 0.238], (17, 5): [0.156, 0.238],
        (18, 6): [0.138, 0.214], (19, 6): [0.138, 0.214], (20, 6): [0.138, 0.214],
        (21, 6): [0.138, 0.214], (22, 6): [0.138, 0.214], (23, 6): [0.138, 0.214],
        (24, 6): [0.138, 0.214],
        (25, 7): [0.128, 0.193], (26, 7): [0.128, 0.193], (27, 7): [0.128, 0.193],
    }
    
    windows_with_hook = ["ER", "TE", "DE"]
    values = case_profile_values.get((case_index, profile_index), [0.10, 0.05])
    
    if window_name in windows_with_hook:
        hook_width = 0.03
        return values + [hook_width]
    
    return values

@app.post("/calculate")
def calculate(req: CalculationRequest):
    window = req.window
    series = req.series
    
    array_values = get_case_profile_values(window['name'], req.case_index, req.profile_index)
    height_offset = array_values[0]
    length_offset = array_values[1]
    hook_width = array_values[2] if len(array_values) == 3 else None
    
    n = window['num_windows']
    
    glass_height = window['height'] - height_offset
    glass_length = n * (window['length'] / 2) - length_offset
    glass_area = glass_height * glass_length
    
    plaisio_height = glass_height - 2 * 0.01
    plaisio_length = glass_length - 2 * n * 0.01
    
    Ag = plaisio_height * plaisio_length
    Af1 = glass_area - plaisio_height * (window['height'] - (window['height'] - plaisio_height))
    
    if hook_width is not None:
        Af2 = plaisio_height * hook_width
    else:
        Af2 = plaisio_height
    
    Af = Af1 + Af2
    Ig = ((plaisio_length / 2) * 4) + (plaisio_height * 4)
    
    if window['series_type'] == "Sliding":
        Uw = ((Af1 * series['uf1'] + Af2 * series['uf2']) + (Ag * req.ug_value) + (Ig * req.psi_value)) / (window['height'] * window['length'])
    else:
        Uw = ((Af1 * series['uffs'] + Af2 * series['uff']) + (Ag * req.ug_value) + (Ig * req.psi_value)) / (window['height'] * window['length'])
    
    return {
        'glass_height': glass_height,
        'glass_length': glass_length,
        'glass_area': glass_area,
        'plaisio_height': plaisio_height,
        'plaisio_length': plaisio_length,
        'Ag': Ag,
        'Af': Af,
        'Af1': Af1,
        'Af2': Af2,
        'Ig': Ig,
        'Uw': Uw,
        'has_hook': hook_width is not None
    }
print("Starting backend.py...")

from flask import Flask, request, jsonify
from flask_cors import CORS
import importlib
import sys

print("Flask imports successful")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

print("Importing calculation classes...")

# Import all calculation classes
from calculations.mono_fixed import MonoFixedCalculation
print("  - MonoFixedCalculation imported")
from calculations.mono_opening import MonoOpeningCalculation
print("  - MonoOpeningCalculation imported")
from calculations.sliding_2 import Sliding2Calculation
print("  - Sliding2Calculation imported")
from calculations.sliding_3 import Sliding3Calculation
print("  - Sliding3Calculation imported")
from calculations.sliding_4 import Sliding4Calculation
print("  - Sliding4Calculation imported")

# Map window types to their calculation classes
CALCULATION_CLASSES = {
    'Μονόφυλλο Σταθερό': MonoFixedCalculation,
    'Μονόφυλλο Ανοιγόμενο': MonoOpeningCalculation,
    'Συρόμενο 2 Φύλλων': Sliding2Calculation,
    'Συρόμενο 3 Φύλλων': Sliding3Calculation,
    'Συρόμενο 4 Φύλλων': Sliding4Calculation,
}

@app.route('/api/calculate', methods=['POST'])
def calculate():
    try:
        data = request.json
        
        # Extract parameters
        window = data.get('window')
        series = data.get('series')
        case_index = data.get('case_index')
        profile_index = data.get('profile_index')
        ug_value = data.get('ug_value')
        psi_value = data.get('psi_value')
        
        # Validate required fields
        if not all([window, series, case_index is not None, profile_index is not None]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Get the calculation class for this window type
        window_type = window.get('name')
        calculation_class = CALCULATION_CLASSES.get(window_type)
        
        if not calculation_class:
            return jsonify({'error': f'Unknown window type: {window_type}'}), 400
        
        # Create calculator instance
        calculator = calculation_class(
            length=window.get('length'),
            height=window.get('height'),
            case_index=case_index,
            profile_index=profile_index,
            series_uf=series.get('Uf'),
            ug_value=ug_value,
            psi_value=psi_value
        )
        
        # Perform calculation
        results = calculator.calculate()
        
        # Return results
        return jsonify(results)
        
    except Exception as e:
        print(f"Calculation error: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Backend is running'})

if __name__ == '__main__':
    print("Starting Flask server on http://localhost:5000")
    print("Available window types:", list(CALCULATION_CLASSES.keys()))
    app.run(debug=True, port=5000)

@app.get("/")
def root():
    return {"status": "API is running"}
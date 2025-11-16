# backend.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import traceback
import importlib

app = FastAPI()

# CORS: allow localhost (dev) and Vercel domains (prod).
# We use allow_origin_regex to permit any subdomain of vercel.app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request model ---
class CalculationRequest(BaseModel):
    window: Dict[str, Any]
    series: Dict[str, Any]
    case_index: int
    profile_index: int
    ug_value: float
    psi_value: float

# --- Helper: case/profile table (same as your previous mapping) ---
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

# --- Try to import calculation classes (optional) ---
CALCULATION_CLASSES = {}
try:
    # These imports assume you have a package `calculations` with these modules
    from calculations.mono_fixed import MonoFixedCalculation
    from calculations.mono_opening import MonoOpeningCalculation
    from calculations.sliding_2 import Sliding2Calculation
    from calculations.sliding_3 import Sliding3Calculation
    from calculations.sliding_4 import Sliding4Calculation

    CALCULATION_CLASSES = {
        'Μονόφυλλο Σταθερό': MonoFixedCalculation,
        'Μονόφυλλο Ανοιγόμενο': MonoOpeningCalculation,
        'Συρόμενο 2 Φύλλων': Sliding2Calculation,
        'Συρόμενο 3 Φύλλων': Sliding3Calculation,
        'Συρόμενο 4 Φύλλων': Sliding4Calculation,
    }
except Exception:
    # If imports fail, leave CALCULATION_CLASSES empty and fallback to procedural implementation
    CALCULATION_CLASSES = {}
    # It's okay — we will still compute using the procedural path for general window types
    print("Warning: Calculation class imports failed; falling back to procedural calculations.")
    traceback.print_exc()

# --- Procedural calculation (same formula as before) ---
def procedural_calculate(window: Dict[str, Any], series: Dict[str, Any], case_index: int, profile_index: int, ug_value: float, psi_value: float):
    array_values = get_case_profile_values(window['name'], case_index, profile_index)
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

    if window.get('series_type') == "Sliding":
        # sliding uses uf1 and uf2
        Uw = ((Af1 * series.get('uf1', 0) + Af2 * series.get('uf2', 0)) + (Ag * ug_value) + (Ig * psi_value)) / (window['height'] * window['length'])
    else:
        # opening uses uffs and uff
        Uw = ((Af1 * series.get('uffs', 0) + Af2 * series.get('uff', 0)) + (Ag * ug_value) + (Ig * psi_value)) / (window['height'] * window['length'])

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

# --- API endpoints ---

@app.post("/api/calculate")
async def api_calculate(req: CalculationRequest):
    """
    Accepts a JSON body with: window, series, case_index, profile_index, ug_value, psi_value
    Tries to use a specialized calculation class when available, otherwise falls back to procedural_calculate.
    """
    try:
        window = req.window
        series = req.series

        # Validate required fields
        if not all([window, series, req.case_index is not None, req.profile_index is not None]):
            raise HTTPException(status_code=400, detail="Missing required fields")

        # If a specific calculation class exists for the window type and was imported, use it
        window_type_name = window.get('name')
        calc_cls = CALCULATION_CLASSES.get(window_type_name)
        if calc_cls:
            try:
                # Attempt to instantiate the class using common parameter names.
                # Adjust constructor args below if your class signature differs.
                calculator = calc_cls(
                    length=window.get('length'),
                    height=window.get('height'),
                    case_index=req.case_index,
                    profile_index=req.profile_index,
                    series_uf=series.get('Uf') or series.get('uf1') or series.get('uffs'),
                    ug_value=req.ug_value,
                    psi_value=req.psi_value
                )
                results = calculator.calculate()
                return results
            except Exception:
                # If class usage fails, fall back to procedural calculation
                traceback.print_exc()
                # continue to procedural path below

        # Procedural fallback
        results = procedural_calculate(window, series, req.case_index, req.profile_index, req.ug_value, req.psi_value)
        return results

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
async def health():
    return {"status": "ok", "message": "Backend is running"}


@app.get("/")
async def root():
    return {"status": "API is running"}

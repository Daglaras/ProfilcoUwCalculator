// lib/data.ts - All data for the calculator

export const cases = [
    // AP320 (0-5)
    { name: "AP320-203", material_factor: 44 },
    { name: "AP320-205", material_factor: 44 },
    { name: "AP320-207", material_factor: 44 },
    { name: "AP320-208", material_factor: 44 },
    { name: "AP320-214", material_factor: 44 },
    { name: "AP320-215", material_factor: 44 },
    // AP045 (6-11)
    { name: "AP045-201", material_factor: 46.8 },
    { name: "AP045-202", material_factor: 46.8 },
    { name: "AP045-203", material_factor: 46.8 },
    { name: "AP045-208", material_factor: 46.8 },
    { name: "AP045-209", material_factor: 46.8 },
    { name: "AP045-210", material_factor: 46.8 },
    // AP580 (12-17)
    { name: "AP580-201", material_factor: 45.5 },
    { name: "AP580-202", material_factor: 45.5 },
    { name: "AP580-203", material_factor: 45.5 },
    { name: "AP580-204", material_factor: 45.5 },
    { name: "AP580-205", material_factor: 45.5 },
    { name: "AP580-206", material_factor: 45.5 },
    // AP046 (18-24)
    { name: "AP046-201", material_factor: 45.1 },
    { name: "AP046-202", material_factor: 45.1 },
    { name: "AP046-203", material_factor: 45.1 },
    { name: "AP046-206", material_factor: 45.1 },
    { name: "AP046-207", material_factor: 45.1 },
    { name: "AP046-208", material_factor: 45.1 },
    { name: "AP046-209", material_factor: 45.1 },
    // AP034 (25-27)
    { name: "AP034-201", material_factor: 32 },
    { name: "AP034-202", material_factor: 32 },
    { name: "AP034-203", material_factor: 32 },
  ];
  
  export const profiles = [
    // AP320 (0)
    { name: "AP320-301", thickness: 0.0979 },
    // AP045 (1-3)
    { name: "AP045-301", thickness: 0.113 },
    { name: "AP045-302", thickness: 0.113 },
    { name: "AP045-303", thickness: 0.113 },
    // AP580 (4-5)
    { name: "AP580-301", thickness: 0.0974 },
    { name: "AP580-302", thickness: 0.0854 },
    // AP046 (6)
    { name: "AP046-301", thickness: 0.0854 },
    // AP034 (7)
    { name: "AP034-301", thickness: 0.0855 },
  ];
  
  export const slidingSeries = [
    { name: "PR32 Thermo", uf1: 4.2, uf2: 4.5, category: "Sliding" },
    { name: "PR45", uf1: 4.3, uf2: 4.9, category: "Sliding" },
    { name: "IQ460", uf1: 3.8, uf2: 4.6, category: "Sliding" },
    { name: "IQ580", uf1: 3.8, uf2: 5.2, category: "Sliding" },
    { name: "IQ34", uf1: 3.9, uf2: 4.7, category: "Sliding" },
  ];
  
  export const openingSeries = [
    { name: "IQ90", uffs: 1.5, uff: 1.3, ufsms: 1.5, category: "Opening" },
    { name: "IQ74", uffs: 2, uff: 1.7, ufsms: 2.1, category: "Opening" },
    { name: "PR63", uffs: 2.7, uff: 2.7, ufsms: 2.7, category: "Opening" },
  ];
  
  export const windowTypes = [
    {
      name: "DAR",
      length: 2.0,
      height: 0.83,
      num_windows: 2,
      series_type: "Opening",
      compatible_cases: [24, 25, 26],
      compatible_profiles: [7],
    },
    {
      name: "Da",
      length: 2.0,
      height: 2.2,
      num_windows: 2,
      series_type: "Opening",
      compatible_cases: [6, 7, 8],
      compatible_profiles: [1, 2, 3],
    },
    {
      name: "MAR",
      length: 2.0,
      height: 0.82,
      num_windows: 1,
      series_type: "Opening",
      compatible_cases: [0, 1, 2],
      compatible_profiles: [0],
    },
    {
      name: "MA",
      length: 1.15,
      height: 1.15,
      num_windows: 1,
      series_type: "Opening",
      compatible_cases: [0, 1, 2, 3],
      compatible_profiles: [0, 1, 2, 3],
    },
    {
      name: "ER",
      length: 1.05,
      height: 0.91,
      num_windows: 2,
      series_type: "Sliding",
      compatible_cases: [24, 25, 26],
      compatible_profiles: [7],
    },
    {
      name: "TE",
      length: 3.0,
      height: 2.0,
      num_windows: 3,
      series_type: "Sliding",
      compatible_cases: [25, 26, 27],
      compatible_profiles: [7],
    },
    {
      name: "DE",
      length: 3.0,
      height: 2.0,
      num_windows: 2,
      series_type: "Sliding",
      compatible_cases: [25, 26, 27],
      compatible_profiles: [7],
    },
  ];
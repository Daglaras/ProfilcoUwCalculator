# calculations/sliding_4.py - Syromeno 4 Fyllon

from calculations.base import BaseCalculation

class Sliding4Calculation(BaseCalculation):
    def calculate(self):
        # Glass dimensions for 4-panel sliding window
        glass_height = self.height - self.case['bf1'] - self.case['bf2'] - (2 * self.profile['bp'])
        glass_length = (self.length / 4) - self.case['bf1'] - self.profile['bp']
        glass_area = glass_height * glass_length * 4  # 4 panels
        
        # Frame dimensions
        plaisio_height = self.height
        plaisio_length = self.length
        
        # Areas
        Ag = glass_area
        Af1 = (self.case['bf1'] * self.length) + (self.case['bf2'] * self.length)
        Af2 = (self.case['bf1'] * (self.height - self.case['bf1'] - self.case['bf2'])) + \
              (self.case['bf2'] * (self.height - self.case['bf1'] - self.case['bf2']))
        
        # Add middle rails area (3 rails between 4 panels)
        middle_rails = 3 * self.profile['bp'] * self.height
        
        Af = Af1 + Af2 + middle_rails + (2 * self.profile['bp'] * glass_length * 4)
        
        # Perimeter (4 glass panels)
        Ig = 2 * 4 * (glass_height + glass_length)
        
        # Calculate Uw
        Uw = self.calculate_uw(Ag, Af, Ig)
        
        return {
            'Uw': Uw,
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
            'has_hook': self.profile['has_hook']
        }
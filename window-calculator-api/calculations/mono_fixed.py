# calculations/mono_fixed.py - Monofillo Statero calculation

from calculations.base import BaseCalculation

class MonoFixedCalculation(BaseCalculation):
    def calculate(self):
        # Glass dimensions
        glass_height = self.height - self.case['bf1'] - self.case['bf2']
        glass_length = self.length - self.case['bf1'] - self.case['bf2']
        glass_area = glass_height * glass_length
        
        # Frame dimensions
        plaisio_height = self.height
        plaisio_length = self.length
        
        # Areas
        Ag = glass_area
        Af1 = (self.case['bf1'] * self.length) + (self.case['bf2'] * self.length)
        Af2 = (self.case['bf1'] * (self.height - self.case['bf1'] - self.case['bf2'])) + \
              (self.case['bf2'] * (self.height - self.case['bf1'] - self.case['bf2']))
        Af = Af1 + Af2
        
        # Perimeter
        Ig = 2 * (glass_height + glass_length)
        
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
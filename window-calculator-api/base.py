# calculations/base.py - Base calculation class

from data import cases, profiles

class BaseCalculation:
    def __init__(self, length, height, case_index, profile_index, series_uf, ug_value, psi_value):
        self.length = length
        self.height = height
        self.case = cases[case_index]
        self.profile = profiles[profile_index]
        self.series_uf = series_uf
        self.ug_value = ug_value
        self.psi_value = psi_value
        
    def calculate(self):
        """Override this method in subclasses"""
        raise NotImplementedError("Subclasses must implement calculate()")
    
    def calculate_uw(self, Ag, Af, Ig):
        """Calculate final Uw value"""
        numerator = (self.ug_value * Ag) + (self.series_uf * Af) + (self.psi_value * Ig)
        denominator = self.length * self.height
        return numerator / denominator if denominator != 0 else 0
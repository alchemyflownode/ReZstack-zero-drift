import sys
sys.path.append('G:\okiru-pure\rezsparse-trainer/claude')
from claude_validator import ClaudeConstitutionalValidator

class ClaudeBridge:
    def __init__(self):
        self.validator = ClaudeConstitutionalValidator()
    
    def validate_training_data(self, data):
        """Use Claude to validate training data constitutionality"""
        return self.validator.check_alignment(data)
    
    def get_constitutional_feedback(self, model_output):
        """Get Claude's feedback on model outputs"""
        return self.validator.audit_constitution(model_output)

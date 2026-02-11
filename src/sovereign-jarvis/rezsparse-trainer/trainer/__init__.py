"""
rezsparse-trainer Trainer Module
Imports REAL Constitutional AI training code
"""

# First try to import from our copied real trainer
try:
    from .constitutional_trainer import ConstitutionalTrainer
    print("[TRAINER] Loaded real ConstitutionalTrainer from trainer/constitutional_trainer.py")
    HAS_REAL_TRAINER = True
except ImportError as e:
    print(f"[TRAINER] Could not import constitutional_trainer: {e}")
    HAS_REAL_TRAINER = False

# Also try to import from src
try:
    from .src.constitutional_core import ConstitutionalCore
    print("[TRAINER] Loaded ConstitutionalCore from trainer/src/constitutional_core.py")
    HAS_CONSTITUTIONAL_CORE = True
except ImportError as e:
    print(f"[TRAINER] Could not import constitutional_core: {e}")
    HAS_CONSTITUTIONAL_CORE = False

# Export what we have
__all__ = []

if HAS_REAL_TRAINER:
    __all__.append('ConstitutionalTrainer')
    
if HAS_CONSTITUTIONAL_CORE:
    __all__.append('ConstitutionalCore')

print(f"[TRAINER] Module ready. Exports: {__all__}")

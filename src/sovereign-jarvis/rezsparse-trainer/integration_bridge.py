"""
Integration bridge between existing code and new structure
"""
import sys
from pathlib import Path

# Add both old and new paths
sys.path.append(str(Path(__file__).parent / 'src'))
sys.path.append(str(Path(__file__).parent))

# Try to import from new structure first, fall back to old
try:
    from rezstack.constitutional_core.safety_engine import SafetyEngine
    ConstitutionalJudge = SafetyEngine  # Alias for backward compatibility
    print("✅ Using new rezstack structure")
except ImportError:
    try:
        from src.constitutional_ml.constitutional_judge import ConstitutionalJudge
        print("⚠️  Using old structure - consider migrating to rezstack/")
    except ImportError:
        print("❌ Could not import constitutional modules")
        raise

# Export both for compatibility
__all__ = ['ConstitutionalJudge', 'SafetyEngine']

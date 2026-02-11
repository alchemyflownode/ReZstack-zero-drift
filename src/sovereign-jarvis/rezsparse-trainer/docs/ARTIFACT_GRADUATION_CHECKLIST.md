# REZSTACK ARTIFACT GRADUATION CHECKLIST
## For promotion from quarantine/ to production/

### MODELS must pass:
☐ Constitutional Judge evaluation (>85% alignment)
☐ Re-training under 3060 hardware constraints
☐ Zero-drift validation (compare with original)
☐ Performance benchmarks under RezStack load

### DATA must pass:
☐ Constitutional alignment scoring
☐ Schema validation against first principles
☐ Duplicate/contamination check
☐ Re-distillation through your training pipeline

### CONFIGS must pass:
☐ First-principles derivation verification
☐ Constraint compatibility check
☐ No hidden assumptions or magical numbers
☐ Documented derivation path

### RULE: If it can't be re-derived, it can't graduate.

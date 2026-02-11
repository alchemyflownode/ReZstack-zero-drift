"""
enhanced_distillery.py
Enhanced Constitutional Distillery - Finds actual models and patterns
"""
import torch
import json
import pickle
from pathlib import Path
from typing import Dict, List, Any
import numpy as np
import sys
import os

class EnhancedConstitutionalDistillery:
    """Enhanced distillery that actually finds your models and patterns"""
    
    def __init__(self):
        # Try multiple possible paths for Ollama models
        self.ollama_paths = [
            Path("D:/AI/Ollama_Models"),
            Path("D:/AI/"),
            Path(os.environ.get("OLLAMA_MODELS", "C:/")),
        ]
        
        # Try multiple possible paths for RezStack
        self.rezstack_paths = [
            Path("G:/okiru/app builder/RezStackFinal"),
            Path("G:/okiru/RezStackFinal"),
            Path("G:/okiru/app builder/"),
        ]
        
        self.found_ollama_path = None
        self.found_rezstack_path = None
        
        print("=" * 70)
        print("🔍 ENHANCED CONSTITUTIONAL DISTILLERY")
        print("=" * 70)
        
        # Find actual paths
        self._discover_actual_paths()
    
    def _discover_actual_paths(self):
        """Discover where your files actually are"""
        print("🔍 Discovering actual file locations...")
        
        # Find Ollama models
        for path in self.ollama_paths:
            if path.exists():
                print(f"✅ Found Ollama directory: {path}")
                self.found_ollama_path = path
                break
        
        # Find RezStack
        for path in self.rezstack_paths:
            if path.exists():
                print(f"✅ Found RezStack directory: {path}")
                self.found_rezstack_path = path
                break
        
        if not self.found_ollama_path:
            print("⚠️ Could not find Ollama models at standard locations")
            print("   Searching for AI-related directories...")
            
            # Search for AI directories in D: drive
            d_drive = Path("D:/")
            if d_drive.exists():
                ai_dirs = list(d_drive.glob("*AI*")) + list(d_drive.glob("*ai*"))
                for dir in ai_dirs:
                    if dir.is_dir():
                        print(f"   Found AI directory: {dir}")
                        self.found_ollama_path = dir
                        break
        
        if not self.found_rezstack_path:
            print("⚠️ Could not find RezStack at standard locations")
            print("   Searching for okiru directories...")
            
            # Search for okiru in G: drive
            g_drive = Path("G:/")
            if g_drive.exists():
                okiru_dirs = list(g_drive.rglob("*okiru*"))
                for dir in okiru_dirs:
                    if dir.is_dir() and any(file.suffix in ['.ts', '.js', '.py'] for file in dir.iterdir()):
                        print(f"   Found code directory: {dir}")
                        self.found_rezstack_path = dir
                        break
        
        print(f"\n📊 Using paths:")
        print(f"   Ollama: {self.found_ollama_path or 'NOT FOUND'}")
        print(f"   RezStack: {self.found_rezstack_path or 'NOT FOUND'}")
    
    def discover_ollama_models(self) -> List[Path]:
        """Discover ALL model files (not just specific extensions)"""
        print(f"\n🔍 Discovering ALL model files...")
        
        models = []
        
        if self.found_ollama_path and self.found_ollama_path.exists():
            # List ALL files in the directory to see what's there
            all_files = list(self.found_ollama_path.rglob("*"))
            
            print(f"📁 Directory contains {len(all_files)} items")
            
            if all_files:
                print("   First 20 items:")
                for item in all_files[:20]:
                    if item.is_file():
                        size_mb = item.stat().st_size / (1024 * 1024)
                        print(f"    📄 {item.name} ({size_mb:.1f} MB)")
                    else:
                        print(f"    📁 {item.name}/")
            
            # Common model file patterns
            model_patterns = [
                "*.gguf", "*.bin", "*.pth", "*.safetensors", "*.pt",
                "*.ckpt", "*.h5", "*.onnx", "*.pb", "*.model",
                "*model*", "*llama*", "*mistral*", "*codellama*"
            ]
            
            for pattern in model_patterns:
                found = list(self.found_ollama_path.rglob(pattern))
                models.extend(found)
                if found:
                    print(f"   Found {len(found)} files with pattern: {pattern}")
            
            # Also look for large files (>50MB) as potential models
            large_files = []
            for item in self.found_ollama_path.rglob("*"):
                if item.is_file():
                    try:
                        size_mb = item.stat().st_size / (1024 * 1024)
                        if size_mb > 50:  # Models are usually large
                            large_files.append((item, size_mb))
                    except:
                        continue
            
            if large_files:
                print(f"\n🔍 Found {len(large_files)} large files (potential models):")
                for file, size_mb in large_files[:10]:
                    print(f"    📦 {file.name} ({size_mb:.1f} MB)")
                    if file not in models:
                        models.append(file)
            
            # Remove duplicates
            models = list(set(models))
        
        print(f"✅ Found {len(models)} potential model files")
        return models
    
    def extract_rezstack_patterns(self) -> List[Dict]:
        """Actually extract patterns from RezStack code"""
        print(f"\n🔍 Extracting actual RezStack patterns...")
        
        patterns = []
        
        if self.found_rezstack_path and self.found_rezstack_path.exists():
            # List all files to understand structure
            all_files = list(self.found_rezstack_path.rglob("*"))
            print(f"📁 RezStack contains {len(all_files)} items")
            
            # Show top-level structure
            top_level = [f for f in self.found_rezstack_path.iterdir()][:10]
            print(f"   Top level items:")
            for item in top_level:
                if item.is_file():
                    print(f"    📄 {item.name}")
                else:
                    print(f"    📁 {item.name}/")
            
            # Look for TypeScript/JavaScript files
            code_extensions = ['.ts', '.js', '.py', '.md', '.json', '.yaml', '.yml']
            code_files = []
            
            for ext in code_extensions:
                files = list(self.found_rezstack_path.rglob(f"*{ext}"))
                code_files.extend(files)
                if files:
                    print(f"   Found {len(files)} {ext} files")
            
            print(f"\n🔍 Analyzing code for constitutional patterns...")
            
            # Sample some files to find constitutional patterns
            constitutional_keywords = [
                "sovereignty", "zero-drift", "constitutional", "bytecode",
                "wisdom", "pattern", "law", "enforcement", "vibe", "score",
                "architecture", "entropy", "crystalline", "resonance"
            ]
            
            files_analyzed = 0
            for code_file in code_files[:100]:  # Analyze first 100 files
                try:
                    content = code_file.read_text(encoding='utf-8', errors='ignore')
                    
                    # Count constitutional keywords
                    keyword_counts = {}
                    total_keywords = 0
                    
                    for keyword in constitutional_keywords:
                        count = content.lower().count(keyword.lower())
                        if count > 0:
                            keyword_counts[keyword] = count
                            total_keywords += count
                    
                    if total_keywords > 0:
                        pattern = {
                            "source": str(code_file.relative_to(self.found_rezstack_path)),
                            "type": "code_pattern",
                            "keyword_counts": keyword_counts,
                            "total_keywords": total_keywords,
                            "vibe_score": min(70 + total_keywords * 3, 100),
                            "preview": content[:200].replace('\n', ' ') + "..."
                        }
                        patterns.append(pattern)
                        
                        if len(patterns) <= 5:  # Show first 5 patterns
                            print(f"    ✅ Pattern from: {pattern['source']}")
                            print(f"       Keywords: {list(keyword_counts.keys())}")
                            print(f"       Vibe: {pattern['vibe_score']}/100")
                    
                    files_analyzed += 1
                    
                except Exception as e:
                    continue
            
            print(f"\n📊 Analyzed {files_analyzed} files, found {len(patterns)} constitutional patterns")
            
            # If no patterns found, create synthetic ones from file names
            if len(patterns) == 0:
                print("   ⚠️ No patterns found in code, creating from file structure...")
                
                # Look for files with constitutional names
                constitutional_file_names = [
                    "constitution", "law", "rule", "pattern", "wisdom",
                    "vibe", "score", "architecture", "design", "principle"
                ]
                
                for code_file in code_files[:50]:
                    file_lower = code_file.name.lower()
                    if any(name in file_lower for name in constitutional_file_names):
                        pattern = {
                            "source": str(code_file.relative_to(self.found_rezstack_path)),
                            "type": "file_name_pattern",
                            "vibe_score": 80,
                            "reason": f"File name suggests constitutional content: {code_file.name}"
                        }
                        patterns.append(pattern)
        
        print(f"✅ Extracted {len(patterns)} patterns from RezStack")
        return patterns
    
    def create_training_data(self, num_examples=100):
        """Create training data with better feature engineering"""
        print(f"\n🧪 Creating enhanced training data ({num_examples} examples)...")
        
        # Get actual data
        ollama_models = self.discover_ollama_models()
        rezstack_patterns = self.extract_rezstack_patterns()
        
        # Create richer training examples
        training_examples = []
        
        # 1. Constitutional questions (from your actual work)
        constitutional_questions = [
            ("What does 'sovereignty over convenience' mean in software architecture?", 95),
            ("How do you maintain zero-drift in a learning system?", 90),
            ("What are the principles of constitutional AI?", 92),
            ("How does bytecode encode executable wisdom?", 88),
            ("What patterns prevent architectural entropy?", 85),
            ("How do you optimize for RTX 3060 12GB hardware?", 87),
            ("What is the relationship between pattern recognition and intelligence?", 83),
            ("How do you distill wisdom from multiple sources?", 86),
            ("What makes an architecture crystalline rather than accreted?", 91),
            ("How do you begin with an end in mind in system design?", 94),
        ]
        
        for question, vibe in constitutional_questions:
            example = {
                "id": f"constitutional_q_{len(training_examples):03d}",
                "question": question,
                "input_features": self._enhanced_question_to_features(question, ollama_models, rezstack_patterns),
                "target_vibe": vibe,
                "source": "constitutional_wisdom",
                "metadata": {
                    "type": "question",
                    "complexity": len(question.split()) / 10
                }
            }
            training_examples.append(example)
        
        # 2. Patterns from found models
        for i, model_path in enumerate(ollama_models[:20]):  # Use first 20 models
            try:
                size_mb = model_path.stat().st_size / (1024 * 1024)
                
                example = {
                    "id": f"model_{i:03d}",
                    "model_name": model_path.name,
                    "input_features": self._model_to_features(model_path, size_mb),
                    "target_vibe": min(60 + (size_mb / 100), 85),  # Larger models = higher vibe
                    "source": "ollama_model",
                    "metadata": {
                        "size_mb": size_mb,
                        "path": str(model_path),
                        "type": "model_file"
                    }
                }
                training_examples.append(example)
            except:
                continue
        
        # 3. Patterns from RezStack
        for i, pattern in enumerate(rezstack_patterns[:30]):  # Use first 30 patterns
            example = {
                "id": f"rezstack_{i:03d}",
                "pattern_source": pattern.get("source", "unknown"),
                "input_features": self._pattern_to_enhanced_features(pattern),
                "target_vibe": pattern.get("vibe_score", 75),
                "source": "rezstack_pattern",
                "metadata": pattern
            }
            training_examples.append(example)
        
        # 4. Add synthetic examples if we don't have enough
        if len(training_examples) < num_examples:
            print(f"   ⚙️ Adding {num_examples - len(training_examples)} synthetic examples...")
            additional = self._create_synthetic_examples(num_examples - len(training_examples))
            training_examples.extend(additional)
        
        print(f"✅ Created {len(training_examples)} training examples")
        print(f"   Sources: {set(ex['source'] for ex in training_examples)}")
        
        # Save data (without pandas dependency)
        self._save_data_simple(training_examples)
        
        return training_examples
    
    def _enhanced_question_to_features(self, question, ollama_models, rezstack_patterns):
        """Create better features from questions"""
        features = np.zeros(512)
        
        # 1. Question length and complexity
        words = question.split()
        features[0] = len(words) / 100  # Normalized length
        features[1] = len(set(words)) / len(words) if words else 0  # Vocabulary diversity
        
        # 2. Constitutional keyword features
        constitutional_keywords = {
            "sovereignty": (10, 0.9),
            "zero-drift": (20, 0.85),
            "constitutional": (30, 0.9),
            "bytecode": (40, 0.8),
            "wisdom": (50, 0.85),
            "pattern": (60, 0.75),
            "architecture": (70, 0.7),
            "entropy": (80, 0.65),
            "3060": (90, 0.6),
            "distill": (100, 0.7)
        }
        
        question_lower = question.lower()
        for keyword, (start_idx, weight) in constitutional_keywords.items():
            if keyword in question_lower:
                # Multiple occurrences increase weight
                count = question_lower.count(keyword)
                features[start_idx:start_idx+5] = weight * (1 + count * 0.1)
        
        # 3. Model context features (based on found models)
        if ollama_models:
            features[150] = len(ollama_models) / 100  # Normalized model count
            features[151] = 0.7  # Models present flag
        
        # 4. RezStack context features
        if rezstack_patterns:
            features[200] = len(rezstack_patterns) / 200  # Normalized pattern count
            features[201] = 0.8  # Patterns present flag
        
        # 5. Add some random but deterministic noise based on question hash
        question_hash = hash(question) % 400
        np.random.seed(question_hash)
        features[300:400] = np.random.rand(100) * 0.3
        
        return features
    
    def _model_to_features(self, model_path, size_mb):
        """Convert model file to features"""
        features = np.zeros(512)
        
        # File size features
        features[0] = size_mb / 10000  # Normalize (10GB max)
        
        # File name features
        name = model_path.name.lower()
        
        # Model type indicators
        if "llama" in name:
            features[10:20] = 0.8
        if "mistral" in name:
            features[20:30] = 0.7
        if "code" in name:
            features[30:40] = 0.75
        if "7b" in name or "7B" in name:
            features[40:50] = 0.6
        if "13b" in name or "13B" in name:
            features[50:60] = 0.7
        
        # File extension features
        if model_path.suffix in ['.gguf', '.bin', '.pth']:
            features[60:70] = 0.9
        elif model_path.suffix in ['.pt', '.ckpt']:
            features[70:80] = 0.8
        
        # Add hash-based deterministic features
        name_hash = hash(str(model_path)) % 400
        np.random.seed(name_hash)
        features[100:200] = np.random.rand(100) * 0.4
        
        return features
    
    def _pattern_to_enhanced_features(self, pattern):
        """Convert pattern to enhanced features"""
        features = np.zeros(512)
        
        # Vibe score feature
        vibe = pattern.get("vibe_score", 75)
        features[0] = vibe / 100
        
        # Keyword count features
        keyword_count = pattern.get("total_keywords", 0)
        features[1] = keyword_count / 20  # Normalize (max 20 keywords)
        
        # Source path features
        source = pattern.get("source", "").lower()
        
        # Directory depth
        depth = source.count('/') + source.count('\\')
        features[2] = depth / 10
        
        # File type indicators
        if source.endswith('.ts'):
            features[10:20] = 0.8
        elif source.endswith('.js'):
            features[20:30] = 0.7
        elif source.endswith('.py'):
            features[30:40] = 0.75
        elif source.endswith('.md'):
            features[40:50] = 0.6
        
        # Content keywords in source path
        for i, keyword in enumerate(["constitution", "law", "rule", "pattern", "wisdom"]):
            if keyword in source:
                features[50 + i*5:50 + (i+1)*5] = 0.7
        
        # Add hash-based features
        source_hash = hash(source) % 400
        np.random.seed(source_hash)
        features[100:300] = np.random.rand(200) * 0.3
        
        return features
    
    def _create_synthetic_examples(self, num_examples):
        """Create synthetic training examples"""
        examples = []
        
        synthetic_patterns = [
            ("Architecture with clear separation of concerns", 85),
            ("System that maintains backward compatibility", 80),
            ("Code with comprehensive unit tests", 82),
            ("Design that minimizes external dependencies", 88),
            ("Implementation following SOLID principles", 83),
            ("Configuration that is environment-agnostic", 79),
            ("Build system with reproducible outputs", 81),
            ("Documentation that explains the 'why' not just 'how'", 77),
            ("Error handling that provides useful context", 84),
            ("API design with versioning strategy", 86),
        ]
        
        for i in range(num_examples):
            pattern_idx = i % len(synthetic_patterns)
            pattern_text, vibe = synthetic_patterns[pattern_idx]
            
            example = {
                "id": f"synthetic_{i:03d}",
                "description": pattern_text,
                "input_features": self._create_synthetic_features(pattern_text, i),
                "target_vibe": vibe,
                "source": "synthetic_pattern",
                "metadata": {"type": "synthetic", "index": i}
            }
            examples.append(example)
        
        return examples
    
    def _create_synthetic_features(self, text, seed):
        """Create features for synthetic examples"""
        features = np.zeros(512)
        
        # Use text hash as seed for deterministic features
        text_hash = hash(text) + seed
        np.random.seed(text_hash % 10000)
        
        # Create pattern-like features
        features[0:100] = np.random.rand(100) * 0.5 + 0.3
        features[100:200] = np.random.rand(100) * 0.4
        features[200:300] = np.random.rand(100) * 0.6
        
        # Add some structure
        features[300:320] = 0.7  # Architecture indicator
        features[320:340] = 0.6  # Design indicator
        features[340:360] = 0.8  # Quality indicator
        
        return features
    
    def _save_data_simple(self, training_examples):
        """Save data without pandas dependency"""
        # Convert to arrays
        X_list = []
        y_list = []
        
        for example in training_examples:
            X_list.append(example["input_features"])
            y_list.append([example["target_vibe"]])
        
        X = np.array(X_list)
        y = np.array(y_list)
        
        # Save directory
        data_dir = Path("data/training/distilled")
        data_dir.mkdir(parents=True, exist_ok=True)
        
        # Save as pickle
        data_path = data_dir / "enhanced_distilled.pkl"
        with open(data_path, 'wb') as f:
            pickle.dump({
                "X": X,
                "y": y,
                "examples": training_examples[:50],  # Save first 50 with metadata
                "metadata": {
                    "created_by": "EnhancedConstitutionalDistillery",
                    "num_examples": len(training_examples),
                    "date": "2024-01-21",
                    "description": "Enhanced training data with actual file discovery"
                }
            }, f)
        
        print(f"💾 Saved enhanced data to: {data_path}")
        print(f"   Features shape: {X.shape}, Targets shape: {y.shape}")
        
        # Also save as simple text file for inspection
        txt_path = data_dir / "enhanced_examples.txt"
        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write("Enhanced Constitutional Training Data\n")
            f.write("=" * 50 + "\n\n")
            
            for i, example in enumerate(training_examples[:20]):
                f.write(f"Example {i+1}:\n")
                f.write(f"  ID: {example['id']}\n")
                f.write(f"  Source: {example['source']}\n")
                f.write(f"  Vibe Score: {example['target_vibe']}\n")
                
                if 'question' in example:
                    f.write(f"  Question: {example['question'][:100]}...\n")
                elif 'model_name' in example:
                    f.write(f"  Model: {example['model_name']}\n")
                elif 'pattern_source' in example:
                    f.write(f"  Pattern: {example['pattern_source']}\n")
                
                f.write(f"  Feature sum: {example['input_features'].sum():.2f}\n")
                f.write("\n")
        
        print(f"📝 Text summary: {txt_path}")
    
    def run(self):
        """Run the enhanced distillery"""
        print("\n" + "=" * 70)
        print("🏭 RUNNING ENHANCED DISTILLERY")
        print("=" * 70)
        
        # Create training data
        training_examples = self.create_training_data(num_examples=100)
        
        print("\n" + "=" * 70)
        print("✅ ENHANCED DISTILLERY COMPLETE")
        print("=" * 70)
        
        print(f"\n🎉 Created {len(training_examples)} training examples")
        print(f"\nNext steps:")
        print("1. Load this data in your constitutional trainer")
        print("2. Train a proper model")
        print("3. Query with your actual questions")
        
        return training_examples

def main():
    """Main enhanced distillery"""
    distillery = EnhancedConstitutionalDistillery()
    
    # Run the enhanced distillery
    training_data = distillery.run()
    
    print("\n" + "=" * 70)
    print("🔧 READY FOR TRAINING")
    print("=" * 70)
    
    print("\nTo train your model:")
    print("1. First install pandas if not installed: python -m pip install pandas")
    print("2. Then run: python train_on_enhanced_data.py")
    
    return distillery

if __name__ == "__main__":
    main()

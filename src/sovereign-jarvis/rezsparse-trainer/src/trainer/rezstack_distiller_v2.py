# -*- coding: utf-8 -*-

# REZSTACK CONSTITUTIONAL DISTILLER v2.0
# Enhanced with actual model processing and constitutional scoring

import json
import pickle
import numpy as np
import torch
import shutil
import os
import hashlib
from pathlib import Path
from datetime import datetime
import traceback
from typing import Dict, Any, Optional, Tuple

class ConstitutionalAuditor:
    """Audits models against constitutional principles"""
    
    def __init__(self, constitutional_model_path: Path):
        with open(constitutional_model_path, 'rb') as f:
            data = pickle.load(f)
        
        self.scorer = data['model']
        self.vectorizer = data['vectorizer']
        self.feature_names = data['feature_names']
        self.version = data.get('version', 'unknown')
        
        # Extract constitutional principles from top features
        coefs = self.scorer.coef_[0]
        self.top_principles = [
            self.feature_names[i] 
            for i in np.argsort(coefs)[-10:][::-1]
        ]
        self.bottom_anti_patterns = [
            self.feature_names[i]
            for i in np.argsort(coefs)[:10]
        ]
    
    def generate_model_report(self, model_path: Path, model_data: Any = None) -> Dict[str, Any]:
        """Generate constitutional report for a model"""
        report = {
            "file_name": model_path.name,
            "file_path": str(model_path),
            "file_size_mb": round(model_path.stat().st_size / (1024 * 1024), 3),
            "file_hash": self._calculate_file_hash(model_path),
            "audit_timestamp": datetime.now().isoformat(),
            "constitutional_score": None,
            "principle_compliance": {},
            "recommendations": [],
            "warnings": [],
            "status": "audited"
        }
        
        try:
            # Try to extract text descriptions from the model
            text_description = self._extract_model_description(model_path, model_data)
            
            if text_description:
                # Score the description
                vectorized = self.vectorizer.transform([text_description])
                score = float(self.scorer.predict(vectorized)[0])
                report["constitutional_score"] = score
                
                # Check compliance with each principle
                for principle in self.top_principles[:5]:
                    compliance = principle.lower() in text_description.lower()
                    report["principle_compliance"][principle] = {
                        "present": compliance,
                        "importance": "high" if principle in self.top_principles[:3] else "medium"
                    }
                
                # Generate recommendations based on score
                if score < 0.3:
                    report["recommendations"].append("Consider adding explicit constitutional framework references")
                    report["recommendations"].append("Document alignment with governance principles")
                elif score < 0.6:
                    report["recommendations"].append("Enhance documentation of architectural decisions")
                    report["recommendations"].append("Add references to sovereignty and governance patterns")
                else:
                    report["recommendations"].append("Excellent constitutional alignment - consider sharing as reference implementation")
            
            # Check for anti-patterns
            for anti_pattern in self.bottom_anti_patterns[:3]:
                if model_path.name.lower().find(anti_pattern.lower()) != -1:
                    report["warnings"].append(f"Potential anti-pattern detected: {anti_pattern}")
            
        except Exception as e:
            report["status"] = "audit_failed"
            report["error"] = str(e)
            report["traceback"] = traceback.format_exc()
        
        return report
    
    def _calculate_file_hash(self, file_path: Path) -> str:
        """Calculate SHA256 hash of file"""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    
    def _extract_model_description(self, model_path: Path, model_data: Any = None) -> str:
        """Extract text description from various model types"""
        description_parts = []
        
        # Add filename analysis
        description_parts.append(f"model named {model_path.stem}")
        
        # Try to load and analyze the model
        try:
            if model_path.suffix in ['.pth', '.pt']:
                # PyTorch model
                if model_data is None:
                    model_data = torch.load(model_path, map_location='cpu', weights_only=False)
                
                if isinstance(model_data, dict):
                    description_parts.append("pytorch checkpoint")
                    if 'state_dict' in model_data:
                        description_parts.append(f"contains state dict with {len(model_data['state_dict'])} layers")
                    if 'config' in model_data:
                        description_parts.append("has configuration")
                    
            elif model_path.suffix == '.pkl':
                # Pickled model
                if model_data is None:
                    with open(model_path, 'rb') as f:
                        model_data = pickle.load(f)
                
                model_type = type(model_data).__name__
                description_parts.append(f"pickled {model_type}")
                
                if hasattr(model_data, 'n_features_in_'):
                    description_parts.append(f"features: {model_data.n_features_in_}")
                if hasattr(model_data, '__len__'):
                    description_parts.append(f"length: {len(model_data)}")
                    
        except Exception:
            # If we can't load, just use basic info
            pass
        
        return " ".join(description_parts)

class ModelDistiller:
    """Distills models by adding constitutional metadata"""
    
    def __init__(self, output_dir: Path):
        self.output_dir = output_dir
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def distill_pytorch_model(self, model_path: Path, audit_report: Dict[str, Any]) -> Path:
        """Add constitutional metadata to PyTorch model"""
        try:
            # Load the model
            checkpoint = torch.load(model_path, map_location='cpu', weights_only=False)
            
            # Add constitutional metadata
            if not isinstance(checkpoint, dict):
                checkpoint = {'state_dict': checkpoint}
            
            checkpoint['constitutional_metadata'] = {
                'distillation_timestamp': datetime.now().isoformat(),
                'audit_report': audit_report,
                'distiller_version': 'rezstack_constitutional_v2.0',
                'original_hash': audit_report['file_hash']
            }
            
            # Save distilled version
            output_path = self.output_dir / f"distilled_{model_path.name}"
            torch.save(checkpoint, output_path)
            
            return output_path
            
        except Exception as e:
            raise Exception(f"Failed to distill PyTorch model: {e}")
    
    def distill_pickle_model(self, model_path: Path, audit_report: Dict[str, Any]) -> Path:
        """Add constitutional metadata to pickled model"""
        try:
            # Load the model
            with open(model_path, 'rb') as f:
                model_data = pickle.load(f)
            
            # Create wrapper with constitutional metadata
            distilled_data = {
                'original_model': model_data,
                'constitutional_metadata': {
                    'distillation_timestamp': datetime.now().isoformat(),
                    'audit_report': audit_report,
                    'distiller_version': 'rezstack_constitutional_v2.0',
                    'original_hash': audit_report['file_hash']
                }
            }
            
            # Save distilled version
            output_path = self.output_dir / f"distilled_{model_path.name}"
            with open(output_path, 'wb') as f:
                pickle.dump(distilled_data, f)
            
            return output_path
            
        except Exception as e:
            raise Exception(f"Failed to distill pickled model: {e}")
    
    def create_constitutional_summary(self, distilled_path: Path, audit_report: Dict[str, Any]) -> Path:
        """Create human-readable summary of distillation"""
        summary_path = distilled_path.with_suffix('.summary.txt')
        
        with open(summary_path, 'w') as f:
            f.write("=" * 80 + "\n")
            f.write("CONSTITUTIONAL DISTILLATION SUMMARY\n")
            f.write("=" * 80 + "\n\n")
            
            f.write(f"Model: {audit_report['file_name']}\n")
            f.write(f"Distilled: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Original Hash: {audit_report['file_hash'][:16]}...\n")
            f.write(f"Size: {audit_report['file_size_mb']} MB\n\n")
            
            if audit_report['constitutional_score'] is not None:
                f.write(f"Constitutional Score: {audit_report['constitutional_score']:.2%}\n")
                
                # Score interpretation
                score = audit_report['constitutional_score']
                if score > 0.7:
                    f.write("Rating: ????? Excellent constitutional alignment\n")
                elif score > 0.5:
                    f.write("Rating: ???? Good constitutional foundation\n")
                elif score > 0.3:
                    f.write("Rating: ??? Moderate constitutional alignment\n")
                else:
                    f.write("Rating: ?? Needs constitutional enhancement\n")
            
            if audit_report.get('principle_compliance'):
                f.write("\n?? PRINCIPLE COMPLIANCE:\n")
                for principle, compliance in audit_report['principle_compliance'].items():
                    status = "?" if compliance['present'] else "?"
                    f.write(f"  {status} {principle}\n")
            
            if audit_report.get('recommendations'):
                f.write("\n?? RECOMMENDATIONS:\n")
                for rec in audit_report['recommendations']:
                    f.write(f"  � {rec}\n")
            
            if audit_report.get('warnings'):
                f.write("\n??  WARNINGS:\n")
                for warning in audit_report['warnings']:
                    f.write(f"  � {warning}\n")
            
            f.write("\n" + "=" * 80 + "\n")
            f.write("End of Constitutional Distillation Summary\n")
            f.write("=" * 80 + "\n")
        
        return summary_path

class RezstackConstitutionalDistillerV2:
    """Main distiller class"""
    
    def __init__(self, manifest_path: Path, constitutional_model_path: Path):
        self.manifest_path = manifest_path
        self.base_dir = manifest_path.parent.parent.parent
        
        # Setup paths
        self.distilled_dir = self.base_dir / "models" / "distilled"
        self.reports_dir = self.distilled_dir / "reports"
        self.audits_dir = self.distilled_dir / "audits"
        
        for dir_path in [self.distilled_dir, self.reports_dir, self.audits_dir]:
            dir_path.mkdir(parents=True, exist_ok=True)
        
        # Load manifest
        print(f"?? Loading manifest from: {manifest_path}")
        with open(manifest_path, 'r') as f:
            self.manifest = json.load(f)
        
        # Initialize auditor and distiller
        print("?? Initializing Constitutional Auditor...")
        self.auditor = ConstitutionalAuditor(constitutional_model_path)
        self.distiller = ModelDistiller(self.distilled_dir / "models")
        
        print("\n" + "=" * 80)
        print("??? REZSTACK CONSTITUTIONAL DISTILLER v2.0")
        print("=" * 80)
        print(f"?? Manifest entries: {len(self.manifest)}")
        print(f"?? Constitutional principles loaded: {len(self.auditor.top_principles)}")
        print("=" * 80 + "\n")
    
    def process_item(self, item: Dict[str, Any], index: int, total: int) -> Dict[str, Any]:
        """Process a single manifest item"""
        print(f"\n[{index}/{total}] ?? Processing: {item['name']}")
        print(f"   ?? Category: {item['category']}")
        print(f"   ?? Size: {item['size_mb']} MB")
        
        result = {
            **item,
            "processing_start": datetime.now().isoformat(),
            "distillation_result": {},
            "status": "pending"
        }
        
        try:
            model_path = Path(item['path'])
            
            # Skip if not a model/pattern file
            if item['category'] not in ['Models', 'Patterns', 'Checkpoints']:
                print(f"   ??  Skipping (category not prioritized)")
                result['status'] = 'skipped'
                result['reason'] = 'category_not_prioritized'
                return result
            
            if not model_path.exists():
                print(f"   ? File not found: {model_path}")
                result['status'] = 'failed'
                result['error'] = 'file_not_found'
                return result
            
            # Step 1: Constitutional Audit
            print(f"   ?? Running constitutional audit...")
            audit_report = self.auditor.generate_model_report(model_path)
            
            # Save audit report
            audit_filename = f"audit_{model_path.stem}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            audit_path = self.audits_dir / audit_filename
            with open(audit_path, 'w') as f:
                json.dump(audit_report, f, indent=2)
            
            result['audit_report_path'] = str(audit_path)
            result['constitutional_score'] = audit_report.get('constitutional_score')
            
            # Step 2: Distillation (only for successful audits)
            if audit_report['status'] == 'audited':
                print(f"   ??  Distilling model...")
                
                if model_path.suffix in ['.pth', '.pt']:
                    distilled_path = self.distiller.distill_pytorch_model(model_path, audit_report)
                elif model_path.suffix == '.pkl':
                    distilled_path = self.distiller.distill_pickle_model(model_path, audit_report)
                else:
                    # For other file types, just copy with metadata
                    distilled_path = self.distilled_dir / "models" / f"distilled_{model_path.name}"
                    shutil.copy2(model_path, distilled_path)
                
                # Create summary
                summary_path = self.distiller.create_constitutional_summary(distilled_path, audit_report)
                
                result['distilled_path'] = str(distilled_path)
                result['summary_path'] = str(summary_path)
                result['distilled_size_mb'] = round(distilled_path.stat().st_size / (1024 * 1024), 3)
                result['status'] = 'distilled'
                
                print(f"   ? Distilled successfully!")
                if audit_report.get('constitutional_score'):
                    print(f"   ?? Constitutional Score: {audit_report['constitutional_score']:.2%}")
                
            else:
                print(f"   ??  Audit failed: {audit_report.get('error', 'Unknown error')}")
                result['status'] = 'audit_failed'
                result['error'] = audit_report.get('error')
            
        except Exception as e:
            print(f"   ? Processing failed: {str(e)}")
            result['status'] = 'failed'
            result['error'] = str(e)
            result['traceback'] = traceback.format_exc()
        
        result['processing_end'] = datetime.now().isoformat()
        return result
    
    def run(self):
        """Run the full distillation pipeline"""
        results = []
        total_items = len(self.manifest)
        
        print("?? Starting Constitutional Distillation Pipeline...\n")
        
        for i, item in enumerate(self.manifest, 1):
            result = self.process_item(item, i, total_items)
            results.append(result)
        
        # Generate final report
        self.generate_final_report(results)
        
        return results
    
    def generate_final_report(self, results: list):
        """Generate comprehensive final report"""
        report_path = self.reports_dir / f"distillation_final_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        # Statistics
        status_counts = {}
        for result in results:
            status = result.get('status', 'unknown')
            status_counts[status] = status_counts.get(status, 0) + 1
        
        # Calculate average constitutional score
        constitutional_scores = [
            r.get('constitutional_score', 0) 
            for r in results 
            if r.get('constitutional_score') is not None
        ]
        avg_score = sum(constitutional_scores) / len(constitutional_scores) if constitutional_scores else 0
        
        final_report = {
            "generated": datetime.now().isoformat(),
            "total_processed": len(results),
            "status_summary": status_counts,
            "average_constitutional_score": round(avg_score, 4) if constitutional_scores else None,
            "distilled_models": [
                {
                    "name": r['name'],
                    "original_size_mb": r['size_mb'],
                    "distilled_size_mb": r.get('distilled_size_mb'),
                    "constitutional_score": r.get('constitutional_score'),
                    "status": r['status'],
                    "distilled_path": r.get('distilled_path'),
                    "summary_path": r.get('summary_path')
                }
                for r in results if r.get('distilled_path')
            ],
            "failed_items": [
                {
                    "name": r['name'],
                    "error": r.get('error'),
                    "category": r['category']
                }
                for r in results if r['status'] == 'failed'
            ],
            "all_results": results
        }
        
        # Save JSON report
        with open(report_path, 'w') as f:
            json.dump(final_report, f, indent=2)
        
        # Save human-readable summary
        summary_path = report_path.with_suffix('.summary.txt')
        with open(summary_path, 'w') as f:
            f.write("=" * 80 + "\n")
            f.write("REZSTACK CONSTITUTIONAL DISTILLATION - FINAL REPORT\n")
            f.write("=" * 80 + "\n\n")
            
            f.write(f"?? Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"?? Total Items Processed: {len(results)}\n\n")
            
            f.write("?? STATUS SUMMARY:\n")
            for status, count in status_counts.items():
                f.write(f"  � {status}: {count} items\n")
            
            if constitutional_scores:
                f.write(f"\n?? Average Constitutional Score: {avg_score:.2%}\n")
            
            f.write("\n?? SUCCESSFULLY DISTILLED MODELS:\n")
            distilled = [r for r in results if r.get('distilled_path')]
            for i, model in enumerate(distilled, 1):
                score = model.get('constitutional_score', 0)
                stars = "?" * min(5, int(score * 5) + 1)
                f.write(f"  {i}. {model['name']} {stars} ({score:.2%})\n")
            
            failed = [r for r in results if r['status'] == 'failed']
            if failed:
                f.write(f"\n??  FAILED ITEMS ({len(failed)}):\n")
                for item in failed[:5]:  # Show first 5
                    f.write(f"  � {item['name']}: {item.get('error', 'Unknown error')}\n")
                if len(failed) > 5:
                    f.write(f"  ... and {len(failed) - 5} more\n")
            
            f.write("\n" + "=" * 80 + "\n")
            f.write("?? DISTILLATION COMPLETE\n")
            f.write("=" * 80 + "\n")
        
        print("\n" + "=" * 80)
        print("?? CONSTITUTIONAL DISTILLATION COMPLETE!")
        print("=" * 80)
        print(f"?? Results:")
        print(f"  � Total processed: {len(results)}")
        for status, count in status_counts.items():
            print(f"  � {status}: {count}")
        if constitutional_scores:
            print(f"  � Avg constitutional score: {avg_score:.2%}")
        print(f"\n?? Full report: {report_path}")
        print(f"?? Summary: {summary_path}")
        print("=" * 80)

# Main execution
if __name__ == "__main__":
    import sys
    
    # Configuration
    BASE_DIR = Path(r"G:\okiru-pure\rezsparse-trainer")
    MANIFEST_PATH = BASE_DIR / "models" / "distilled" / "reports" / "full_distillation_manifest.json"
    CONSTITUTIONAL_MODEL_PATH = BASE_DIR / "production_constitutional_predictor.pkl"
    
    print("?? Initializing Rezstack Constitutional Distiller v2.0...")
    
    # Check if files exist
    if not MANIFEST_PATH.exists():
        print(f"? Manifest not found: {MANIFEST_PATH}")
        sys.exit(1)
    
    if not CONSTITUTIONAL_MODEL_PATH.exists():
        print(f"? Constitutional model not found: {CONSTITUTIONAL_MODEL_PATH}")
        sys.exit(1)
    
    try:
        # Create and run distiller
        distiller = RezstackConstitutionalDistillerV2(MANIFEST_PATH, CONSTITUTIONAL_MODEL_PATH)
        distiller.run()
        
    except Exception as e:
        print(f"? Distillation failed with error: {e}")
        print(traceback.format_exc())
        sys.exit(1)

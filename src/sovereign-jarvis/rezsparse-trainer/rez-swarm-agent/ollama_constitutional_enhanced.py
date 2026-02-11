# ollama_constitutional_enhanced.py
"""
ENHANCED OLLAMA CONSTITUTIONAL ANALYZER
Uses multiple models for specialized analysis
"""

import requests
import json
from pathlib import Path
from typing import Dict, Any, List, Optional
import time
from datetime import datetime
import concurrent.futures

class MultiModelConstitutionalAnalyst:
    """Uses multiple Ollama models for comprehensive analysis"""
    
    def __init__(self, base_url="http://localhost:11434"):
        self.base_url = base_url
        self.base_path = Path(r"G:\okiru-pure\rezsparse-trainer")
        self.models = self._get_best_models_for_analysis()
        
    def _get_best_models_for_analysis(self) -> Dict[str, str]:
        """Select optimal models for different analysis types"""
        return {
            "governance": "sovereign-architect:latest",  # Specialized in governance
            "technical": "deepseek-coder:latest",  # Best for code/technical analysis
            "ethics": "llama3:8b",  # Balanced for ethical reasoning
            "security": "mistral:latest",  # Good for security analysis
            "visual": "qwen3-vl:8b"  # If we have visual models to analyze
        }
    
    def analyze_with_all_models(self, model_info: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze model using multiple specialized models"""
        print(f"\n🔬 Multi-Model Analysis for: {model_info.get('name')}")
        print("=" * 60)
        
        results = {
            "model_info": model_info,
            "analyses": {},
            "consensus_score": 0.0,
            "timestamp": datetime.now().isoformat()
        }
        
        # Run analyses in parallel for speed
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            futures = {}
            
            for analysis_type, model_name in self.models.items():
                if analysis_type == "visual" and not self._has_visual_content(model_info):
                    continue
                    
                future = executor.submit(
                    self._single_model_analysis,
                    model_info, 
                    model_name,
                    analysis_type
                )
                futures[future] = analysis_type
            
            # Collect results
            for future in concurrent.futures.as_completed(futures):
                analysis_type = futures[future]
                try:
                    result = future.result(timeout=120)
                    results["analyses"][analysis_type] = result
                    print(f"   ✅ {analysis_type.upper()}: {result.get('score', 0):.1f}%")
                except Exception as e:
                    print(f"   ❌ {analysis_type.upper()}: Failed - {str(e)}")
                    results["analyses"][analysis_type] = {"error": str(e)}
        
        # Calculate consensus score
        scores = [a.get('score', 50) for a in results["analyses"].values() 
                 if isinstance(a, dict) and 'score' in a]
        if scores:
            results["consensus_score"] = sum(scores) / len(scores)
        
        # Generate recommendations
        results["recommendations"] = self._generate_recommendations(results["analyses"])
        results["risk_level"] = self._calculate_risk_level(results)
        
        return results
    
    def _single_model_analysis(self, model_info: Dict[str, Any], 
                              model_name: str, 
                              analysis_type: str) -> Dict[str, Any]:
        """Analyze with a specific model"""
        prompt = self._create_specialized_prompt(model_info, analysis_type)
        
        try:
            response = self._query_ollama(model_name, prompt)
            return self._parse_specialized_response(response, analysis_type)
        except Exception as e:
            return {"error": str(e), "model": model_name, "type": analysis_type}
    
    def _create_specialized_prompt(self, model_info: Dict[str, Any], 
                                  analysis_type: str) -> str:
        """Create specialized prompts for each analysis type"""
        
        base_info = f"""
MODEL TO ANALYZE:
- Name: {model_info.get('name', 'Unknown')}
- Category: {model_info.get('category', 'Unknown')}
- Size: {model_info.get('size_mb', 0)} MB
- Description: {model_info.get('description', 'No description')}
"""
        
        prompts = {
            "governance": f"""{base_info}
You are a Constitutional AI Governance Expert. Analyze this model for:

1. SOVEREIGNTY ALIGNMENT (0-25 points):
   • Data sovereignty practices
   • Model sovereignty implementation
   • Governance framework presence

2. REGULATORY COMPLIANCE (0-25 points):
   • EU AI Act alignment
   • NIST AI RMF compliance
   • Industry-specific regulations

3. ETHICAL FRAMEWORK (0-25 points):
   • Bias mitigation
   • Fairness measures
   • Transparency mechanisms

4. OPERATIONAL GOVERNANCE (0-25 points):
   • Version control
   • Change management
   • Incident response

Provide JSON: {{"score": 0-100, "strengths": [], "weaknesses": [], "governance_level": "Basic/Intermediate/Advanced", "compliance_gap": "Low/Medium/High"}}
""",
            
            "technical": f"""{base_info}
You are an AI Model Technical Analyst. Analyze for:

1. ARCHITECTURE QUALITY (0-20 points):
   • Modularity
   • Documentation
   • Code quality

2. PERFORMANCE (0-20 points):
   • Efficiency
   • Scalability
   • Resource usage

3. SECURITY (0-20 points):
   • Vulnerability surface
   • Access controls
   • Data protection

4. MAINTAINABILITY (0-20 points):
   • Testing coverage
   • Dependencies
   • Update process

5. INTEROPERABILITY (0-20 points):
   • API design
   • Standards compliance
   • Integration points

Provide JSON: {{"score": 0-100, "technical_debt": "Low/Medium/High", "security_risk": "Low/Medium/High", "recommendations": []}}
""",
            
            "ethics": f"""{base_info}
You are an AI Ethics Specialist. Analyze for:

1. FAIRNESS (0-25 points):
   • Bias detection
   • Fair treatment
   • Accessibility

2. TRANSPARENCY (0-25 points):
   • Explainability
   • Decision tracking
   • Documentation

3. ACCOUNTABILITY (0-25 points):
   • Responsibility chains
   • Audit trails
   • Redress mechanisms

4. PRIVACY (0-25 points):
   • Data minimization
   • Consent mechanisms
   • Anonymization

Provide JSON: {{"score": 0-100, "ethical_concerns": [], "privacy_risks": "Low/Medium/High", "fairness_score": 0-100}}
""",
            
            "security": f"""{base_info}
You are an AI Security Expert. Analyze for:

1. THREAT MODEL (0-25 points):
   • Attack surface
   • Vulnerability assessment
   • Threat vectors

2. DEFENSES (0-25 points):
   • Security controls
   • Monitoring
   • Incident response

3. DATA PROTECTION (0-25 points):
   • Encryption
   • Access controls
   • Data lifecycle

4. COMPLIANCE (0-25 points):
   • Security standards
   • Regulations
   • Certifications

Provide JSON: {{"score": 0-100, "risk_level": "Low/Medium/High/Critical", "vulnerabilities": [], "recommendations": []}}
"""
        }
        
        return prompts.get(analysis_type, base_info)
    
    def _query_ollama(self, model: str, prompt: str) -> Dict[str, Any]:
        """Query Ollama with timeout and retry"""
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.2,  # Lower for more consistent analysis
                "top_p": 0.9,
                "num_ctx": 4096
            }
        }
        
        for attempt in range(3):
            try:
                response = requests.post(
                    f"{self.base_url}/api/generate",
                    json=payload,
                    timeout=45
                )
                response.raise_for_status()
                return response.json()
            except requests.exceptions.Timeout:
                if attempt < 2:
                    time.sleep(2)
                    continue
                raise
            except Exception as e:
                raise
    
    def _parse_specialized_response(self, response: Dict[str, Any], 
                                   analysis_type: str) -> Dict[str, Any]:
        """Parse response based on analysis type"""
        raw_text = response.get('response', '{}')
        
        # Try to extract JSON
        try:
            import re
            json_match = re.search(r'\{.*\}', raw_text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
                result["raw_response"] = raw_text[:500] + "..." if len(raw_text) > 500 else raw_text
                result["model_used"] = response.get('model', 'unknown')
                result["processing_time"] = response.get('total_duration', 0) / 1e9
                return result
        except:
            pass
        
        # Fallback: extract score and key points
        return {
            "score": self._extract_score_from_text(raw_text),
            "key_findings": self._extract_key_findings(raw_text),
            "raw_response": raw_text[:500] + "..." if len(raw_text) > 500 else raw_text,
            "model_used": response.get('model', 'unknown'),
            "analysis_type": analysis_type
        }
    
    def _extract_score_from_text(self, text: str) -> float:
        """Extract numeric score from text"""
        import re
        patterns = [
            r'["\']?score["\']?\s*[:=]\s*["\']?(\d{1,3})["\']?',
            r'(\d{1,3})\s*%\s*score',
            r'score.*?(\d{1,3})\s*out of',
            r'rating.*?(\d{1,3})/100'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    return float(match.group(1))
                except:
                    continue
        
        # Look for percentage in text
        percent_match = re.search(r'(\d{1,3})\s*%', text)
        if percent_match:
            try:
                return float(percent_match.group(1))
            except:
                pass
        
        return 50.0  # Default
    
    def _extract_key_findings(self, text: str) -> List[str]:
        """Extract key findings from analysis text"""
        import re
        
        findings = []
        
        # Look for bullet points, numbered lists, or key phrases
        bullet_patterns = [
            r'[-•*]\s*(.+?)(?=\n|$)',
            r'\d+\.\s*(.+?)(?=\n|$)',
            r'Finding[s]?[:]\s*(.+?)(?=\n\n|\Z)',
            r'Key takeaway[s]?[:]\s*(.+?)(?=\n\n|\Z)'
        ]
        
        for pattern in bullet_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE | re.DOTALL)
            findings.extend([m.strip() for m in matches if len(m.strip()) > 10])
        
        return findings[:5]  # Return top 5 findings
    
    def _has_visual_content(self, model_info: Dict[str, Any]) -> bool:
        """Check if model might have visual content"""
        name = model_info.get('name', '').lower()
        visual_keywords = ['vision', 'image', 'video', 'clip', 'dalle', 'stable', 'diffusion']
        return any(keyword in name for keyword in visual_keywords)
    
    def _generate_recommendations(self, analyses: Dict[str, Dict]) -> List[str]:
        """Generate actionable recommendations from all analyses"""
        recommendations = []
        
        for analysis_type, analysis in analyses.items():
            if isinstance(analysis, dict):
                # Extract from structured analysis
                if 'recommendations' in analysis and isinstance(analysis['recommendations'], list):
                    recommendations.extend(analysis['recommendations'][:2])
                
                # Extract from weaknesses
                if 'weaknesses' in analysis and isinstance(analysis['weaknesses'], list):
                    for weakness in analysis['weaknesses'][:2]:
                        recommendations.append(f"Address: {weakness}")
                
                # Extract from key findings
                if 'key_findings' in analysis and isinstance(analysis['key_findings'], list):
                    for finding in analysis['key_findings'][:2]:
                        if "improve" in finding.lower() or "add" in finding.lower() or "enhance" in finding.lower():
                            recommendations.append(finding)
        
        # Deduplicate and prioritize
        unique_recs = list(dict.fromkeys(recommendations))[:5]
        return unique_recs
    
    def _calculate_risk_level(self, results: Dict[str, Any]) -> str:
        """Calculate overall risk level"""
        scores = []
        
        for analysis_type, analysis in results.get('analyses', {}).items():
            if isinstance(analysis, dict) and 'score' in analysis:
                scores.append(analysis['score'])
        
        if not scores:
            return "Unknown"
        
        avg_score = sum(scores) / len(scores)
        
        if avg_score >= 80:
            return "Low"
        elif avg_score >= 60:
            return "Medium"
        elif avg_score >= 40:
            return "High"
        else:
            return "Critical"

class RezstackConstitutionalSuite:
    """Complete constitutional analysis suite"""
    
    def __init__(self):
        self.base_path = Path(r"G:\okiru-pure\rezsparse-trainer")
        self.analyst = MultiModelConstitutionalAnalyst()
        self.reports_dir = self.base_path / "models" / "distilled" / "ollama_reports"
        self.reports_dir.mkdir(parents=True, exist_ok=True)
    
    def run_comprehensive_analysis(self, limit: int = 10):
        """Run comprehensive analysis on top models"""
        print("=" * 80)
        print("🏛️ REZSTACK COMPREHENSIVE CONSTITUTIONAL ANALYSIS SUITE")
        print("=" * 80)
        
        # Load manifest
        manifest_path = self.base_path / "models" / "distilled" / "reports" / "full_distillation_manifest.json"
        if not manifest_path.exists():
            print("❌ Manifest not found. Run scanning first.")
            return
        
        with open(manifest_path, 'r') as f:
            manifest = json.load(f)
        
        print(f"📁 Loaded {len(manifest)} artifacts from manifest")
        
        # Filter and prioritize models
        priority_models = self._prioritize_models(manifest, limit)
        
        if not priority_models:
            print("⚠️ No suitable models found for analysis")
            return
        
        print(f"🔍 Analyzing top {len(priority_models)} priority models...")
        
        # Run analyses
        all_results = []
        for i, model in enumerate(priority_models, 1):
            print(f"\n{'='*60}")
            print(f"[{i}/{len(priority_models)}] 🧪 Analyzing: {model.get('name')}")
            print(f"   📊 Category: {model.get('category', 'Unknown')}")
            print(f"   📦 Size: {model.get('size_mb', 0):.1f} MB")
            
            result = self.analyst.analyze_with_all_models(model)
            all_results.append(result)
            
            # Show summary
            if 'consensus_score' in result:
                print(f"   ✅ Consensus Score: {result['consensus_score']:.1f}%")
                print(f"   ⚠️  Risk Level: {result.get('risk_level', 'Unknown')}")
        
        # Generate comprehensive report
        report = self._generate_comprehensive_report(all_results)
        
        # Save reports
        self._save_reports(report, all_results)
        
        print("\n" + "=" * 80)
        print("🏁 COMPREHENSIVE ANALYSIS COMPLETE!")
        print("=" * 80)
        
        # Show summary
        self._print_summary(report)
    
    def _prioritize_models(self, manifest: List[Dict], limit: int) -> List[Dict]:
        """Prioritize models for analysis"""
        # Score models based on importance
        scored_models = []
        
        for model in manifest:
            score = 0
            
            # Category importance
            category = model.get('category', '').lower()
            if 'model' in category:
                score += 30
            if 'production' in model.get('name', '').lower():
                score += 20
            if 'constitutional' in model.get('name', '').lower():
                score += 25
            if 'predictor' in model.get('name', '').lower():
                score += 15
            
            # Size consideration (larger = potentially more important)
            size_mb = model.get('size_mb', 0)
            if size_mb > 100:
                score += 10
            elif size_mb > 10:
                score += 5
            
            scored_models.append((score, model))
        
        # Sort by score and take top N
        scored_models.sort(key=lambda x: x[0], reverse=True)
        return [model for _, model in scored_models[:limit]]
    
    def _generate_comprehensive_report(self, results: List[Dict]) -> Dict[str, Any]:
        """Generate comprehensive analysis report"""
        # Calculate statistics
        consensus_scores = [r.get('consensus_score', 0) for r in results]
        risk_levels = [r.get('risk_level', 'Unknown') for r in results]
        
        # Count risk levels
        risk_counts = {}
        for risk in risk_levels:
            risk_counts[risk] = risk_counts.get(risk, 0) + 1
        
        # Gather all recommendations
        all_recommendations = []
        for result in results:
            all_recommendations.extend(result.get('recommendations', []))
        
        # Most common recommendations
        from collections import Counter
        rec_counter = Counter(all_recommendations)
        top_recommendations = [rec for rec, _ in rec_counter.most_common(5)]
        
        report = {
            "report_type": "comprehensive_constitutional_analysis",
            "generated": datetime.now().isoformat(),
            "total_models_analyzed": len(results),
            "consensus_score_stats": {
                "average": sum(consensus_scores) / len(consensus_scores) if consensus_scores else 0,
                "min": min(consensus_scores) if consensus_scores else 0,
                "max": max(consensus_scores) if consensus_scores else 0,
                "median": sorted(consensus_scores)[len(consensus_scores)//2] if consensus_scores else 0
            },
            "risk_distribution": risk_counts,
            "top_recommendations": top_recommendations,
            "models_analyzed": [r.get('model_info', {}).get('name') for r in results],
            "analysis_models_used": list(self.analyst.models.values())
        }
        
        return report
    
    def _save_reports(self, summary_report: Dict, detailed_results: List[Dict]):
        """Save all reports"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save summary report
        summary_path = self.reports_dir / f"summary_{timestamp}.json"
        with open(summary_path, 'w') as f:
            json.dump(summary_report, f, indent=2)
        
        # Save detailed results
        detailed_path = self.reports_dir / f"detailed_{timestamp}.json"
        with open(detailed_path, 'w') as f:
            json.dump(detailed_results, f, indent=2)
        
        # Save human-readable report
        human_path = self.reports_dir / f"human_report_{timestamp}.md"
        self._save_markdown_report(summary_report, detailed_results, human_path)
        
        print(f"\n📄 Reports saved:")
        print(f"   📊 Summary: {summary_path.name}")
        print(f"   🔍 Detailed: {detailed_path.name}")
        print(f"   📝 Human-readable: {human_path.name}")
    
    def _save_markdown_report(self, summary: Dict, details: List[Dict], path: Path):
        """Save markdown format report"""
        with open(path, 'w', encoding='utf-8') as f:
            f.write("# 🏛️ Rezstack Constitutional Analysis Report\n\n")
            f.write(f"**Generated:** {summary['generated']}\n\n")
            
            f.write("## 📊 Executive Summary\n\n")
            f.write(f"- **Models Analyzed:** {summary['total_models_analyzed']}\n")
            f.write(f"- **Average Score:** {summary['consensus_score_stats']['average']:.1f}%\n")
            f.write(f"- **Score Range:** {summary['consensus_score_stats']['min']:.1f}% - {summary['consensus_score_stats']['max']:.1f}%\n\n")
            
            f.write("## ⚠️ Risk Distribution\n\n")
            for risk, count in summary['risk_distribution'].items():
                f.write(f"- **{risk}:** {count} models\n")
            
            f.write("\n## 🎯 Top 5 Recommendations\n\n")
            for i, rec in enumerate(summary['top_recommendations'], 1):
                f.write(f"{i}. {rec}\n")
            
            f.write("\n## 🔍 Model-by-Model Analysis\n\n")
            for result in details:
                model_info = result.get('model_info', {})
                f.write(f"### {model_info.get('name', 'Unknown')}\n\n")
                f.write(f"- **Consensus Score:** {result.get('consensus_score', 0):.1f}%\n")
                f.write(f"- **Risk Level:** {result.get('risk_level', 'Unknown')}\n")
                
                analyses = result.get('analyses', {})
                if analyses:
                    f.write("\n  **Specialized Scores:**\n")
                    for analysis_type, analysis in analyses.items():
                        if isinstance(analysis, dict) and 'score' in analysis:
                            f.write(f"  - {analysis_type.title()}: {analysis['score']:.1f}%\n")
                
                f.write("\n")
    
    def _print_summary(self, report: Dict):
        """Print summary to console"""
        print("\n📈 ANALYSIS SUMMARY:")
        print(f"   📊 Models Analyzed: {report['total_models_analyzed']}")
        print(f"   🎯 Average Score: {report['consensus_score_stats']['average']:.1f}%")
        print(f"   📉 Min Score: {report['consensus_score_stats']['min']:.1f}%")
        print(f"   📈 Max Score: {report['consensus_score_stats']['max']:.1f}%")
        
        print("\n⚠️  RISK DISTRIBUTION:")
        for risk, count in report['risk_distribution'].items():
            print(f"   • {risk}: {count} models")
        
        print("\n💡 TOP RECOMMENDATIONS:")
        for i, rec in enumerate(report['top_recommendations'][:3], 1):
            print(f"   {i}. {rec}")

def main():
    """Main entry point"""
    suite = RezstackConstitutionalSuite()
    suite.run_comprehensive_analysis(limit=5)

if __name__ == "__main__":
    main()
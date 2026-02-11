import time 
import json 
from pathlib import Path 
from datetime import datetime 
 
class DistillationMonitor: 
    def __init__(self): 
        self.base_path = Path(r"G:\okiru-pure\rezsparse-trainer") 
        self.reports_path = self.base_path / "models" / "distilled" / "reports" 
 
    def monitor(self): 
        print("🔬 Starting Distillation Monitor...") 
        print("📊 Press Ctrl+C to stop monitoring\n") 
 
        while True: 
            try: 
                self.display_status() 
                time.sleep(5) 
            except KeyboardInterrupt: 
                print("\n👋 Monitoring stopped") 
                break 
            except Exception as e: 
                print(f"⚠️  Error: {e}") 
                time.sleep(10) 
 
    def display_status(self): 
        """Display current status""" 
        os.system('cls' if os.name == 'nt' else 'clear') 
 
        print("═" * 60) 
        print("🔬 REZSTACK DISTILLATION MONITOR") 
        print("═" * 60) 
        print(f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}") 
 
        # Check for reports 
        if self.reports_path.exists(): 
            report_files = list(self.reports_path.glob("*.json")) 
            if report_files: 
                latest_report = max(report_files, key=lambda x: x.stat().st_mtime) 
                print(f"📄 Latest report: {latest_report.name}") 
                print(f"📅 Updated: {datetime.fromtimestamp(latest_report.stat().st_mtime).strftime('%H:%M:%S')}") 
 
                try: 
                    with open(latest_report, 'r') as f: 
                        report = json.load(f) 
 
                    if isinstance(report, dict): 
                        print(f"📊 Total processed: {report.get('total_processed', 'N/A')}") 
 
                        if 'status_summary' in report: 
                            print("\n📈 Status Summary:") 
                            for status, count in report['status_summary'].items(): 
                                print(f"  • {status}: {count}") 
 
                        if 'average_constitutional_score' in report: 
                            score = report['average_constitutional_score'] 
                            print(f"\n🎯 Average Score: {score:.1%}") 
 
                except Exception as e: 
                    print(f"⚠️  Could not parse report: {e}") 
            else: 
                print("📭 No reports found yet") 
        else: 
            print("📁 Reports directory not found") 
 
        print("\n" + "═" * 60) 
        print("🔄 Refreshing in 5 seconds...") 
 
if __name__ == "__main__": 
    monitor = DistillationMonitor() 
    monitor.monitor() 

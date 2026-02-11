# constitutional_dashboard.py
"""
REAL-TIME CONSTITUTIONAL ANALYSIS DASHBOARD
"""

import dash
from dash import dcc, html, Input, Output
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
from pathlib import Path
import json
from datetime import datetime
import threading
import time

# Initialize Dash app
app = dash.Dash(__name__, title="Rezstack Constitutional Dashboard")
app.config.suppress_callback_exceptions = True

class DashboardData:
    """Data manager for dashboard"""
    
    def __init__(self):
        self.base_path = Path(r"G:\okiru-pure\rezsparse-trainer")
        self.reports_dir = self.base_path / "models" / "distilled" / "ollama_reports"
        
    def get_latest_report(self):
        """Get latest analysis report"""
        if not self.reports_dir.exists():
            return None
            
        json_files = list(self.reports_dir.glob("summary_*.json"))
        if not json_files:
            return None
            
        latest = max(json_files, key=lambda x: x.stat().st_mtime)
        with open(latest, 'r') as f:
            return json.load(f)
    
    def get_detailed_results(self):
        """Get detailed analysis results"""
        if not self.reports_dir.exists():
            return []
            
        json_files = list(self.reports_dir.glob("detailed_*.json"))
        if not json_files:
            return []
            
        latest = max(json_files, key=lambda x: x.stat().st_mtime)
        with open(latest, 'r') as f:
            return json.load(f)

# Create layout
app.layout = html.Div([
    # Header
    html.Div([
        html.H1("🏛️ Rezstack Constitutional Dashboard", 
               style={'color': '#FFD700', 'marginBottom': '20px'}),
        html.Div([
            html.Span("📊 Real-time AI Governance Analysis", 
                     style={'color': '#00B4D8', 'fontSize': '18px'}),
            html.Span(" | ", style={'margin': '0 10px'}),
            html.Span("💎 ELITE EDITION", 
                     style={'background': 'linear-gradient(135deg, #FFD700, #B8860B)', 
                            'color': '#000', 'padding': '5px 15px', 
                            'borderRadius': '15px', 'fontWeight': 'bold'})
        ], style={'display': 'flex', 'alignItems': 'center', 'marginBottom': '30px'})
    ], style={'textAlign': 'center', 'padding': '20px', 
              'background': 'linear-gradient(135deg, #0A0A0A, #1A1A2E)'}),
    
    # Metrics Row
    html.Div([
        # Overall Score
        html.Div([
            html.Div("🏆 Overall Score", 
                    style={'color': '#9CA3AF', 'fontSize': '14px'}),
            html.Div(id='overall-score', 
                    style={'fontSize': '48px', 'fontWeight': 'bold', 
                           'background': 'linear-gradient(135deg, #FFD700, #00B4D8)',
                           '-webkit-background-clip': 'text',
                           '-webkit-text-fill-color': 'transparent',
                           'margin': '10px 0'}),
            html.Div(id='score-change', style={'color': '#10B981', 'fontSize': '12px'})
        ], style={'flex': '1', 'textAlign': 'center', 'padding': '20px', 
                  'background': '#1A1A2E', 'borderRadius': '10px', 
                  'margin': '10px', 'border': '1px solid #303050'}),
        
        # Models Analyzed
        html.Div([
            html.Div("📦 Models Analyzed", 
                    style={'color': '#9CA3AF', 'fontSize': '14px'}),
            html.Div(id='models-count', 
                    style={'fontSize': '48px', 'fontWeight': 'bold', 
                           'color': '#00B4D8', 'margin': '10px 0'}),
            html.Div("Total Artifacts", style={'color': '#6B7280', 'fontSize': '12px'})
        ], style={'flex': '1', 'textAlign': 'center', 'padding': '20px', 
                  'background': '#1A1A2E', 'borderRadius': '10px', 
                  'margin': '10px', 'border': '1px solid #303050'}),
        
        # Risk Level
        html.Div([
            html.Div("⚠️ Overall Risk", 
                    style={'color': '#9CA3AF', 'fontSize': '14px'}),
            html.Div(id='risk-level', 
                    style={'fontSize': '48px', 'fontWeight': 'bold', 
                           'color': '#EF4444', 'margin': '10px 0'}),
            html.Div(id='risk-trend', style={'color': '#F59E0B', 'fontSize': '12px'})
        ], style={'flex': '1', 'textAlign': 'center', 'padding': '20px', 
                  'background': '#1A1A2E', 'borderRadius': '10px', 
                  'margin': '10px', 'border': '1px solid #303050'}),
    ], style={'display': 'flex', 'justifyContent': 'center', 'margin': '20px'}),
    
    # Charts Row
    html.Div([
        # Score Distribution
        html.Div([
            html.H3("📈 Score Distribution", 
                   style={'color': '#E5E7EB', 'marginBottom': '15px'}),
            dcc.Graph(id='score-distribution-chart', 
                     style={'height': '300px'})
        ], style={'flex': '1', 'padding': '20px', 'background': '#1A1A2E', 
                  'borderRadius': '10px', 'margin': '10px', 
                  'border': '1px solid #303050'}),
        
        # Risk Distribution
        html.Div([
            html.H3("⚖️ Risk Distribution", 
                   style={'color': '#E5E7EB', 'marginBottom': '15px'}),
            dcc.Graph(id='risk-distribution-chart', 
                     style={'height': '300px'})
        ], style={'flex': '1', 'padding': '20px', 'background': '#1A1A2E', 
                  'borderRadius': '10px', 'margin': '10px', 
                  'border': '1px solid #303050'}),
    ], style={'display': 'flex', 'margin': '20px'}),
    
    # Model List
    html.Div([
        html.H3("📋 Model Analysis Results", 
               style={'color': '#E5E7EB', 'marginBottom': '15px'}),
        html.Div(id='model-list-table',
                style={'maxHeight': '400px', 'overflowY': 'auto'})
    ], style={'padding': '20px', 'background': '#1A1A2E', 
              'borderRadius': '10px', 'margin': '20px', 
              'border': '1px solid #303050'}),
    
    # Recommendations
    html.Div([
        html.H3("💡 Top Recommendations", 
               style={'color': '#E5E7EB', 'marginBottom': '15px'}),
        html.Div(id='recommendations-list')
    ], style={'padding': '20px', 'background': '#1A1A2E', 
              'borderRadius': '10px', 'margin': '20px', 
              'border': '1px solid #303050'}),
    
    # Auto-refresh interval
    dcc.Interval(
        id='interval-component',
        interval=10*1000,  # 10 seconds
        n_intervals=0
    )
], style={'backgroundColor': '#0A0A0A', 'color': '#E5E7EB', 
          'minHeight': '100vh', 'fontFamily': 'Segoe UI, sans-serif'})

# Callbacks
data_manager = DashboardData()

@app.callback(
    [Output('overall-score', 'children'),
     Output('models-count', 'children'),
     Output('risk-level', 'children'),
     Output('score-distribution-chart', 'figure'),
     Output('risk-distribution-chart', 'figure'),
     Output('model-list-table', 'children'),
     Output('recommendations-list', 'children')],
    [Input('interval-component', 'n_intervals')]
)
def update_dashboard(n):
    """Update dashboard with latest data"""
    
    # Get latest report
    report = data_manager.get_latest_report()
    details = data_manager.get_detailed_results()
    
    if not report:
        return "N/A", "0", "Unknown", {}, {}, "No data", "No recommendations"
    
    # Overall metrics
    overall_score = f"{report.get('consensus_score_stats', {}).get('average', 0):.1f}%"
    models_count = str(report.get('total_models_analyzed', 0))
    
    # Determine overall risk level
    risk_dist = report.get('risk_distribution', {})
    if not risk_dist:
        risk_level = "Unknown"
    else:
        # Find most common risk level
        risk_level = max(risk_dist.items(), key=lambda x: x[1])[0]
    
    # Score distribution chart
    if details:
        scores = [r.get('consensus_score', 0) for r in details]
        fig_score = go.Figure(data=[go.Histogram(x=scores, 
                                                nbinsx=10,
                                                marker_color='#00B4D8',
                                                opacity=0.8)])
        fig_score.update_layout(
            plot_bgcolor='#1A1A2E',
            paper_bgcolor='#1A1A2E',
            font_color='#E5E7EB',
            showlegend=False,
            margin=dict(l=20, r=20, t=20, b=20),
            xaxis_title="Constitutional Score (%)",
            yaxis_title="Number of Models"
        )
    else:
        fig_score = go.Figure()
    
    # Risk distribution chart
    if risk_dist:
        labels = list(risk_dist.keys())
        values = list(risk_dist.values())
        
        # Color mapping for risks
        colors = []
        for label in labels:
            if 'low' in label.lower():
                colors.append('#10B981')
            elif 'medium' in label.lower():
                colors.append('#F59E0B')
            elif 'high' in label.lower():
                colors.append('#EF4444')
            elif 'critical' in label.lower():
                colors.append('#DC2626')
            else:
                colors.append('#6B7280')
        
        fig_risk = go.Figure(data=[go.Pie(labels=labels, values=values,
                                         marker=dict(colors=colors),
                                         hole=.3)])
        fig_risk.update_layout(
            plot_bgcolor='#1A1A2E',
            paper_bgcolor='#1A1A2E',
            font_color='#E5E7EB',
            showlegend=True,
            margin=dict(l=20, r=20, t=20, b=20)
        )
    else:
        fig_risk = go.Figure()
    
    # Model list table
    if details:
        rows = []
        for result in details[:10]:  # Show top 10
            model_info = result.get('model_info', {})
            name = model_info.get('name', 'Unknown')
            score = result.get('consensus_score', 0)
            risk = result.get('risk_level', 'Unknown')
            
            # Determine color for score
            score_color = '#EF4444'  # Red
            if score >= 80:
                score_color = '#10B981'  # Green
            elif score >= 60:
                score_color = '#F59E0B'  # Yellow
            
            rows.append(html.Tr([
                html.Td(name, style={'padding': '10px', 'borderBottom': '1px solid #303050'}),
                html.Td(f"{score:.1f}%", 
                       style={'padding': '10px', 'borderBottom': '1px solid #303050', 
                              'color': score_color, 'fontWeight': 'bold'}),
                html.Td(risk, style={'padding': '10px', 'borderBottom': '1px solid #303050'})
            ]))
        
        model_table = html.Table([
            html.Thead(html.Tr([
                html.Th("Model Name", style={'padding': '10px', 'textAlign': 'left'}),
                html.Th("Score", style={'padding': '10px', 'textAlign': 'left'}),
                html.Th("Risk", style={'padding': '10px', 'textAlign': 'left'})
            ])),
            html.Tbody(rows)
        ], style={'width': '100%'})
    else:
        model_table = "No model data available"
    
    # Recommendations list
    recommendations = report.get('top_recommendations', [])
    if recommendations:
        rec_list = html.Ul([
            html.Li(rec, style={'marginBottom': '8px', 'paddingLeft': '5px'}) 
            for rec in recommendations[:5]
        ])
    else:
        rec_list = "No recommendations available"
    
    return overall_score, models_count, risk_level, fig_score, fig_risk, model_table, rec_list

def run_dashboard():
    """Run the dashboard"""
    print("🌐 Starting Rezstack Constitutional Dashboard...")
    print("📊 Dashboard will be available at: http://localhost:8050")
    print("🔄 Auto-refreshing every 10 seconds")
    app.run_server(debug=False, port=8050)

if __name__ == '__main__':
    run_dashboard()
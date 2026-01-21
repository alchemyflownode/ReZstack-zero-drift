// src/services/intent-router.ts
export interface IntentClassification {
  primaryIntent: string;
  secondaryIntents: string[];
  confidence: number;
  urgency: 'immediate' | 'near-term' | 'exploratory';
  modality: 'visual' | 'data' | 'interactive' | 'administrative';
  userState: {
    isStruggling: boolean;
    context: string[];
    preferredDensity: 'compact' | 'balanced' | 'expanded';
  };
}

export interface ComponentManifest {
  id: string;
  name: string;
  description: string;
  intents: string[];
  props: Record<string, {
    type: string;
    required: boolean;
    description: string;
  }>;
  driftLaws: string[];
  motionProfile: 'subtle' | 'expressive' | 'immersive';
  accessibilityLevel: 'basic' | 'enhanced' | 'full';
}

export interface ViewArchitecture {
  layout: 'fullscreen' | 'overlay' | 'sidebar' | 'modal' | 'ambient';
  primaryComponent: string;
  supportingComponents: string[];
  transitions: {
    entry: 'slide-up' | 'fade-in' | 'scale' | 'morph';
    exit: 'slide-down' | 'fade-out' | 'scale-down' | 'morph-out';
    duration: number;
  };
  contextPersistence: 'session' | 'temporary' | 'persistent';
}

class IntentRouter {
  private readonly componentManifest: ComponentManifest[] = [
    {
      id: 'luxury-data-grid',
      name: 'LuxuryDataGrid',
      description: 'High-density financial data visualization with luxury styling',
      intents: ['appraisal', 'financial-report', 'roi-analysis', 'price-trends', 'mortgage-calculation'],
      props: {
        data: { type: 'FinancialData[]', required: true, description: 'Array of financial data points' },
        currency: { type: 'string', required: false, description: 'Display currency (default: CAD)' },
        density: { type: 'compact | balanced | expanded', required: false, description: 'Visual density level' },
        trendLines: { type: 'boolean', required: false, description: 'Show trend analysis lines' }
      },
      driftLaws: ['High-Density', 'Minimalist', 'Zero-Clutter'],
      motionProfile: 'subtle',
      accessibilityLevel: 'enhanced'
    },
    {
      id: 'vision-hero-gallery',
      name: 'VisionHeroGallery',
      description: 'Full-bleed luxury property visualization with immersive controls',
      intents: ['property-view', 'visual-tour', 'interior-explore', 'exterior-view', 'vibe-assessment'],
      props: {
        media: { type: 'PropertyMedia[]', required: true, description: 'Images, videos, 3D tours' },
        lightingMode: { type: 'daylight | twilight | cinematic', required: false, description: 'Visual ambiance' },
        autoRotate: { type: 'boolean', required: false, description: 'Auto-advance media' },
        hotspots: { type: 'Hotspot[]', required: false, description: 'Interactive information points' }
      },
      driftLaws: ['Full-Bleed', 'Luxury-Gold-Border', 'Cinematic-Transitions'],
      motionProfile: 'immersive',
      accessibilityLevel: 'full'
    },
    {
      id: 'sovereign-overlay',
      name: 'SovereignOverlay',
      description: 'Ambient intelligence overlay that appears when user struggles',
      intents: ['debug-assist', 'code-review', 'performance-warning', 'compliance-alert'],
      props: {
        context: { type: 'string', required: true, description: 'What triggered the overlay' },
        suggestions: { type: 'Suggestion[]', required: true, description: 'Actionable recommendations' },
        urgency: { type: 'low | medium | high', required: true, description: 'Response priority' },
        dismissible: { type: 'boolean', required: false, description: 'Can user dismiss' }
      },
      driftLaws: ['Non-Intrusive', 'Context-Aware', 'Self-Dismissing'],
      motionProfile: 'expressive',
      accessibilityLevel: 'full'
    },
    {
      id: 'adaptive-form',
      name: 'AdaptiveForm',
      description: 'Intelligent form that changes based on user input patterns',
      intents: ['contact', 'inquiry', 'booking', 'consultation'],
      props: {
        fields: { type: 'FormField[]', required: true, description: 'Dynamic form fields' },
        validation: { type: 'ValidationRules', required: false, description: 'Real-time validation' },
        progress: { type: 'boolean', required: false, description: 'Show completion progress' },
        adaptive: { type: 'boolean', required: false, description: 'Adapt fields based on responses' }
      },
      driftLaws: ['Zero-Friction', 'Progressive-Disclosure', 'Predictive-Validation'],
      motionProfile: 'subtle',
      accessibilityLevel: 'enhanced'
    },
    {
      id: 'ambient-dashboard',
      name: 'AmbientDashboard',
      description: 'Living dashboard that morphs based on user attention',
      intents: ['monitoring', 'analytics', 'dashboard', 'overview'],
      props: {
        metrics: { type: 'Metric[]', required: true, description: 'Key performance indicators' },
        layout: { type: 'grid | flow | radial', required: false, description: 'Visual arrangement' },
        liveUpdates: { type: 'boolean', required: false, description: 'Real-time data streaming' },
        focusMode: { type: 'boolean', required: false, description: 'Highlight active metrics' }
      },
      driftLaws: ['Breathing-Interface', 'Attention-Aware', 'Context-Shift'],
      motionProfile: 'expressive',
      accessibilityLevel: 'basic'
    }
  ];

  private readonly designTokens = {
    colors: {
      primary: 'var(--rezstack-primary)',
      secondary: 'var(--rezstack-secondary)',
      accent: 'var(--rezstack-accent)',
      luxuryGold: 'var(--abc168-gold)',
      luxuryNavy: 'var(--abc168-navy)',
      success: 'var(--rezstack-success)',
      warning: 'var(--rezstack-warning)',
      error: 'var(--rezstack-error)'
    },
    typography: {
      display: 'var(--font-display)',
      body: 'var(--font-body)',
      mono: 'var(--font-mono)'
    },
    spacing: {
      unit: 4,
      scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32]
    },
    motion: {
      subtle: { duration: 200, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      expressive: { duration: 400, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      immersive: { duration: 600, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    }
  };

  /**
   * Classify user intent using local LLM
   */
  async classifyIntent(
    userInput: string,
    context: {
      previousIntents: IntentClassification[];
      systemState: Record<string, any>;
      userBehavior: {
        attentionSpan: number;
        interactionRate: number;
        struggleIndicators: string[];
      };
    }
  ): Promise<IntentClassification> {
    // Use local LLM for intent classification
    const prompt = this.buildIntentClassificationPrompt(userInput, context);
    
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt,
          system: `You are an intent classifier. Analyze the user's input and return ONLY a JSON object matching this schema:
{
  "primaryIntent": "string (choose from: appraisal, property-view, contact, monitoring, debug-assist)",
  "secondaryIntents": ["string"],
  "confidence": "number (0-1)",
  "urgency": "immediate | near-term | exploratory",
  "modality": "visual | data | interactive | administrative",
  "userState": {
    "isStruggling": "boolean",
    "context": ["string"],
    "preferredDensity": "compact | balanced | expanded"
  }
}`,
          stream: false,
          options: { temperature: 0.1 } // Low temperature for consistent classification
        })
      });

      const data = await response.json();
      const classification = JSON.parse(data.response);
      
      // Enforce sovereign constraints
      return this.enforceClassificationLaws(classification);
    } catch (error) {
      // Fallback to rule-based classification
      return this.ruleBasedClassification(userInput, context);
    }
  }

  private buildIntentClassificationPrompt(
    input: string,
    context: any
  ): string {
    return `Analyze user intent with context:

USER INPUT: "${input}"

CONTEXT:
- Previous interactions: ${JSON.stringify(context.previousIntents.slice(-3))}
- System state: ${JSON.stringify(context.systemState)}
- User behavior: ${JSON.stringify(context.userBehavior)}

ANALYSIS RULES:
1. If input contains numbers, currency, or financial terms → financial intent
2. If input contains visual descriptors or emotional words → visual intent  
3. If user is struggling with system → debug-assist intent
4. If input is a question → consider consultative intent
5. If input is vague → exploratory intent

Return ONLY the JSON classification.`;
  }

  /**
   * Architect a complete view based on intent
   */
  async architectView(
    intent: IntentClassification,
    availableData: Record<string, any>
  ): Promise<ViewArchitecture> {
    // Select primary component
    const primaryComponent = this.selectPrimaryComponent(intent);
    
    // Select supporting components
    const supportingComponents = this.selectSupportingComponents(intent, primaryComponent);
    
    // Determine layout based on urgency and modality
    const layout = this.determineLayout(intent);
    
    // Design motion profile
    const transitions = this.designTransitions(intent, layout);
    
    return {
      layout,
      primaryComponent: primaryComponent.id,
      supportingComponents: supportingComponents.map(c => c.id),
      transitions,
      contextPersistence: intent.urgency === 'immediate' ? 'temporary' : 'session'
    };
  }

  private selectPrimaryComponent(intent: IntentClassification): ComponentManifest {
    // Score each component for this intent
    const scoredComponents = this.componentManifest.map(component => {
      let score = 0;
      
      // Primary intent match
      if (component.intents.includes(intent.primaryIntent)) {
        score += 100;
      }
      
      // Secondary intent matches
      intent.secondaryIntents.forEach(secondary => {
        if (component.intents.includes(secondary)) {
          score += 50;
        }
      });
      
      // Modality alignment
      if (intent.modality === 'visual' && component.motionProfile === 'immersive') {
        score += 30;
      }
      if (intent.modality === 'data' && component.driftLaws.includes('High-Density')) {
        score += 30;
      }
      
      // User state alignment
      if (intent.userState.preferredDensity === 'compact' && component.driftLaws.includes('High-Density')) {
        score += 20;
      }
      
      return { component, score };
    });
    
    // Return highest scoring component
    return scoredComponents.sort((a, b) => b.score - a.score)[0].component;
  }

  private selectSupportingComponents(
    intent: IntentClassification,
    primary: ComponentManifest
  ): ComponentManifest[] {
    // Filter out primary component
    const otherComponents = this.componentManifest.filter(c => c.id !== primary.id);
    
    // Select 1-2 supporting components based on secondary intents
    return otherComponents
      .filter(component => 
        intent.secondaryIntents.some(secondary => component.intents.includes(secondary))
      )
      .slice(0, 2);
  }

  private determineLayout(intent: IntentClassification): ViewArchitecture['layout'] {
    switch (intent.urgency) {
      case 'immediate':
        return intent.userState.isStruggling ? 'overlay' : 'modal';
      case 'near-term':
        return 'sidebar';
      default:
        return intent.modality === 'visual' ? 'fullscreen' : 'ambient';
    }
  }

  private designTransitions(
    intent: IntentClassification,
    layout: ViewArchitecture['layout']
  ): ViewArchitecture['transitions'] {
    const baseDuration = intent.urgency === 'immediate' ? 150 : 300;
    
    switch (layout) {
      case 'overlay':
        return {
          entry: 'slide-up',
          exit: 'slide-down',
          duration: baseDuration
        };
      case 'modal':
        return {
          entry: 'scale',
          exit: 'scale-down',
          duration: baseDuration * 1.5
        };
      case 'fullscreen':
        return {
          entry: 'morph',
          exit: 'morph-out',
          duration: baseDuration * 2
        };
      default:
        return {
          entry: 'fade-in',
          exit: 'fade-out',
          duration: baseDuration
        };
    }
  }

  /**
   * Generate props for a component based on intent and data
   */
  generateComponentProps(
    component: ComponentManifest,
    intent: IntentClassification,
    availableData: Record<string, any>
  ): Record<string, any> {
    const props: Record<string, any> = {};
    
    Object.entries(component.props).forEach(([propName, propDef]) => {
      if (propDef.required) {
        // Generate appropriate data based on prop type and intent
        props[propName] = this.generatePropValue(propName, propDef.type, intent, availableData);
      }
    });
    
    // Add design tokens
    props['designTokens'] = this.getDesignTokensForIntent(intent);
    
    // Add motion configuration
    props['motionConfig'] = this.designTokens.motion[component.motionProfile];
    
    return props;
  }

  private generatePropValue(
    propName: string,
    propType: string,
    intent: IntentClassification,
    data: Record<string, any>
  ): any {
    // Generate mock data if real data isn't available
    if (data[propName]) {
      return data[propName];
    }
    
    // Generate based on prop type
    switch (propType) {
      case 'FinancialData[]':
        return this.generateMockFinancialData(intent);
      case 'PropertyMedia[]':
        return this.generateMockPropertyMedia(intent);
      case 'Suggestion[]':
        return this.generateMockSuggestions(intent);
      case 'FormField[]':
        return this.generateMockFormFields(intent);
      case 'Metric[]':
        return this.generateMockMetrics(intent);
      default:
        return null;
    }
  }

  private getDesignTokensForIntent(intent: IntentClassification) {
    const tokens = { ...this.designTokens.colors };
    
    // Adjust based on intent
    if (intent.primaryIntent === 'appraisal') {
      tokens.accent = tokens.luxuryGold;
    }
    if (intent.modality === 'visual') {
      tokens.primary = tokens.luxuryNavy;
    }
    if (intent.userState.isStruggling) {
      tokens.accent = tokens.warning;
    }
    
    return tokens;
  }

  // Mock data generators (would connect to real data sources)
  private generateMockFinancialData(intent: IntentClassification) {
    return Array.from({ length: 10 }, (_, i) => ({
      date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
      value: 1000000 + Math.random() * 500000,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      confidence: 0.7 + Math.random() * 0.3
    }));
  }

  private enforceClassificationLaws(classification: any): IntentClassification {
    // Enforce sovereign laws on classification
    return {
      ...classification,
      confidence: Math.min(1, Math.max(0, classification.confidence)),
      urgency: ['immediate', 'near-term', 'exploratory'].includes(classification.urgency) 
        ? classification.urgency 
        : 'exploratory',
      userState: {
        ...classification.userState,
        preferredDensity: ['compact', 'balanced', 'expanded'].includes(classification.userState?.preferredDensity)
          ? classification.userState.preferredDensity
          : 'balanced'
      }
    };
  }

  private ruleBasedClassification(input: string, context: any): IntentClassification {
    const lowerInput = input.toLowerCase();
    
    // Rule-based fallback
    const financialTerms = ['price', 'cost', 'mortgage', 'loan', 'roi', 'investment', 'appraisal'];
    const visualTerms = ['view', 'look', 'see', 'show', 'picture', 'image', 'tour'];
    const struggleTerms = ['help', 'stuck', 'error', 'problem', 'fix', 'debug'];
    
    let primaryIntent = 'exploratory';
    if (financialTerms.some(term => lowerInput.includes(term))) primaryIntent = 'appraisal';
    if (visualTerms.some(term => lowerInput.includes(term))) primaryIntent = 'property-view';
    if (struggleTerms.some(term => lowerInput.includes(term))) primaryIntent = 'debug-assist';
    
    return {
      primaryIntent,
      secondaryIntents: [],
      confidence: 0.7,
      urgency: 'near-term',
      modality: primaryIntent === 'property-view' ? 'visual' : 'data',
      userState: {
        isStruggling: context.userBehavior.struggleIndicators.length > 0,
        context: [],
        preferredDensity: 'balanced'
      }
    };
  }
}

export const intentRouter = new IntentRouter();

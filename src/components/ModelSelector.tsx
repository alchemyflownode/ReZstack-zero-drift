// src/components/ModelSelector.tsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, AlertTriangle, CheckCircle, XCircle, Info, Shield } from 'lucide-react';
import { REZSTACK_MODEL_ROSTER } from '../config/model-strengths';
import { vramSafety, VRAMSafetyCheck } from '../services/vram-safety';
import { SystemProfile } from '../services/gpu-analyzer';

interface ModelSelectorProps {
  currentModel: string;
  onModelChange: (modelId: string, forced: boolean) => void;
  systemProfile: SystemProfile;
  disabled?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentModel,
  onModelChange,
  systemProfile,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(currentModel);
  const [safetyCheck, setSafetyCheck] = useState<VRAMSafetyCheck | null>(null);
  const [showForceConfirm, setShowForceConfirm] = useState(false);
  const [vramStatus, setVramStatus] = useState(vramSafety.getStatus());

  useEffect(() => {
    vramSafety.setSystemProfile(systemProfile);
    updateVramStatus();
  }, [systemProfile]);

  const updateVramStatus = () => {
    setVramStatus(vramSafety.getStatus());
  };

  const handleModelSelect = (modelId: string) => {
    const check = vramSafety.checkModelSafety(modelId, false);
    setSafetyCheck(check);

    if (check.allowed && (check.severity === 'safe' || check.severity === 'warning')) {
      // Safe to proceed
      setSelectedModel(modelId);
      onModelChange(modelId, false);
      setIsOpen(false);
      setSafetyCheck(null);
    } else if (check.allowed && check.severity === 'danger') {
      // Allow but show confirmation
      setSelectedModel(modelId);
      setShowForceConfirm(true);
    } else {
      // Blocked - show error
      setShowForceConfirm(false);
    }
  };

  const handleForceLoad = () => {
    if (selectedModel) {
      onModelChange(selectedModel, true);
      setShowForceConfirm(false);
      setSafetyCheck(null);
      setIsOpen(false);
    }
  };

  const getSeverityIcon = (severity: VRAMSafetyCheck['severity']) => {
    switch (severity) {
      case 'safe':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'danger':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'blocked':
        return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getSeverityColor = (severity: VRAMSafetyCheck['severity']) => {
    switch (severity) {
      case 'safe':
        return 'border-green-500/50 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'danger':
        return 'border-orange-500/50 bg-orange-500/10';
      case 'blocked':
        return 'border-red-500/50 bg-red-500/10';
    }
  };

  const currentModelData = REZSTACK_MODEL_ROSTER[currentModel];

  return (
    <div className="relative">
      {/* VRAM Status Bar */}
      <div className="mb-2 bg-gray-800/50 rounded p-2 text-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-400">VRAM Usage</span>
          <span className="text-white font-mono">
            {vramStatus.usedVRAM.toFixed(1)} / {vramStatus.totalVRAM.toFixed(1)} GB
            ({vramStatus.utilizationPercent.toFixed(0)}%)
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all ${
              vramStatus.utilizationPercent > 90
                ? 'bg-red-500'
                : vramStatus.utilizationPercent > 80
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(100, vramStatus.utilizationPercent)}%` }}
          />
        </div>
      </div>

      {/* Model Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg px-4 py-3 text-left disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex-1">
          <div className="text-xs text-gray-400 mb-1">Current Model</div>
          <div className="text-white font-medium">
            {currentModelData?.name || currentModel}
          </div>
          {currentModelData && (
            <div className="text-xs text-gray-500 mt-1">
              {currentModelData.executionMode === 'gpu' && '?? GPU-resident'}
              {currentModelData.executionMode === 'gpu-assisted' && '?? GPU-assisted'}
              {currentModelData.executionMode === 'cpu' && '?? CPU-only'}
              {' • '}
              {currentModelData.recommendedVramGB}GB VRAM
            </div>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {Object.entries(REZSTACK_MODEL_ROSTER).map(([modelId, model]) => {
            const check = vramSafety.checkModelSafety(modelId, false);
            const isCurrentModel = modelId === currentModel;

            return (
              <button
                key={modelId}
                onClick={() => !isCurrentModel && handleModelSelect(modelId)}
                disabled={isCurrentModel}
                className={`w-full text-left px-4 py-3 hover:bg-gray-750 border-b border-gray-700 last:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isCurrentModel ? 'bg-blue-500/10' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{model.name}</span>
                      {isCurrentModel && (
                        <span className="text-xs px-2 py-0.5 bg-blue-500/20 border border-blue-500/50 text-blue-300 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mb-1">
                      {model.executionMode === 'gpu' && '?? GPU-resident'}
                      {model.executionMode === 'gpu-assisted' && '?? GPU-assisted'}
                      {model.executionMode === 'cpu' && '?? CPU-only'}
                      {' • '}
                      {model.minVramGB}GB min / {model.recommendedVramGB}GB rec
                    </div>
                    <div className="text-xs text-gray-500">
                      {model.specialty} • {model.speed}
                    </div>
                  </div>
                  <div>
                    {getSeverityIcon(check.severity)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Safety Warning Modal */}
      {safetyCheck && (safetyCheck.severity === 'danger' || safetyCheck.severity === 'blocked') && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className={`max-w-lg w-full bg-gray-900 border-2 rounded-lg p-6 ${getSeverityColor(safetyCheck.severity)}`}>
            <div className="flex items-start gap-3 mb-4">
              {getSeverityIcon(safetyCheck.severity)}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">
                  {safetyCheck.severity === 'blocked' ? 'Cannot Load Model' : 'Performance Warning'}
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  {safetyCheck.reason}
                </p>

                {safetyCheck.recommendations && safetyCheck.recommendations.length > 0 && (
                  <div className="bg-gray-800/50 rounded p-3 text-xs space-y-1">
                    {safetyCheck.recommendations.map((rec, i) => (
                      <div key={i} className="text-gray-400">
                        {rec}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSafetyCheck(null);
                  setShowForceConfirm(false);
                  setIsOpen(false);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>

              {safetyCheck.severity === 'danger' && showForceConfirm && (
                <button
                  onClick={handleForceLoad}
                  className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Force Load Anyway
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

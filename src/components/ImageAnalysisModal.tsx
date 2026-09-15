import React, { useState, useRef } from "react";
import { X, Camera, Upload, Sparkles, Loader2, AlertCircle, FileImage, ArrowRight } from "lucide-react";
import { analyzeFinancialImageApi } from "../services/api";

interface ImageAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ImageAnalysisModal: React.FC<ImageAnalysisModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, WEBP).");
      return;
    }
    setError(null);
    setAnalysis(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setBase64Data(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!base64Data) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await analyzeFinancialImageApi(base64Data, userPrompt || undefined);
      setAnalysis(res.analysis);
    } catch (err: any) {
      setError("Failed to analyze image. Please verify the image file and try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setImagePreview(null);
    setBase64Data(null);
    setAnalysis(null);
    setUserPrompt("");
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto glass-modal-overlay flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl glass-modal-content rounded-3xl p-6 relative transition-all max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                Financial Chart & Screenshot Vision Analyzer
              </h3>
              <p className="text-xs text-slate-500">
                Upload a stock chart, earnings infographic, or news screenshot for instant Gemini breakdown
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload Zone */}
        {!imagePreview ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-emerald-500 bg-emerald-50/20"
                : isDarkMode
                ? "border-slate-700 bg-slate-800/40 hover:bg-slate-800"
                : "border-slate-300 bg-slate-50 hover:bg-slate-100"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              accept="image/*"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold mb-1">
              Drag and drop your financial chart or click to browse
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Supports candlestick charts, balance sheet tables, quarterly reports, and news clippings (PNG, JPG)
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xs">
              <FileImage className="w-3.5 h-3.5" />
              <span>Select Financial Image</span>
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview & Controls */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 max-h-64 flex items-center justify-center">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="max-h-64 object-contain"
              />
              <button
                onClick={resetAll}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black text-white text-xs font-semibold backdrop-blur-md"
              >
                Change Image
              </button>
            </div>

            {/* Optional question prompt */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Specific Question (Optional):
              </label>
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="e.g. Is this chart showing a bullish breakout? What do the green bars mean?"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Analyze trigger */}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-emerald-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing with Gemini Vision...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Financial Visual</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Vision Analysis Output Result */}
        {analysis && (
          <div className="mt-5 p-5 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Gemini Visual Financial Breakdown</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
              {analysis}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

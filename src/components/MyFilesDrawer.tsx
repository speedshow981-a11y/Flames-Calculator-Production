import React from 'react';
import { SavedCalculation } from '../types';
import { FolderArchive, Trash2, ArrowUpRight, X, Clock, FileText } from 'lucide-react';

interface MyFilesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCalculations: SavedCalculation[];
  onSelectSaved: (calc: SavedCalculation) => void;
  onDeleteSaved: (id: string) => void;
  onClearAll: () => void;
}

export const MyFilesDrawer: React.FC<MyFilesDrawerProps> = ({
  isOpen,
  onClose,
  savedCalculations,
  onSelectSaved,
  onDeleteSaved,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative flex h-full w-full max-w-md flex-col justify-between border-l border-slate-200 bg-white p-6 shadow-2xl text-slate-900">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <FolderArchive className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">My Saved Files</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-semibold">
                {savedCalculations.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* List of Saved Items */}
          <div className="mt-4 max-h-[70vh] space-y-3 overflow-y-auto pr-1">
            {savedCalculations.length > 0 ? (
              savedCalculations.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-slate-300"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                        {item.calculatorTitle}
                      </h4>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>{item.date}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteSaved(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition"
                      title="Delete calculation"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Primary Output */}
                  <div className="mt-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs">
                    <div className="text-[10px] font-semibold uppercase text-slate-400">
                      {item.result.primaryLabel}
                    </div>
                    <div className="text-base font-bold text-emerald-600">
                      {item.result.primaryValue}
                    </div>
                  </div>

                  {/* Load Action */}
                  <button
                    onClick={() => {
                      onSelectSaved(item);
                      onClose();
                    }}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition"
                  >
                    <span>Load Calculation</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-xs text-slate-400">
                <FileText className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                No calculations saved yet. Click "Save" on any calculation to store it here for future reference.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {savedCalculations.length > 0 && (
          <div className="border-t border-slate-100 pt-4">
            <button
              onClick={onClearAll}
              className="w-full rounded-xl border border-rose-200 bg-rose-50 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
            >
              Clear All Saved Files
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


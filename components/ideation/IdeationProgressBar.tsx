/**
 * IdeationProgressBar Component
 *
 * Visual progress indicator for the autonomous ideation flow.
 * Shows column fill status and overall completion state.
 */

import React from 'react';
import { IdeaNote, COLUMNS, getColumnFillStatus, isIdeationComplete } from '@/types/ideation';

interface Props {
  notes: IdeaNote[];
  isThinking: boolean;
}

export const IdeationProgressBar: React.FC<Props> = ({ notes, isThinking }) => {
  const columnStatus = getColumnFillStatus(notes);
  const filledCount = columnStatus.filter(c => c.count > 0).length;
  const totalNotes = notes.length;
  const isComplete = isIdeationComplete(notes);

  return (
    <div className="px-4 py-2 border-b border-white/10 bg-black/30">
      {isThinking ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-[#c5a47e] border-t-transparent rounded-full" />
          <span className="text-xs text-white/70">
            Researching and building your ideation canvas...
          </span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-white/50 uppercase tracking-wider">Progress</span>
            <span className={`text-xs px-1.5 py-0.5 ${
              isComplete ? 'bg-[#c5a47e]/20 text-[#c5a47e]' : 'bg-white/10 text-white/50'
            }`}>
              {totalNotes} notes • {filledCount}/5 sections
            </span>
            {isComplete && (
              <span className="text-xs text-[#c5a47e]">✓ Ready to build</span>
            )}
          </div>
          <div className="flex gap-1">
            {columnStatus.map((col, idx) => (
              <div key={idx} className="flex-1">
                <div className={`h-1.5 transition-colors ${
                  col.count > 0 ? 'bg-[#c5a47e]' : 'bg-white/10'
                }`} />
                <span className={`text-[9px] ${
                  col.count > 0 ? 'text-white/60' : 'text-white/30'
                }`}>
                  {col.name} ({col.count})
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default IdeationProgressBar;

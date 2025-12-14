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
    <div className="px-4 py-2 border-b border-[#D4E5D4] bg-[#EDF5F0]">
      {isThinking ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-[#6B8E6B] border-t-transparent rounded-full" />
          <span className="text-xs text-[#1E2E1E] opacity-70">
            Researching and building your ideation canvas...
          </span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-[#8FA58F] uppercase tracking-wider">Progress</span>
            <span className={`text-xs px-1.5 py-0.5 ${
              isComplete ? 'bg-[#6B8E6B]/20 text-[#6B8E6B]' : 'bg-[#D4E5D4] text-[#8FA58F]'
            }`}>
              {totalNotes} notes • {filledCount}/5 sections
            </span>
            {isComplete && (
              <span className="text-xs text-[#6B8E6B]">✓ Ready to build</span>
            )}
          </div>
          <div className="flex gap-1">
            {columnStatus.map((col, idx) => (
              <div key={idx} className="flex-1">
                <div className={`h-1.5 transition-colors ${
                  col.count > 0 ? 'bg-[#6B8E6B]' : 'bg-[#D4E5D4]'
                }`} />
                <span className={`text-[9px] ${
                  col.count > 0 ? 'text-[#1E2E1E] opacity-60' : 'text-[#8FA58F]'
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

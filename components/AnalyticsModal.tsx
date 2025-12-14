
import React from 'react';
import { Presentation, AnalyticsSession } from '@/types';
import { X, Clock, Activity, BarChart3, TrendingUp, Eye, Share2 } from 'lucide-react';
import { StatCard } from './shared/StatCard';

interface AnalyticsModalProps {
    presentation: Presentation;
    onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ presentation, onClose }) => {
    const sessions = presentation.analytics || [];
    const totalSessions = sessions.length;
    const totalTime = sessions.reduce((acc, s) => acc + s.totalDuration, 0);
    const avgDuration = totalSessions > 0 ? Math.round(totalTime / totalSessions) : 0;

    // Aggregate slide durations for heatmap
    const slideAggregates: Record<string, number> = {};
    let maxSlideDuration = 0;

    sessions.forEach(session => {
        Object.entries(session.slideDurations).forEach(([slideId, duration]) => {
            slideAggregates[slideId] = (slideAggregates[slideId] || 0) + (duration as number);
            if (slideAggregates[slideId] > maxSlideDuration) maxSlideDuration = slideAggregates[slideId];
        });
    });

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}m ${s}s`;
    };

    return (
        <div className="fixed inset-0 z-[1100] bg-[#1E2E1E]/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white w-full max-w-4xl h-[80vh] rounded-lg shadow-[0_8px_32px_rgba(107,142,107,0.15)] overflow-hidden flex flex-col border border-[#D4E5D4]" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-[#D4E5D4] flex justify-between items-center bg-[#F5FAF7]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#6B8E6B]/10 text-[#6B8E6B] flex items-center justify-center">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#1E2E1E]">Engagement Analytics</h2>
                            <p className="text-xs text-[#8FA58F] uppercase tracking-widest font-bold">Rehearsal & Presentation Insights</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#EDF5F0] rounded-lg transition-colors">
                        <X className="w-6 h-6 text-[#8FA58F]" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard icon={Eye} label="Total Sessions" value={totalSessions} />
                        <StatCard icon={Clock} label="Total Time" value={formatTime(totalTime)} />
                        <StatCard icon={TrendingUp} label="Avg. Duration" value={formatTime(avgDuration)} />
                    </div>
                    
                    {/* Pro Tip Box */}
                    <div className="mb-10 p-4 bg-[#6B8E6B]/5 border border-[#6B8E6B]/20 rounded-lg flex items-start gap-3">
                        <Share2 className="w-5 h-5 text-[#6B8E6B] mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-[#1E2E1E]">Sharing Stats</h4>
                            <p className="text-sm text-[#4A5D4A] leading-relaxed">
                                Analytics are recorded locally. To see how others view your deck, ask them to send the deck file back to you after they view it. Their session data will be included in the file.
                            </p>
                        </div>
                    </div>

                    {/* Heatmap Chart */}
                    {totalSessions > 0 ? (
                        <div className="mb-12">
                            <div className="flex items-center gap-2 mb-6">
                                <BarChart3 className="w-5 h-5 text-[#6B8E6B]" />
                                <h3 className="font-bold text-[#1E2E1E]">Engagement Heatmap (Time per Slide)</h3>
                            </div>
                            <div className="space-y-3">
                                {presentation.slides.map((slide, idx) => {
                                    const duration = slideAggregates[slide.id] || 0;
                                    const percentage = maxSlideDuration > 0 ? (duration / maxSlideDuration) * 100 : 0;

                                    return (
                                        <div key={slide.id} className="flex items-center gap-4">
                                            <div className="w-8 text-xs font-bold text-[#8FA58F] text-right">{idx + 1}</div>
                                            <div className="flex-1 relative h-10 bg-[#EDF5F0] rounded-lg overflow-hidden group">
                                                {/* Bar */}
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#6B8E6B] to-[#5A7A5A] rounded-lg transition-all duration-500 opacity-90 group-hover:opacity-100"
                                                    style={{ width: `${Math.max(percentage, 1)}%` }}
                                                />
                                                {/* Label */}
                                                <div className="absolute inset-0 flex items-center justify-between px-4 z-10 pointer-events-none">
                                                    <span className="text-xs font-medium text-[#1E2E1E] truncate max-w-[70%] group-hover:text-[#1E2E1E] transition-colors mix-blend-difference text-white">{slide.title}</span>
                                                    <span className="text-xs font-bold text-[#4A5D4A] group-hover:text-[#1E2E1E] mix-blend-difference text-white/80">{formatTime(duration)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-[#F5FAF7] rounded-lg border border-dashed border-[#D4E5D4]">
                            <Activity className="w-12 h-12 text-[#D4E5D4] mx-auto mb-4" />
                            <h3 className="text-[#1E2E1E] font-bold">No Data Recorded</h3>
                            <p className="text-[#8FA58F] text-sm">Present this deck to start collecting rehearsal analytics.</p>
                        </div>
                    )}

                    {/* Recent Sessions List */}
                    {totalSessions > 0 && (
                         <div>
                            <h3 className="font-bold text-[#1E2E1E] mb-4">Recent Sessions</h3>
                            <div className="border border-[#D4E5D4] rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-[#F5FAF7] border-b border-[#D4E5D4] text-[#8FA58F] text-xs uppercase font-bold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Duration</th>
                                            <th className="px-6 py-3">Focus Slide</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#EDF5F0]">
                                        {[...sessions].reverse().slice(0, 5).map((session) => {
                                            // Find slide with max duration in this session
                                            let maxId = '';
                                            let maxD = -1;
                                            Object.entries(session.slideDurations).forEach(([id, d]) => {
                                                const duration = d as number;
                                                if(duration > maxD) { maxD = duration; maxId = id; }
                                            });
                                            const focusSlide = presentation.slides.find(s => s.id === maxId);

                                            return (
                                                <tr key={session.id} className="hover:bg-[#F5FAF7] transition-colors">
                                                    <td className="px-6 py-4 font-medium text-[#1E2E1E]">{new Date(session.timestamp).toLocaleDateString()} <span className="text-[#8FA58F] font-normal">{new Date(session.timestamp).toLocaleTimeString()}</span></td>
                                                    <td className="px-6 py-4">{formatTime(session.totalDuration)}</td>
                                                    <td className="px-6 py-4 text-[#4A5D4A] truncate max-w-xs">{focusSlide?.title || 'N/A'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

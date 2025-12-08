
import React from 'react';
import { Presentation, AnalyticsSession } from '../types';
import { X, Clock, Activity, BarChart3, TrendingUp, Eye, Share2 } from 'lucide-react';

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
        <div className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900">Engagement Analytics</h2>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Rehearsal & Presentation Insights</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-zinc-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                            <div className="flex items-center gap-2 mb-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                                <Eye className="w-4 h-4" /> Total Sessions
                            </div>
                            <div className="text-4xl font-black text-zinc-900">{totalSessions}</div>
                        </div>
                        <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                            <div className="flex items-center gap-2 mb-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                                <Clock className="w-4 h-4" /> Total Time
                            </div>
                            <div className="text-4xl font-black text-zinc-900">{formatTime(totalTime)}</div>
                        </div>
                        <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                            <div className="flex items-center gap-2 mb-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                                <TrendingUp className="w-4 h-4" /> Avg. Duration
                            </div>
                            <div className="text-4xl font-black text-zinc-900">{formatTime(avgDuration)}</div>
                        </div>
                    </div>
                    
                    {/* Pro Tip Box */}
                    <div className="mb-10 p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start gap-3">
                        <Share2 className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-indigo-900">Sharing Stats</h4>
                            <p className="text-sm text-indigo-700 leading-relaxed">
                                Analytics are recorded locally. To see how others view your deck, ask them to send the deck file back to you after they view it. Their session data will be included in the file.
                            </p>
                        </div>
                    </div>

                    {/* Heatmap Chart */}
                    {totalSessions > 0 ? (
                        <div className="mb-12">
                            <div className="flex items-center gap-2 mb-6">
                                <BarChart3 className="w-5 h-5 text-indigo-600" />
                                <h3 className="font-bold text-zinc-900">Engagement Heatmap (Time per Slide)</h3>
                            </div>
                            <div className="space-y-3">
                                {presentation.slides.map((slide, idx) => {
                                    const duration = slideAggregates[slide.id] || 0;
                                    const percentage = maxSlideDuration > 0 ? (duration / maxSlideDuration) * 100 : 0;
                                    
                                    return (
                                        <div key={slide.id} className="flex items-center gap-4">
                                            <div className="w-8 text-xs font-bold text-zinc-400 text-right">{idx + 1}</div>
                                            <div className="flex-1 relative h-10 bg-zinc-100 rounded-lg overflow-hidden group">
                                                {/* Bar */}
                                                <div 
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg transition-all duration-500 opacity-90 group-hover:opacity-100" 
                                                    style={{ width: `${Math.max(percentage, 1)}%` }}
                                                />
                                                {/* Label */}
                                                <div className="absolute inset-0 flex items-center justify-between px-4 z-10 pointer-events-none">
                                                    <span className="text-xs font-medium text-zinc-700 truncate max-w-[70%] group-hover:text-zinc-900 transition-colors mix-blend-difference text-white">{slide.title}</span>
                                                    <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-900 mix-blend-difference text-white/80">{formatTime(duration)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                            <Activity className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                            <h3 className="text-zinc-900 font-bold">No Data Recorded</h3>
                            <p className="text-zinc-500 text-sm">Present this deck to start collecting rehearsal analytics.</p>
                        </div>
                    )}

                    {/* Recent Sessions List */}
                    {totalSessions > 0 && (
                         <div>
                            <h3 className="font-bold text-zinc-900 mb-4">Recent Sessions</h3>
                            <div className="border border-zinc-200 rounded-xl overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-xs uppercase font-bold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">Duration</th>
                                            <th className="px-6 py-3">Focus Slide</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
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
                                                <tr key={session.id} className="hover:bg-zinc-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-zinc-900">{new Date(session.timestamp).toLocaleDateString()} <span className="text-zinc-400 font-normal">{new Date(session.timestamp).toLocaleTimeString()}</span></td>
                                                    <td className="px-6 py-4">{formatTime(session.totalDuration)}</td>
                                                    <td className="px-6 py-4 text-zinc-600 truncate max-w-xs">{focusSlide?.title || 'N/A'}</td>
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

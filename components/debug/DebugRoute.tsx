/**
 * DebugRoute
 *
 * Main debug dashboard with navigation to all debug tools.
 * Shows system info, quick actions, and links to debug pages.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Image,
  Layers,
  Monitor,
  Trash2,
  RefreshCw,
  Bug,
  Settings,
  Database,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertCircle,
  Info,
  Server,
  User,
  FileText,
  Search,
  Copy,
  Sparkles,
} from 'lucide-react';
import { useDebugUI } from '@/contexts/DebugUIContext';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/config';
import {
  getDebugMe,
  getDebugUsers,
  getDebugPresentations,
  lookupUserByEmail,
  getDebugStats,
  DebugMeResponse,
  DebugUsersResponse,
  DebugPresentationsResponse,
  DebugStatsResponse,
  DebugLookupResponse,
} from '@/services/api/debugService';

// ============ System Info ============

function SystemInfo() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check API status on mount
  React.useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        setApiStatus(response.ok ? 'online' : 'offline');
      } catch {
        setApiStatus('offline');
      }
    };
    checkApi();
  }, []);

  const info = [
    { label: 'Environment', value: import.meta.env.MODE },
    { label: 'Debug Mode', value: import.meta.env.VITE_DEBUG_MODE === 'true' ? 'Enabled' : 'Disabled' },
    { label: 'API URL', value: API_BASE_URL },
    { label: 'React Version', value: React.version },
    { label: 'Build Time', value: new Date().toISOString().split('T')[0] },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-[#D4E5D4]">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#1E2E1E]">
        <Monitor className="w-5 h-5 text-[#6B8E6B]" />
        System Information
      </h2>

      <div className="space-y-3">
        {info.map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-[#8FA58F]">{label}</span>
            <span className="font-mono text-[#1E2E1E]">{value}</span>
          </div>
        ))}

        {/* API Status */}
        <div className="flex justify-between text-sm">
          <span className="text-[#8FA58F]">API Status</span>
          <span className="flex items-center gap-1.5 text-[#1E2E1E]">
            {apiStatus === 'checking' && (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                Checking...
              </>
            )}
            {apiStatus === 'online' && (
              <>
                <Wifi className="w-3 h-3 text-green-600" />
                <span className="text-green-600">Online</span>
              </>
            )}
            {apiStatus === 'offline' && (
              <>
                <WifiOff className="w-3 h-3 text-red-600" />
                <span className="text-red-600">Offline</span>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============ Quick Actions ============

function QuickActions() {
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const clearCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      setActionStatus('Cache cleared!');
      setTimeout(() => setActionStatus(null), 2000);
    } catch (err) {
      setActionStatus('Failed to clear cache');
    }
  };

  const clearIndexedDB = async () => {
    try {
      const databases = await indexedDB.databases();
      for (const db of databases) {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
        }
      }
      setActionStatus('IndexedDB cleared!');
      setTimeout(() => setActionStatus(null), 2000);
    } catch (err) {
      setActionStatus('Failed to clear IndexedDB');
    }
  };

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#D4E5D4]">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#1E2E1E]">
        <Settings className="w-5 h-5 text-[#6B8E6B]" />
        Quick Actions
      </h2>

      <div className="space-y-3">
        <button
          onClick={clearCache}
          className="w-full px-4 py-2 bg-[#F5FAF7] hover:bg-[#D4E5D4] rounded-lg text-left flex items-center gap-3 transition-colors border border-[#D4E5D4]"
        >
          <Trash2 className="w-4 h-4 text-amber-600" />
          <div>
            <div className="font-medium text-[#1E2E1E]">Clear Cache</div>
            <div className="text-xs text-[#8FA58F]">Remove localStorage & sessionStorage</div>
          </div>
        </button>

        <button
          onClick={clearIndexedDB}
          className="w-full px-4 py-2 bg-[#F5FAF7] hover:bg-[#D4E5D4] rounded-lg text-left flex items-center gap-3 transition-colors border border-[#D4E5D4]"
        >
          <Database className="w-4 h-4 text-amber-600" />
          <div>
            <div className="font-medium text-[#1E2E1E]">Clear IndexedDB</div>
            <div className="text-xs text-[#8FA58F]">Remove all stored presentations</div>
          </div>
        </button>

        <button
          onClick={reloadPage}
          className="w-full px-4 py-2 bg-[#F5FAF7] hover:bg-[#D4E5D4] rounded-lg text-left flex items-center gap-3 transition-colors border border-[#D4E5D4]"
        >
          <RefreshCw className="w-4 h-4 text-blue-600" />
          <div>
            <div className="font-medium text-[#1E2E1E]">Reload Page</div>
            <div className="text-xs text-[#8FA58F]">Full page refresh</div>
          </div>
        </button>
      </div>

      {/* Status message */}
      {actionStatus && (
        <div className="mt-4 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2 border border-green-200">
          <CheckCircle className="w-4 h-4" />
          {actionStatus}
        </div>
      )}
    </div>
  );
}

// ============ Server Data Inspector ============

function ServerDataInspector() {
  const { isAuthenticated, user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'me' | 'users' | 'presentations' | 'lookup' | 'stats'>('me');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [meData, setMeData] = useState<DebugMeResponse | null>(null);
  const [usersData, setUsersData] = useState<DebugUsersResponse | null>(null);
  const [presentationsData, setPresentationsData] = useState<DebugPresentationsResponse | null>(null);
  const [statsData, setStatsData] = useState<DebugStatsResponse | null>(null);
  const [lookupData, setLookupData] = useState<DebugLookupResponse | null>(null);
  const [lookupEmail, setLookupEmail] = useState('');

  const fetchData = async (tab: typeof activeTab) => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      switch (tab) {
        case 'me':
          const me = await getDebugMe();
          setMeData(me);
          break;
        case 'users':
          const users = await getDebugUsers(1, 50);
          setUsersData(users);
          break;
        case 'presentations':
          const presentations = await getDebugPresentations(1, 50);
          setPresentationsData(presentations);
          break;
        case 'stats':
          const stats = await getDebugStats();
          setStatsData(stats);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async () => {
    if (!lookupEmail.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await lookupUserByEmail(lookupEmail.trim());
      setLookupData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData(activeTab);
    }
  }, [activeTab, isAuthenticated]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-xl p-6 border border-[#D4E5D4]">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#1E2E1E]">
          <Server className="w-5 h-5 text-[#6B8E6B]" />
          Server Data Inspector
        </h2>
        <div className="text-center py-8 text-[#8FA58F]">
          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Sign in to inspect server data</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'me' as const, label: 'My Data', icon: User },
    { id: 'users' as const, label: 'All Users', icon: User },
    { id: 'presentations' as const, label: 'All Decks', icon: FileText },
    { id: 'lookup' as const, label: 'Lookup', icon: Search },
    { id: 'stats' as const, label: 'Stats', icon: Database },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-[#D4E5D4]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2 text-[#1E2E1E]">
          <Server className="w-5 h-5 text-[#6B8E6B]" />
          Server Data Inspector
        </h2>
        <button
          onClick={() => fetchData(activeTab)}
          disabled={loading}
          className="p-2 hover:bg-[#D4E5D4] rounded-lg transition-colors disabled:opacity-50 text-[#1E2E1E]"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${
              activeTab === tab.id
                ? 'bg-[#6B8E6B] text-white'
                : 'bg-[#F5FAF7] hover:bg-[#D4E5D4] border border-[#D4E5D4] text-[#1E2E1E]'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading && !error && (
          <div className="text-center py-8 text-[#8FA58F]">
            <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin" />
            <p>Loading...</p>
          </div>
        )}

        {/* My Data Tab */}
        {activeTab === 'me' && meData && !loading && (
          <div className="space-y-4">
            <div className="bg-[#F5FAF7] rounded-lg p-4 border border-[#D4E5D4]">
              <h3 className="font-semibold mb-2 text-[#6B8E6B]">Current User</h3>
              <div className="space-y-1 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-[#8FA58F]">ID:</span>
                  <span className="flex items-center gap-1 text-[#1E2E1E]">
                    {meData.user.id.slice(0, 8)}...
                    <button onClick={() => copyToClipboard(meData.user.id)} className="hover:text-[#6B8E6B]">
                      <Copy className="w-3 h-3" />
                    </button>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8FA58F]">Email:</span>
                  <span className="text-[#1E2E1E]">{meData.user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8FA58F]">Name:</span>
                  <span className="text-[#1E2E1E]">{meData.user.name || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8FA58F]">Provider:</span>
                  <span className="text-[#1E2E1E]">{meData.user.auth_provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8FA58F]">Created:</span>
                  <span className="text-[#1E2E1E]">{new Date(meData.user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F5FAF7] rounded-lg p-4 border border-[#D4E5D4]">
              <h3 className="font-semibold mb-2 text-[#6B8E6B]">
                My Presentations ({meData.presentations.count})
              </h3>
              {meData.presentations.items.length === 0 ? (
                <p className="text-[#8FA58F] text-sm">No presentations found for this user</p>
              ) : (
                <div className="space-y-2">
                  {meData.presentations.items.map((p) => (
                    <div key={p.id} className="text-sm bg-white rounded p-2 border border-[#D4E5D4]">
                      <div className="font-medium text-[#1E2E1E]">{p.topic}</div>
                      <div className="text-[#8FA58F] text-xs">
                        {p.slide_count} slides | {new Date(p.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* All Users Tab */}
        {activeTab === 'users' && usersData && !loading && (
          <div className="space-y-2">
            <div className="text-sm text-[#8FA58F] mb-2">
              Total: {usersData.total} users | Your ID: {usersData.current_user_id.slice(0, 8)}...
            </div>
            {usersData.users.map((u) => (
              <div
                key={u.id}
                className={`text-sm rounded p-3 ${
                  u.is_current_user ? 'bg-[#6B8E6B]/20 border border-[#6B8E6B]' : 'bg-[#F5FAF7] border border-[#D4E5D4]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium flex items-center gap-2 text-[#1E2E1E]">
                      {u.email}
                      {u.is_current_user && (
                        <span className="text-xs bg-[#6B8E6B] text-white px-1.5 py-0.5 rounded">YOU</span>
                      )}
                    </div>
                    <div className="text-[#8FA58F] text-xs">
                      ID: {u.id.slice(0, 8)}... | {u.auth_provider} | {u.presentation_count} decks
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All Presentations Tab */}
        {activeTab === 'presentations' && presentationsData && !loading && (
          <div className="space-y-2">
            <div className="text-sm text-[#8FA58F] mb-2">
              Total: {presentationsData.total} presentations
            </div>
            {presentationsData.presentations.map((p) => (
              <div
                key={p.id}
                className={`text-sm rounded p-3 ${
                  p.owner?.is_current_user ? 'bg-[#6B8E6B]/20 border border-[#6B8E6B]' : 'bg-[#F5FAF7] border border-[#D4E5D4]'
                }`}
              >
                <div className="font-medium text-[#1E2E1E]">{p.topic}</div>
                <div className="text-[#8FA58F] text-xs mt-1">
                  {p.slide_count} slides | Theme: {p.theme_id || 'default'}
                </div>
                <div className="text-[#8FA58F] text-xs">
                  Owner: {p.owner?.email || 'Unknown'}
                  {p.owner?.is_current_user && (
                    <span className="ml-1 text-[#6B8E6B]">(you)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lookup Tab */}
        {activeTab === 'lookup' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="email"
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                placeholder="Enter email address..."
                className="flex-1 px-3 py-2 bg-white border border-[#D4E5D4] rounded-lg text-sm text-[#1E2E1E] placeholder:text-[#8FA58F] focus:outline-none focus:ring-2 focus:ring-[#6B8E6B]"
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              />
              <button
                onClick={handleLookup}
                disabled={loading || !lookupEmail.trim()}
                className="px-4 py-2 bg-[#6B8E6B] text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-[#5A7A5A] transition-colors"
              >
                Search
              </button>
            </div>

            {lookupData && (
              <div className="bg-[#F5FAF7] rounded-lg p-4 border border-[#D4E5D4]">
                {!lookupData.found ? (
                  <p className="text-amber-600 text-sm">{lookupData.message}</p>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-[#6B8E6B]">User Found</h4>
                      <div className="text-sm mt-1 space-y-1 text-[#1E2E1E]">
                        <div>Email: {lookupData.user?.email}</div>
                        <div>ID: {lookupData.user?.id}</div>
                        <div>Provider: {lookupData.user?.auth_provider}</div>
                        {lookupData.is_current_user && (
                          <div className="text-[#6B8E6B]">This is your account</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#6B8E6B]">
                        Presentations ({lookupData.presentations?.length || 0})
                      </h4>
                      {lookupData.presentations?.length === 0 ? (
                        <p className="text-[#8FA58F] text-sm">No presentations</p>
                      ) : (
                        <div className="space-y-1 mt-1">
                          {lookupData.presentations?.map((p) => (
                            <div key={p.id} className="text-sm bg-white rounded p-2 border border-[#D4E5D4] text-[#1E2E1E]">
                              {p.topic} ({p.slide_count} slides)
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && statsData && !loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F5FAF7] rounded-lg p-4 text-center border border-[#D4E5D4]">
                <div className="text-2xl font-bold text-[#6B8E6B]">{statsData.totals.users}</div>
                <div className="text-sm text-[#8FA58F]">Total Users</div>
              </div>
              <div className="bg-[#F5FAF7] rounded-lg p-4 text-center border border-[#D4E5D4]">
                <div className="text-2xl font-bold text-[#6B8E6B]">{statsData.totals.presentations}</div>
                <div className="text-sm text-[#8FA58F]">Total Presentations</div>
              </div>
            </div>

            <div className="bg-[#F5FAF7] rounded-lg p-4 border border-[#D4E5D4]">
              <h4 className="font-semibold mb-2 text-[#6B8E6B]">Top Users by Presentations</h4>
              <div className="space-y-2">
                {statsData.top_users_by_presentations.map((u, i) => (
                  <div
                    key={u.id}
                    className={`flex justify-between text-sm ${u.is_current_user ? 'text-[#6B8E6B]' : 'text-[#1E2E1E]'}`}
                  >
                    <span>
                      {i + 1}. {u.email} {u.is_current_user && '(you)'}
                    </span>
                    <span>{u.presentation_count} decks</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ Debug Tools Grid ============

function DebugTools() {
  const tools = [
    {
      to: '/debug/image-agent',
      icon: Sparkles,
      title: 'Image Agent Inspector',
      description: 'View agent reasoning, validation scores, and prompt refinements',
      color: 'text-amber-400',
    },
    {
      to: '/debug/thumbnails',
      icon: Image,
      title: 'Thumbnail Generator',
      description: 'Generate preview thumbnails for all themes and archetypes',
      color: 'text-purple-400',
    },
    {
      to: '/debug/components',
      icon: Layers,
      title: 'Component Showcase',
      description: 'View and test all UI components in one place',
      color: 'text-blue-400',
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold flex items-center gap-2 text-[#1E2E1E]">
        <Bug className="w-5 h-5 text-[#6B8E6B]" />
        Debug Tools
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="group bg-white hover:bg-[#F5FAF7] rounded-xl p-6 transition-colors border border-[#D4E5D4]"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg bg-[#F5FAF7] ${tool.color}`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold group-hover:text-[#6B8E6B] transition-colors text-[#1E2E1E]">
                  {tool.title}
                </h3>
                <p className="text-sm text-[#8FA58F] mt-1">{tool.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============ Main Component ============

export function DebugRoute() {
  const { isDebugModeAvailable, isDebugUIEnabled, actions } = useDebugUI();

  if (!isDebugModeAvailable) {
    return (
      <div className="min-h-screen bg-[#F5FAF7] text-[#1E2E1E] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Debug Mode Not Available</h1>
          <p className="text-[#8FA58F] mb-4">
            Set <code className="bg-[#D4E5D4] px-2 py-0.5 rounded">VITE_DEBUG_MODE=true</code> in your .env.local
          </p>
          <Link
            to="/app"
            className="px-4 py-2 bg-[#6B8E6B] text-white rounded-lg font-medium inline-flex items-center gap-2 hover:bg-[#5A7A5A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5FAF7] text-[#1E2E1E]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F5FAF7]/90 backdrop-blur-sm border-b border-[#D4E5D4]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/app"
              className="p-2 hover:bg-[#D4E5D4] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Bug className="w-5 h-5 text-[#6B8E6B]" />
                Debug Dashboard
              </h1>
              <p className="text-xs text-[#8FA58F]">Developer tools and diagnostics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-sm text-[#8FA58F]">Debug UI</span>
              <button
                onClick={actions.toggleDebugUI}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  isDebugUIEnabled ? 'bg-[#6B8E6B]' : 'bg-[#D4E5D4]'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    isDebugUIEnabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </label>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Warning Banner */}
        <div className="mb-8 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong className="text-amber-700">Development Only</strong>
            <p className="text-amber-600 mt-0.5">
              These tools are only available when VITE_DEBUG_MODE is enabled.
              They will not appear in production builds.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tools & Server Data */}
          <div className="lg:col-span-2 space-y-8">
            <ServerDataInspector />
            <DebugTools />
          </div>

          {/* Right Column - Info & Actions */}
          <div className="space-y-6">
            <SystemInfo />
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}

export default DebugRoute;

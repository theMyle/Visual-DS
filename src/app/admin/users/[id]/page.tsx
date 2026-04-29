import { auth } from "@clerk/nextjs/server";
import { fetchAdminApi } from "@/app/lib/admin/api";
import AdminSidebar from "../../components/AdminSidebar";
import Link from "next/link";
import { AdminUserDTO } from "../../components/UserManagement";

interface LessonProgressDTO {
  user_id: string;
  lesson_category: string;
  lesson_id: string;
  completed_at: string;
}

interface SimulatorProgressDTO {
  user_id: string;
  simulator_category: string;
  path: string;
  is_completed: boolean;
  updated_at: string | null;
}

interface QuizResultDTO {
  id: string;
  user_id: string;
  quiz_category: string;
  quiz_id: string;
  score: number;
  total_items: number;
  taken_at: string;
}

interface UserLearningOutcomes {
  lesson_progress: LessonProgressDTO[];
  simulator_progress: SimulatorProgressDTO[];
  quiz_results: QuizResultDTO[];
}

interface CurriculumChallenge {
  id: string;
  slug: string;
  title: string;
  order_index: number;
  path: string;
}

interface SimulatorCurriculumResponse {
  id: string;
  slug: string;
  name: string;
  description: string;
  is_active: boolean;
  challenges: CurriculumChallenge[];
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { getToken } = await auth();

  let user: AdminUserDTO | null = null;
  let outcomes: UserLearningOutcomes | null = null;
  let allSimulators: SimulatorCurriculumResponse[] = [];
  let error: string | null = null;

  try {
    const users = await fetchAdminApi<AdminUserDTO[]>("users", getToken);
    user = users.find((u) => u.user_id === id) || null;
    
    if (user) {
      [outcomes, allSimulators] = await Promise.all([
        fetchAdminApi<UserLearningOutcomes>(`users/${id}/progress`, getToken),
        fetchAdminApi<SimulatorCurriculumResponse[]>("simulators", getToken)
      ]);
    } else {
      error = "User not found";
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to fetch user data";
    console.error("Admin User Detail Fetch Error:", e);
  }

  // Pre-process Simulator Progress
  const simulatorStats = allSimulators.map(sim => {
    const userChallenges = outcomes?.simulator_progress.filter(p => p.simulator_category === sim.slug) || [];
    const completedCount = userChallenges.filter(p => p.is_completed).length;
    
    // Map all challenges to their status
    const challengeStatuses = sim.challenges.map(c => {
      const progress = userChallenges.find(p => p.path.endsWith(c.slug));
      return {
        ...c,
        is_completed: progress?.is_completed || false,
        updated_at: progress?.updated_at || null,
        attempted: !!progress
      };
    });

    return {
      name: sim.name,
      slug: sim.slug,
      completed: completedCount,
      total: sim.challenges.length,
      challenges: challengeStatuses
    };
  });

  if (error || !user) {
    return (
      <div className="flex h-screen w-full bg-slate-50">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-2 mb-6 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to Users
            </Link>
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Error Loading User</h2>
              <p className="text-slate-500">{error || "User not found"}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin" className="text-slate-500 hover:text-indigo-600 flex items-center gap-2 mb-4 text-sm font-medium transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Back to Users
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {user.first_name?.[0] || "?"}{user.last_name?.[0] || "?"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{user.first_name} {user.last_name}</h1>
                <p className="text-slate-500">{user.email} • ID: {user.user_id.slice(0, 8)}...</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Info Card - Full Width */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Joined On</p>
                  <p className="text-slate-700 font-medium">{new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Clerk ID</p>
                  <p className="text-slate-700 font-medium font-mono text-xs truncate" title={user.clerk_id}>{user.clerk_id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Last Updated</p>
                  <p className="text-slate-700 font-medium">{new Date(user.updated_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
              </div>
            </div>

            {/* Simulator Progress */}
            <div className="bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
                  Simulator Progress
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[500px]">
                {simulatorStats.length > 0 ? (
                  <div className="">
                    {simulatorStats.map((sim) => (
                      <div key={sim.slug} className="border-b border-slate-100 last:border-b-0">
                        <div className="bg-slate-100/80 px-4 py-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
                          <div className="flex items-center gap-2">
                            <span className={`w-1 h-1 rounded-full ${sim.completed === sim.total ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            {sim.name}
                          </div>
                          <span className="text-slate-500">{sim.completed}/{sim.total}</span>
                        </div>
                        <ul className="divide-y divide-slate-50">
                          {sim.challenges.map((c, i) => (
                            <li key={i} className="px-4 py-2 hover:bg-slate-50/50 transition-colors">
                              <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                  <span className={`text-sm ${c.is_completed ? 'text-slate-700 font-medium' : c.attempted ? 'text-amber-700 font-medium' : 'text-slate-400 font-normal'} capitalize`}>
                                    {c.title}
                                  </span>
                                  <span className="text-[9px] text-slate-400">
                                    {c.updated_at ? `Last active: ${new Date(c.updated_at).toLocaleDateString()}` : c.attempted ? 'In Progress' : 'Not Attempted'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {c.is_completed ? (
                                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center" title="Completed">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    </span>
                                  ) : c.attempted ? (
                                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center" title="In Progress">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                    </span>
                                  ) : (
                                    <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center" title="Not Started">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm italic">No simulator data available.</div>
                )}
              </div>
            </div>

            {/* Assessment Progress */}
            <div className="bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                  Recent Assessments
                </h3>
                <span className="bg-purple-50 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-100">
                  {Math.min(outcomes?.quiz_results.length || 0, 10)}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[500px]">
                {outcomes?.quiz_results && outcomes.quiz_results.length > 0 ? (
                  <div className="">
                    {Object.entries(
                      [...outcomes.quiz_results]
                        .sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())
                        .slice(0, 10)
                        .reduce((acc, qr) => {
                        const cat = qr.quiz_category || "General";
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(qr);
                        return acc;
                      }, {} as Record<string, QuizResultDTO[]>)
                    ).map(([category, items]) => (
                      <div key={category} className="border-b border-slate-100 last:border-b-0">
                        <div className="bg-slate-100/80 px-4 py-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2 sticky top-0 z-10 backdrop-blur-sm">
                          <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                          {category}
                        </div>
                        <ul className="divide-y divide-slate-50">
                          {items.map((qr, i) => {
                            const percentage = Math.round((qr.score / qr.total_items) * 100);
                            const colorClass = percentage >= 80 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : percentage >= 50 ? 'text-amber-600 bg-amber-50 border-amber-100' : 'text-red-600 bg-red-50 border-red-100';
                            
                            return (
                              <li key={i} className="px-4 py-2.5 hover:bg-slate-50/50 transition-colors">
                                <div className="flex justify-between items-start mb-1.5">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-700 capitalize">{qr.quiz_id.replace(/-/g, ' ')}</span>
                                    <span className="text-[10px] text-slate-400">{new Date(qr.taken_at).toLocaleDateString()}</span>
                                  </div>
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${colorClass}`}>
                                    {qr.score}/{qr.total_items}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                   <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full ${percentage >= 80 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                   </div>
                                   <span className="text-[10px] font-medium text-slate-500 w-8 text-right">{percentage}%</span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm italic">No assessments completed yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

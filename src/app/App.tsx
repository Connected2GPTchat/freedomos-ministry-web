import { useState } from "react";
import {
  LayoutDashboard, Users, Calendar, FileText, BookOpen, BarChart3,
  Bell, Menu, LogOut, Heart, Shield, AlertTriangle,
  CheckCircle, Clock, Clipboard, Award
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

type Screen =
  | "login" | "pastor-dashboard" | "ministry-lead-dashboard" | "coach-dashboard"
  | "care-receiver-dashboard" | "care-receiver-profile" | "session-notes"
  | "scheduling" | "forms-center" | "freedom-journey" | "reports" | "training";
type Role = "pastor" | "ministry-lead" | "coach" | "care-receiver";

const sessionData = [
  { month: "Jan", sessions: 42 }, { month: "Feb", sessions: 55 }, { month: "Mar", sessions: 61 },
  { month: "Apr", sessions: 48 }, { month: "May", sessions: 72 }, { month: "Jun", sessions: 80 },
];
const referralData = [
  { name: "Self Referral", value: 38, color: "#D4AF37" },
  { name: "Pastor", value: 27, color: "#F4C542" },
  { name: "Counselor", value: 18, color: "#B79F74" },
  { name: "Small Group", value: 17, color: "#5A5A5A" },
];
const careReceivers = [
  { id: 1, name: "Sarah Mitchell", coach: "Pastor James", status: "Active", session: 4, stage: "Inner Healing", nextAppt: "Jun 19", flagged: false },
  { id: 2, name: "David Chen", coach: "Coach Rivera", status: "Active", session: 2, stage: "Intake", nextAppt: "Jun 20", flagged: false },
  { id: 3, name: "Emma Thompson", coach: "Coach Williams", status: "Active", session: 7, stage: "Deliverance", nextAppt: "Jun 21", flagged: true },
  { id: 4, name: "Marcus Johnson", coach: "Pastor James", status: "Active", session: 3, stage: "Forgiveness", nextAppt: "Jun 22", flagged: false },
  { id: 5, name: "Lisa Park", coach: "Coach Rivera", status: "Graduated", session: 10, stage: "Follow-Up", nextAppt: "Jul 1", flagged: false },
];
const coaches = [
  { name: "Coach Rivera", assigned: 6, capacity: 8, certified: true },
  { name: "Coach Williams", assigned: 5, capacity: 8, certified: true },
  { name: "Pastor James", assigned: 4, capacity: 6, certified: true },
  { name: "Coach Thompson", assigned: 3, capacity: 8, certified: false },
];
const upcomingSessions = [
  { time: "9:00 AM", name: "Sarah Mitchell", coach: "Pastor James", room: "Room A", type: "Session 4" },
  { time: "10:30 AM", name: "David Chen", coach: "Coach Rivera", room: "Room B", type: "Session 2" },
  { time: "1:00 PM", name: "Emma Thompson", coach: "Coach Williams", room: "Room C", type: "Session 7" },
  { time: "2:30 PM", name: "Marcus Johnson", coach: "Pastor James", room: "Room A", type: "Session 3" },
];
const journeyStages = [
  { stage: "Intake", date: "May 1", complete: true },
  { stage: "Session 1", date: "May 8", complete: true },
  { stage: "Session 2", date: "May 15", complete: true },
  { stage: "Session 3", date: "May 22", complete: true },
  { stage: "Session 4", date: "Jun 5", complete: true },
  { stage: "Session 5", date: "Jun 19", complete: false },
  { stage: "Graduation", date: "—", complete: false },
  { stage: "Follow-Up", date: "—", complete: false },
];
const trainingCourses = [
  { code: "F101", title: "Freedom 101", lessons: 8, progress: 100, certified: true },
  { code: "F201", title: "Freedom 201", lessons: 10, progress: 100, certified: true },
  { code: "F301", title: "Freedom 301", lessons: 12, progress: 65, certified: false },
  { code: "F401", title: "Freedom 401", lessons: 14, progress: 0, certified: false },
];

function Badge({ children, color = "gold" }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    gold: "bg-[#fdf3d0] text-[#7a5c00] border border-[#D4AF37]/40",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    red: "bg-red-50 text-red-700 border border-red-100",
    gray: "bg-[#f5f2e8] text-[#5A5A5A] border border-[#999E9E]/30",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.gold}`}>{children}</span>;
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
      <div className="text-2xl font-semibold mt-2" style={{ fontFamily: "'Lora', serif" }}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", screen: "pastor-dashboard" as Screen },
  { icon: Users, label: "Care Receivers", screen: "care-receiver-profile" as Screen },
  { icon: Calendar, label: "Scheduling", screen: "scheduling" as Screen },
  { icon: FileText, label: "Session Notes", screen: "session-notes" as Screen },
  { icon: Clipboard, label: "Forms Center", screen: "forms-center" as Screen },
  { icon: Heart, label: "Freedom Journey", screen: "freedom-journey" as Screen },
  { icon: BarChart3, label: "Reports", screen: "reports" as Screen },
  { icon: BookOpen, label: "Training", screen: "training" as Screen },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [role, setRole] = useState<Role>("pastor");
  const [mobileOpen, setMobileOpen] = useState(false);

  const titles: Record<Screen, string> = {
    login: "Sign in",
    "pastor-dashboard": "Pastor Dashboard",
    "ministry-lead-dashboard": "Ministry Lead Dashboard",
    "coach-dashboard": "Coach Dashboard",
    "care-receiver-dashboard": "My Portal",
    "care-receiver-profile": "Care Receivers",
    "session-notes": "Session Notes",
    scheduling: "Scheduling",
    "forms-center": "Forms Center",
    "freedom-journey": "Freedom Journey",
    reports: "Reports",
    training: "Training",
  };

  if (screen === "login") {
    return (
      <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="hidden lg:flex flex-col justify-between w-1/2 p-12" style={{ background: "linear-gradient(135deg, #111111 0%, #2a2a2a 50%, #3a3200 100%)" }}>
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37] flex items-center justify-center"><Heart size={20} className="text-[#111111]" /></div>
              <span className="text-white text-xl font-semibold" style={{ fontFamily: "'Lora', serif" }}>FreedomOS</span>
            </div>
            <h2 className="text-4xl font-semibold text-white leading-tight mb-4" style={{ fontFamily: "'Lora', serif" }}>
              Equipping coaches.<br /><span style={{ color: "#B79F74" }}>Restoring lives.</span>
            </h2>
            <p className="text-[#E6C87C]/80 max-w-sm">Hosted web test app for Freedom Coaching ministry operations. Mock data only.</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: "'Lora', serif" }}>Welcome back</h1>
            <p className="text-muted-foreground text-sm mb-6">Sign in to test the hosted prototype. No real auth.</p>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input className="w-full mb-4 px-3 py-2.5 rounded-lg border border-border bg-input-background text-sm" defaultValue="pastor@gracefellowship.org" />
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input type="password" className="w-full mb-6 px-3 py-2.5 rounded-lg border border-border bg-input-background text-sm" defaultValue="password" />
            <button onClick={() => setScreen("pastor-dashboard")} className="w-full py-2.5 rounded-lg bg-[#D4AF37] text-[#111] font-medium text-sm">Sign in</button>
            <p className="text-xs text-muted-foreground mt-4">Web only. Not an iOS or Android app.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`} style={{ background: "var(--sidebar)" }}>
        <div className="px-6 py-5 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#D4AF37] flex items-center justify-center"><Heart size={18} className="text-[#111]" /></div>
            <div>
              <div className="text-white font-semibold text-sm" style={{ fontFamily: "'Lora', serif" }}>FreedomOS</div>
              <div className="text-xs" style={{ color: "var(--sidebar-foreground)", opacity: 0.6 }}>Grace Fellowship Church</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ icon: Icon, label, screen: s }) => (
            <button key={s} onClick={() => { setScreen(s); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium"
              style={screen === s ? { background: "var(--sidebar-primary)", color: "#fff" } : { color: "var(--sidebar-foreground)" }}>
              <Icon size={16} />{label}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t" style={{ borderColor: "var(--sidebar-border)" }}>
          <button onClick={() => setScreen("login")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm" style={{ color: "var(--sidebar-foreground)" }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-4">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <h1 className="font-semibold text-sm flex-1 truncate" style={{ fontFamily: "'Lora', serif" }}>{titles[screen]}</h1>
          <div className="hidden md:flex items-center gap-1 bg-muted rounded-lg p-1">
            {(["pastor", "ministry-lead", "coach", "care-receiver"] as Role[]).map((r) => (
              <button key={r} onClick={() => { setRole(r); setScreen(r === "pastor" ? "pastor-dashboard" : r === "ministry-lead" ? "ministry-lead-dashboard" : r === "coach" ? "coach-dashboard" : "care-receiver-dashboard"); }}
                className={`px-3 py-1 rounded-md text-xs font-medium ${role === r ? "bg-white shadow-sm text-[#a07c10]" : "text-muted-foreground"}`}>
                {r === "ministry-lead" ? "Lead" : r === "care-receiver" ? "Receiver" : r[0].toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          <Bell size={18} className="text-muted-foreground" />
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#111] text-xs font-semibold flex items-center justify-center">PJ</div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {(screen === "pastor-dashboard" || screen === "ministry-lead-dashboard") && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard label="Active Care Receivers" value={42} sub="+5 this month" />
                <StatCard label="Sessions this month" value={80} sub="75 completed" />
                <StatCard label="Certified coaches" value={3} sub="1 in training" />
                <StatCard label="Flagged cases" value={1} sub="Needs review" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
                  <h2 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Lora', serif" }}>Session volume</h2>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sessionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="month" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Area type="monotone" dataKey="sessions" stroke="#D4AF37" fill="#F4C542" fillOpacity={0.25} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                  <h2 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Lora', serif" }}>Referral source</h2>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={referralData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                          {referralData.map((d) => <Cell key={d.name} fill={d.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold mb-4" style={{ fontFamily: "'Lora', serif" }}>Today's sessions</h2>
                <div className="space-y-3">
                  {upcomingSessions.map((s) => (
                    <div key={s.time + s.name} className="flex items-center justify-between text-sm border-b border-border pb-2">
                      <div className="flex items-center gap-3"><Clock size={14} /><span className="font-medium">{s.time}</span><span>{s.name}</span></div>
                      <span className="text-muted-foreground">{s.coach} · {s.room}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {screen === "coach-dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Assigned" value={6} sub="of 8 capacity" />
                <StatCard label="Sessions this week" value={7} />
                <StatCard label="Notes due" value={2} />
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                {careReceivers.map(c => (
                  <div key={c.id} className="flex items-center justify-between py-3 border-b border-border text-sm">
                    <span className="font-medium">{c.name}</span>
                    <Badge>{c.stage}</Badge>
                    <span className="text-muted-foreground">{c.nextAppt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {screen === "care-receiver-dashboard" && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold" style={{ fontFamily: "'Lora', serif" }}>Welcome, Sarah</h2>
                <p className="text-sm text-muted-foreground mt-1">Next session: Jun 19 with Pastor James</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                {journeyStages.map(j => (
                  <div key={j.stage} className="flex items-center gap-3 py-2 text-sm">
                    {j.complete ? <CheckCircle size={16} className="text-emerald-600" /> : <Clock size={16} className="text-muted-foreground" />}
                    <span className="flex-1">{j.stage}</span>
                    <span className="text-muted-foreground">{j.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {screen === "care-receiver-profile" && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left"><tr>
                  <th className="px-4 py-3">Name</th><th>Coach</th><th>Status</th><th>Stage</th><th>Next</th>
                </tr></thead>
                <tbody>
                  {careReceivers.map(c => (
                    <tr key={c.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{c.name} {c.flagged && <AlertTriangle size={14} className="inline text-red-500" />}</td>
                      <td>{c.coach}</td>
                      <td><Badge color={c.status === "Graduated" ? "green" : "gold"}>{c.status}</Badge></td>
                      <td>{c.stage}</td>
                      <td>{c.nextAppt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {screen === "scheduling" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <h2 className="text-sm font-semibold" style={{ fontFamily: "'Lora', serif" }}>Upcoming</h2>
                {upcomingSessions.map(s => (
                  <div key={s.time} className="flex justify-between text-sm border-b border-border pb-2">
                    <span>{s.time} · {s.name}</span><span className="text-muted-foreground">{s.room}</span>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: "'Lora', serif" }}>Coach load</h2>
                {coaches.map(c => (
                  <div key={c.name} className="flex justify-between text-sm py-2 border-b border-border">
                    <span>{c.name} {c.certified ? <Shield size={12} className="inline text-[#D4AF37]" /> : null}</span>
                    <span>{c.assigned}/{c.capacity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {screen === "session-notes" && (
            <div className="bg-card border border-border rounded-xl p-5 max-w-3xl space-y-4">
              <div className="text-sm text-muted-foreground">Sarah Mitchell · Session 4 · Jun 5</div>
              <textarea className="w-full h-40 px-3 py-2.5 rounded-lg border border-border bg-input-background text-sm" defaultValue="Continued inner healing work. Significant breakthrough around inadequacy agreements." />
              <button className="px-4 py-2 rounded-lg bg-[#D4AF37] text-[#111] text-sm font-medium">Save note (local only)</button>
            </div>
          )}

          {screen === "forms-center" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {["Intake Form", "Session Consent", "Emergency Contact", "Graduation Survey"].map(f => (
                <div key={f} className="bg-card border border-border rounded-xl p-5">
                  <div className="font-medium">{f}</div>
                  <div className="text-xs text-muted-foreground mt-1">Prototype form · not submitted to a server</div>
                </div>
              ))}
            </div>
          )}

          {screen === "freedom-journey" && (
            <div className="bg-card border border-border rounded-xl p-5 max-w-xl">
              {journeyStages.map(j => (
                <div key={j.stage} className="flex items-center gap-3 py-3 border-b border-border text-sm">
                  {j.complete ? <CheckCircle size={16} className="text-emerald-600" /> : <Clock size={16} className="text-muted-foreground" />}
                  <span className="flex-1 font-medium">{j.stage}</span>
                  <span className="text-muted-foreground">{j.date}</span>
                </div>
              ))}
            </div>
          )}

          {screen === "reports" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <StatCard label="Completion rate" value="94%" />
                <StatCard label="Avg sessions to graduate" value="9.2" />
                <StatCard label="Active pipeline" value={42} />
              </div>
              <div className="bg-card border border-border rounded-xl p-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sessionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" /><YAxis /><Tooltip />
                    <Area type="monotone" dataKey="sessions" stroke="#D4AF37" fill="#F4C542" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {screen === "training" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {trainingCourses.map(c => (
                <div key={c.code} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">{c.code}</div>
                      <div className="font-semibold" style={{ fontFamily: "'Lora', serif" }}>{c.title}</div>
                    </div>
                    {c.certified && <Award size={18} className="text-[#D4AF37]" />}
                  </div>
                  <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-[#D4AF37]" style={{ width: `${c.progress}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">{c.lessons} lessons · {c.progress}%</div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

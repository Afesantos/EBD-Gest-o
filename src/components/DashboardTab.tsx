import { useMemo, useState } from "react";
import { EbdClass, Student, Attendance, Teacher, EbdSettings } from "../types";
import { Users, ClipboardCheck, TrendingUp, CalendarDays, Coins, MessageSquare, BookOpen, Gift, Smile } from "lucide-react";

interface DashboardTabProps {
  classes: EbdClass[];
  students: Student[];
  attendance: Attendance[];
  teachers: Teacher[];
  settings: EbdSettings;
  onSendMessage: (studentName: string, phone: string, type: "birthday" | "absence") => void;
}

export function DashboardTab({
  classes,
  students,
  attendance,
  teachers,
  settings,
  onSendMessage,
}: DashboardTabProps) {
  const [selectedDashboardClass, setSelectedDashboardClass] = useState<string>("all");

  const activeStudents = useMemo(() => students.filter((s) => s.active), [students]);

  // Current Month Index
  const currentMonthName = "Junho";

  // Filter attendance records by selected class
  const filteredAttendance = useMemo(() => {
    if (selectedDashboardClass === "all") return attendance;
    return attendance.filter((a) => a.classId === selectedDashboardClass);
  }, [attendance, selectedDashboardClass]);

  // General Statistics Calculations
  const stats = useMemo(() => {
    let totalPresentCount = 0;
    let totalPossibleCount = 0;
    let totalOfferingsSum = 0;
    let totalBiblesCount = 0;
    let totalMagazinesCount = 0;
    let totalVisitorsCount = 0;

    filteredAttendance.forEach((att) => {
      totalOfferingsSum += att.offeringValue || 0;
      totalBiblesCount += att.biblesCount || 0;
      totalMagazinesCount += att.magazinesCount || 0;
      totalVisitorsCount += att.visitorCount || 0;

      att.records.forEach((rec) => {
        // Only count if student actually exists in our current list to avoid stale index mismatches
        const stud = students.find((s) => s.id === rec.studentId);
        if (stud) {
          totalPossibleCount++;
          if (rec.present) {
            totalPresentCount++;
          }
        }
      });
    });

    const averageAttendanceRate =
      totalPossibleCount > 0 ? Math.round((totalPresentCount / totalPossibleCount) * 100) : 0;

    return {
      activeCount: selectedDashboardClass === "all" 
        ? activeStudents.length 
        : activeStudents.filter(s => s.classId === selectedDashboardClass).length,
      averageRate: averageAttendanceRate,
      totalOfferings: totalOfferingsSum,
      totalBibles: totalBiblesCount,
      totalMagazines: totalMagazinesCount,
      totalVisitors: totalVisitorsCount,
    };
  }, [filteredAttendance, activeStudents, students, selectedDashboardClass]);

  // Birthday logic (Checking current month, which is June [06])
  const monthlyBirthdays = useMemo(() => {
    return students.filter((s) => {
      if (!s.birthDate) return false;
      const parts = s.birthDate.split("-");
      if (parts.length < 2) return false;
      const birthMonth = parts[1];
      return birthMonth === "06"; // June matches target month
    }).sort((a, b) => {
      const dayA = parseInt(a.birthDate.split("-")[2]) || 0;
      const dayB = parseInt(b.birthDate.split("-")[2]) || 0;
      return dayA - dayB;
    });
  }, [students]);

  // High-fidelity dynamic weekly history chart
  const attendanceTrendData = useMemo(() => {
    // Group attendance by date, calculating total possible, present, date label
    const grouped: { [date: string]: { date: string; present: number; total: number; offering: number } } = {};
    
    // Sort all attendance entries chronologically
    const sortedAttendance = [...attendance].sort((a, b) => a.date.localeCompare(b.date));

    sortedAttendance.forEach((att) => {
      // If we filtered by class, skip others
      if (selectedDashboardClass !== "all" && att.classId !== selectedDashboardClass) return;

      const dateLabel = att.date;
      if (!grouped[dateLabel]) {
        grouped[dateLabel] = { date: dateLabel, present: 0, total: 0, offering: 0 };
      }

      grouped[dateLabel].offering += att.offeringValue || 0;
      
      att.records.forEach((rec) => {
        const stud = students.find((s) => s.id === rec.studentId);
        if (stud) {
          grouped[dateLabel].total++;
          if (rec.present) {
            grouped[dateLabel].present++;
          }
        }
      });
    });

    return Object.values(grouped).map((g) => {
      const percentage = g.total > 0 ? Math.round((g.present / g.total) * 100) : 0;
      // Get formatted date like "07/06"
      const parts = g.date.split("-");
      const shortDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : g.date;

      return {
        date: g.date,
        shortDate,
        present: g.present,
        total: g.total,
        percentage,
        offering: g.offering,
      };
    }).slice(-6); // Display last 6 classes
  }, [attendance, students, selectedDashboardClass]);

  // Class comparison metrics
  const classStats = useMemo(() => {
    return classes.map((c) => {
      const classStudents = students.filter((s) => s.classId === c.id && s.active);
      const classAttendances = attendance.filter((a) => a.classId === c.id);
      
      let presentSum = 0;
      let totalSum = 0;

      classAttendances.forEach((att) => {
        att.records.forEach((rec) => {
          if (classStudents.some((cs) => cs.id === rec.studentId)) {
            totalSum++;
            if (rec.present) presentSum++;
          }
        });
      });

      const rate = totalSum > 0 ? Math.round((presentSum / totalSum) * 100) : 0;

      return {
        id: c.id,
        name: c.name,
        studentCount: classStudents.length,
        attendanceRate: rate,
        totalSessions: classAttendances.length,
      };
    });
  }, [classes, students, attendance]);

  return (
    <div className="space-y-6" id="dashboard_panel">
      {/* Overview stats & filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-sm" id="dashboard_filter_header">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Painel de Resumos</h2>
          <p className="text-sm text-slate-500">Dados gerais e acompanhamento da {settings.churchName}</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="dashboard-class-select" className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filtrar Turma:</label>
          <select
            id="dashboard-class-select"
            value={selectedDashboardClass}
            onChange={(e) => setSelectedDashboardClass(e.target.value)}
            className="w-full md:w-56 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
          >
            <option value="all">Todas as Salas</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard_stats_grid">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-4 rounded-2xl border border-indigo-100 shadow-sm flex items-center gap-3 md:gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-indigo-500 text-white rounded-xl">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-indigo-700/80">Alunos Ativos</p>
            <p className="text-xl md:text-2xl font-bold text-indigo-950 mt-0.5">{stats.activeCount}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-3 md:gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-500 text-white rounded-xl">
            <ClipboardCheck size={22} />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-emerald-700/80">Frequência Média</p>
            <p className="text-xl md:text-2xl font-bold text-emerald-950 mt-0.5">{stats.averageRate}%</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-3 md:gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-amber-500 text-white rounded-xl">
            <Coins size={22} />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-amber-700/80">Total de Ofertas</p>
            <p className="text-xl md:text-2xl font-bold text-amber-950 mt-0.5">
              R$ {stats.totalOfferings.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 rounded-2xl border border-purple-100 shadow-sm flex items-center gap-3 md:gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-purple-500 text-white rounded-xl">
            <Smile size={22} />
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium text-purple-700/80">Visitantes Registrados</p>
            <p className="text-xl md:text-2xl font-bold text-purple-950 mt-0.5">{stats.totalVisitors} pessoas</p>
          </div>
        </div>
      </div>

      {/* Materials & Resources Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="dashboard_supplies_grid">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">Bíblias Levadas</p>
              <p className="text-xs text-slate-400">Total trazido pelos alunos nas lições</p>
            </div>
          </div>
          <span className="text-xl font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full">{stats.totalBibles}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <CalendarDays size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">Revistas de Estudo</p>
              <p className="text-xs text-slate-400">Total de revistas utilizadas nas classes</p>
            </div>
          </div>
          <span className="text-xl font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full">{stats.totalMagazines}</span>
        </div>
      </div>

      {/* Graphs and statistics split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard_main_layout">
        {/* Weekly Trend Graph - High-Fidelity Interactive SVG */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4" id="trend_chart_card">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-base md:text-lg flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" />
                Histórico de Frequência (%)
              </h3>
              <p className="text-xs text-slate-400">Acompanhamento dos últimos 6 domingos</p>
            </div>
          </div>

          {attendanceTrendData.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-slate-400 gap-2 border border-dashed border-slate-200 rounded-xl bg-slate-50">
              <ClipboardCheck size={32} className="opacity-40" />
              <p className="text-xs">Nenhum registro de chamada salvo para esta seleção.</p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Custom SVG Line or Bar Chart */}
              <div className="relative w-full h-44 flex items-end justify-between px-2 pt-6 pb-2 bg-slate-50/50 rounded-xl">
                {/* Y-Axis guide lines */}
                <div className="absolute inset-x-0 top-0 border-b border-slate-100 pointer-events-none h-0"></div>
                <div className="absolute inset-x-0 h-1/4 top-1/4 border-b border-slate-100/50 pointer-events-none"></div>
                <div className="absolute inset-x-0 h-1/2 top-1/2 border-b border-slate-100/50 pointer-events-none"></div>
                <div className="absolute inset-x-0 h-3/4 top-3/4 border-b border-slate-100/50 pointer-events-none"></div>

                {attendanceTrendData.map((item, idx) => (
                  <div key={item.date} className="flex-1 flex flex-col items-center h-full justify-end group z-10">
                    {/* Tooltip on hover */}
                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full mb-1 bg-slate-800 text-white text-xxs px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap">
                      Frequência: {item.percentage}% ({item.present}/{item.total}) <br />
                      Ofertas: R$ {item.offering.toFixed(2)}
                    </div>

                    {/* Bar visual height represent frequency */}
                    <div className="w-8 md:w-12 bg-indigo-500 hover:bg-indigo-600 rounded-t-md transition-all flex flex-col items-center justify-end relative shadow-sm"
                         style={{ height: `${Math.max(12, item.percentage)}%` }}>
                      <span className="text-white text-[10px] font-semibold mb-1">{item.percentage}%</span>
                    </div>

                    {/* Date label */}
                    <span className="text-[11px] font-medium text-slate-500 mt-2">{item.shortDate}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 items-center justify-center text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></span> Porcentagem de Presenças</span>
                <span className="text-slate-300">|</span>
                <span>Passe o mouse (ou toque) na barra para detalhes adicionais</span>
              </div>
            </div>
          )}
        </div>

        {/* Birthdays Panel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4" id="birthdays_card">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
              <Gift size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Aniversariantes de {currentMonthName}</h3>
              <p className="text-xs text-slate-400">Fidelize e motive os seus membros!</p>
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-56 pr-1 custom-scrollbar">
            {monthlyBirthdays.length === 0 ? (
              <div className="py-8 text-center text-slate-400 flex flex-col items-center gap-1.5">
                <div className="p-3 bg-purple-50 text-purple-400 rounded-full">🎂</div>
                <p className="text-xs">Nenhum aniversariante neste mês.</p>
              </div>
            ) : (
              monthlyBirthdays.map((student) => {
                const day = student.birthDate.split("-")[2];
                const studentClass = classes.find((c) => c.id === student.classId);
                const currentYear = new Date().getFullYear();
                const birthYear = parseInt(student.birthDate.split("-")[0]);
                const age = currentYear - birthYear;

                return (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">{student.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Dia {day} • {studentClass?.name || "Sem Sala"} • {age} anos
                      </p>
                    </div>

                    {student.phone ? (
                      <button
                        onClick={() => onSendMessage(student.name, student.phone!, "birthday")}
                        className="p-2 text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-semibold"
                        title="Enviar parabéns pelo WhatsApp"
                      >
                        <MessageSquare size={13} />
                        Parabéns
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Sem celular registrado</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Class comparison table breakdown */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm" id="dashboard_classes_panel">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">Desempenho por Sala</h3>
          <p className="text-xs text-slate-400">Total de matriculados ativos e frequência acumulada</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" id="classes_performance_grid">
          {classStats.map((cs) => (
            <div key={cs.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50/70 transition-all flex flex-col justify-between">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">{cs.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {cs.studentCount} aluno{cs.studentCount !== 1 ? "s" : ""} ativo{cs.studentCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {cs.totalSessions} aula{cs.totalSessions !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Presença Acumulada</span>
                  <span className={cs.attendanceRate >= 70 ? "text-emerald-600" : cs.attendanceRate >= 50 ? "text-amber-600" : "text-rose-500"}>
                    {cs.attendanceRate}%
                  </span>
                </div>
                {/* Horizontal Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cs.attendanceRate >= 70 
                        ? "bg-emerald-500" 
                        : cs.attendanceRate >= 50 
                        ? "bg-amber-400" 
                        : "bg-rose-400"
                    }`}
                    style={{ width: `${cs.attendanceRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { initializeDatabase, db } from "./utils/localStorage";
import { EbdClass, Subject, Teacher, Student, Attendance, EbdSettings, Member } from "./types";

// Import individual tabs
import { DashboardTab } from "./components/DashboardTab";
import { AttendanceTab } from "./components/AttendanceTab";
import { StudentsTab } from "./components/StudentsTab";
import { TeachersTab } from "./components/TeachersTab";
import { ClassesTab } from "./components/ClassesTab";
import { SubjectsTab } from "./components/SubjectsTab";
import { ConfigTab } from "./components/ConfigTab";
import { MembersTab } from "./components/MembersTab";

// Import Lucide icons
import {
  LayoutDashboard,
  ClipboardPenLine,
  Users,
  Presentation,
  CheckSquare,
  BookOpen,
  Settings,
  Gift,
  Menu,
  X,
  Bell
} from "lucide-react";

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Sunday Bible School Data States
  const [classes, setClasses] = useState<EbdClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [settings, setSettings] = useState<EbdSettings | null>(null);

  // Mobile sidebar drawer
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Birthday notification popup on load
  const [showBirthdayAlert, setShowBirthdayAlert] = useState<boolean>(false);
  const [upcomingBirthdaysList, setUpcomingBirthdaysList] = useState<Student[]>([]);

  // Initialize DB and load into state on assembly
  useEffect(() => {
    initializeDatabase();
    
    // Fetch data
    const loadedClasses = db.getClasses();
    const loadedSubjects = db.getSubjects();
    const loadedTeachers = db.getTeachers();
    const loadedStudents = db.getStudents();
    const loadedAttendance = db.getAttendance();
    const loadedSettings = db.getSettings();
    const loadedMembers = db.getMembers();

    setClasses(loadedClasses);
    setSubjects(loadedSubjects);
    setTeachers(loadedTeachers);
    setStudents(loadedStudents);
    setAttendance(loadedAttendance);
    setSettings(loadedSettings);
    setMembers(loadedMembers);

    // Filter students with birthdays in June (simulated current month)
    const birthdaysInJune = loadedStudents.filter((st) => {
      if (!st.birthDate || !st.active) return false;
      const parts = st.birthDate.split("-");
      return parts.length >= 2 && parts[1] === "06";
    });

    if (birthdaysInJune.length > 0) {
      setUpcomingBirthdaysList(birthdaysInJune.slice(0, 5));
      // Show automated alert on load to greet teachers
      setShowBirthdayAlert(true);
    }
  }, []);

  // Sync methods that update both reacts state and localStorage
  const handleSaveSettings = (newSettings: EbdSettings) => {
    db.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleAddClass = (newClassData: Omit<EbdClass, "id">) => {
    const newClass: EbdClass = {
      ...newClassData,
      id: `class_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`
    };
    const updated = [...classes, newClass];
    db.saveClasses(updated);
    setClasses(updated);
  };

  const handleUpdateClass = (id: string, updatedFields: Partial<EbdClass>) => {
    const updated = classes.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
    db.saveClasses(updated);
    setClasses(updated);
  };

  const handleDeleteClass = (id: string) => {
    const updated = classes.filter((c) => c.id !== id);
    db.saveClasses(updated);
    setClasses(updated);
  };

  const handleAddSubject = (newSubjectData: Omit<Subject, "id">) => {
    const newSubject: Subject = {
      ...newSubjectData,
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`
    };
    const updated = [...subjects, newSubject];
    db.saveSubjects(updated);
    setSubjects(updated);
  };

  const handleUpdateSubject = (id: string, updatedFields: Partial<Subject>) => {
    const updated = subjects.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
    db.saveSubjects(updated);
    setSubjects(updated);
  };

  const handleDeleteSubject = (id: string) => {
    const updated = subjects.filter((s) => s.id !== id);
    db.saveSubjects(updated);
    setSubjects(updated);
  };

  const handleAddTeacher = (newTeacherData: Omit<Teacher, "id">) => {
    const newTeacher: Teacher = {
      ...newTeacherData,
      id: `t_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`
    };
    const updated = [...teachers, newTeacher];
    db.saveTeachers(updated);
    setTeachers(updated);
  };

  const handleUpdateTeacher = (id: string, updatedFields: Partial<Teacher>) => {
    const updated = teachers.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
    db.saveTeachers(updated);
    setTeachers(updated);
  };

  const handleDeleteTeacher = (id: string) => {
    const updated = teachers.filter((t) => t.id !== id);
    db.saveTeachers(updated);
    setTeachers(updated);
  };

  const handleAddStudent = (newStudentData: Omit<Student, "id">) => {
    const newStudent: Student = {
      ...newStudentData,
      id: `s_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`
    };
    const updated = [...students, newStudent];
    db.saveStudents(updated);
    setStudents(updated);
  };

  const handleUpdateStudent = (id: string, updatedFields: Partial<Student>) => {
    const updated = students.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
    db.saveStudents(updated);
    setStudents(updated);
  };

  const handleDeleteStudent = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    db.saveStudents(updated);
    setStudents(updated);
  };

  const handleAddMember = (mNew: Member) => {
    const newMember: Member = {
      ...mNew,
      id: mNew.id ? mNew.id.trim() : `M_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`
    };
    const updated = [...members, newMember];
    db.saveMembers(updated);
    setMembers(updated);
  };

  const handleUpdateMember = (id: string, updatedFields: Partial<Member>) => {
    const updated = members.map((m) => (m.id === id ? { ...m, ...updatedFields } : m));
    db.saveMembers(updated);
    setMembers(updated);
  };

  const handleDeleteMember = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    db.saveMembers(updated);
    setMembers(updated);
  };

  const handleImportMembers = (importedMembers: any[]): boolean => {
    try {
      const sanitizedMembers: Member[] = importedMembers.map((m, index) => ({
        id: m.id ? String(m.id).trim() : `M_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 5)}`,
        name: String(m.name || "Sem Nome").trim(),
        birthDate: String(m.birthDate || "2000-01-01").trim(),
        cpf: m.cpf ? String(m.cpf).trim() : undefined,
        rg: m.rg ? String(m.rg).trim() : undefined,
        gender: String(m.gender || "M").trim(),
        photo: m.photo ? String(m.photo).trim() : undefined,
      }));

      const mergedMembers = [...members];
      sanitizedMembers.forEach(newM => {
        const idx = mergedMembers.findIndex(m => m.id === newM.id || (m.name.toLowerCase() === newM.name.toLowerCase() && m.birthDate === newM.birthDate));
        if (idx !== -1) {
          mergedMembers[idx] = newM;
        } else {
          mergedMembers.push(newM);
        }
      });

      db.saveMembers(mergedMembers);
      setMembers(mergedMembers);
      return true;
    } catch (e) {
      console.error("Erro ao importar catálogo de membros", e);
      return false;
    }
  };

  const handleSaveAttendance = (record: Attendance) => {
    // Check if we replace or append
    const index = attendance.findIndex((a) => a.id === record.id || (a.classId === record.classId && a.date === record.date));
    let updated: Attendance[] = [];
    if (index !== -1) {
      updated = [...attendance];
      updated[index] = record;
    } else {
      updated = [...attendance, record];
    }
    db.saveAttendance(updated);
    setAttendance(updated);
  };

  // WhatsApp sender utility with template filling
  const handleSendMessage = (studentName: string, phone: string, type: "absence" | "birthday") => {
    if (!phone) return;

    // Filter out spaces, dashes and non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");

    let rawMessage = "";

    if (type === "birthday") {
      rawMessage = `Parabéns, [ALUNO]! Celebramos o seu aniversário neste mês! Desejamos ricas bênçãos de Deus sobre sua vida e presença contínua conosco na EBD.`;
    } else {
      rawMessage = settings ? settings.whatsappTemplate : "Olá, sentimos sua falta na Escola Dominical hoje!";
    }

    const filledMessage = rawMessage.replace(/\[ALUNO\]/g, studentName);
    
    // Generate URL
    let waUrl = `https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encodeURIComponent(filledMessage)}`;
    
    // For foreign numbers or already configured with DDI
    if (cleanPhone.startsWith("55") || cleanPhone.length > 11) {
      waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(filledMessage)}`;
    }

    window.open(waUrl, "_blank");
  };

  // Backup and Import
  const handleExportBackup = () => {
    const fullState = {
      classes,
      subjects,
      teachers,
      students,
      attendance,
      settings,
      version: "1.0",
      timestamp: new Date().toISOString(),
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullState, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ebd-gestao-backup-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (parsed: any): boolean => {
    // Validate schema loosely
    if (parsed && parsed.students && parsed.classes && parsed.attendance) {
      db.saveClasses(parsed.classes);
      db.saveStudents(parsed.students);
      db.saveAttendance(parsed.attendance);
      if (parsed.subjects) db.saveSubjects(parsed.subjects);
      if (parsed.teachers) db.saveTeachers(parsed.teachers);
      if (parsed.settings) db.saveSettings(parsed.settings);
      return true;
    }
    return false;
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Inicializando o banco EBD...</p>
      </div>
    );
  }

  // Define Nav items to keep repetitive blocks optimized
  const navItems = [
    { id: "dashboard", label: "Painel de Resumos", icon: LayoutDashboard },
    { id: "attendance", label: "Fazer Chamada", icon: ClipboardPenLine },
    { id: "members", label: "Base de Membros", icon: Users },
    { id: "students", label: "Alunos EBD", icon: CheckSquare },
    { id: "teachers", label: "Professores EBD", icon: Presentation },
    { id: "classes", label: "Salas / Classes", icon: CheckSquare },
    { id: "subjects", label: "Matérias / Temas", icon: BookOpen },
    { id: "config", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative pb-20 lg:pb-0" id="ebd_app_root">
      
      {/* Dynamic top bar panel */}
      <header className="sticky top-0 bg-indigo-900 text-white z-40 px-4 md:px-6 py-3.5 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          {/* Mobile Menu indicator */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-1.5 hover:bg-indigo-800 rounded-lg transition-colors cursor-pointer"
            id="mobile_menu_trigger"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>

          <div className="space-y-0.5">
            <h1 className="text-[17px] font-black tracking-tight flex items-center gap-2">
              <span className="bg-white text-indigo-900 px-1.5 py-0.5 rounded text-xs font-extrabold antialiased">EBD</span>
              {settings.churchName}
            </h1>
            <p className="text-[10px] text-indigo-200/80 uppercase font-semibold tracking-wider">Gestão Dominical de Relatórios</p>
          </div>
        </div>

        {/* Global info indicators */}
        <div className="flex items-center gap-3">
          {upcomingBirthdaysList.length > 0 && (
            <button
              onClick={() => setShowBirthdayAlert(true)}
              className="p-2 relative bg-indigo-800/80 hover:bg-indigo-800 text-purple-200 hover:text-purple-100 rounded-xl transition-colors cursor-pointer"
              title="Aniversariantes ativos este mês"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-400 rounded-full animate-ping"></span>
            </button>
          )}

          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-indigo-100">Ano Letivo 2026</p>
            <p className="text-[10px] text-indigo-300">Banco de Dados Offline (Ativo)</p>
          </div>
        </div>
      </header>

      {/* Main layout containing Desktop Sidebar & Content View */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full" id="ebd_app_body">
        
        {/* Left Desktop Sidebar Nav Panel */}
        <aside className="w-64 bg-white border-r border-slate-100 p-5 hidden lg:flex flex-col justify-between" id="desktop_sidebar">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3">Navegação Geral</span>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all justify-start border cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                        : "bg-white border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50/50"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-slate-600">Base de Membros Geral</h4>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-extrabold text-indigo-950">{members.length}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {students.filter(s => s.active).length} alunos ativos
              </span>
            </div>
          </div>
        </aside>

        {/* Dynamic Mobile Modal Sidebar Menu (Drawer overlay) */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden" id="mobile_drawer_overlay">
            <div className="bg-white w-64 h-full p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase">Menu EBD</h3>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all justify-start border cursor-pointer ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-100 text-indigo-700"
                            : "bg-white border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50/50"
                        }`}
                      >
                        <Icon size={16} />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Status footer for Drawer */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <p className="text-[10px] font-semibold text-slate-500">Igreja: {settings.churchName}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Versão App: 1.0 (Mobile Ready)</p>
              </div>
            </div>
          </div>
        )}

        {/* Core Content Area with tab panel loading */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto" id="ebd_main_content">
          {activeTab === "dashboard" && (
            <DashboardTab
              classes={classes}
              students={students}
              attendance={attendance}
              teachers={teachers}
              settings={settings}
              onSendMessage={handleSendMessage}
            />
          )}

          {activeTab === "attendance" && (
            <AttendanceTab
              classes={classes}
              subjects={subjects}
              students={students}
              attendance={attendance}
              onSaveAttendance={handleSaveAttendance}
            />
          )}

          {activeTab === "members" && (
            <MembersTab
              members={members}
              onAddMember={handleAddMember}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
            />
          )}

          {activeTab === "students" && (
            <StudentsTab
              students={students}
              classes={classes}
              settings={settings}
              members={members}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onSendMessage={handleSendMessage}
            />
          )}

          {activeTab === "teachers" && (
            <TeachersTab
              teachers={teachers}
              classes={classes}
              subjects={subjects}
              members={members}
              onAddTeacher={handleAddTeacher}
              onUpdateTeacher={handleUpdateTeacher}
              onDeleteTeacher={handleDeleteTeacher}
            />
          )}

          {activeTab === "classes" && (
            <ClassesTab
              classes={classes}
              onAddClass={handleAddClass}
              onUpdateClass={handleUpdateClass}
              onDeleteClass={handleDeleteClass}
            />
          )}

          {activeTab === "subjects" && (
            <SubjectsTab
              subjects={subjects}
              onAddSubject={handleAddSubject}
              onUpdateSubject={handleUpdateSubject}
              onDeleteSubject={handleDeleteSubject}
            />
          )}

          {activeTab === "config" && (
            <ConfigTab
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onFactoryReset={db.factoryReset}
              onImportBackup={handleImportBackup}
              onExportBackup={handleExportBackup}
              onImportMembers={handleImportMembers}
            />
          )}
        </main>
      </div>

      {/* Persistent Bottom Mobile Navigation Bar for perfect Android Touch usability (hidden on desktop) */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around xl:hidden lg:hidden z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]" id="mobile_bottom_bar">
        {navItems.slice(0, 5).map((item) => { // High priority tabs for mobile
          const Icon = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
                isSelected ? "text-indigo-600 scale-105" : "text-slate-400"
              }`}
              style={{ minWidth: "44px", minHeight: "44px" }} // Best user interface height target
            >
              <Icon size={18} />
              <span className="text-[9px] font-bold tracking-tight whitespace-nowrap">{item.label.split(" ")[0]}</span>
            </button>
          );
        })}
        {/* Toggle Settings quickly */}
        <button
          onClick={() => setActiveTab("config")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
            activeTab === "config" ? "text-indigo-600 scale-105" : "text-slate-400"
          }`}
          style={{ minWidth: "44px", minHeight: "44px" }}
        >
          <Settings size={18} />
          <span className="text-[9px] font-bold tracking-tight">Ajustes</span>
        </button>
      </nav>

      {/* Automated June Birthday Dialog Alert */}
      {showBirthdayAlert && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="birthday_popup_alert">
          <div className="bg-white text-slate-800 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-6 relative text-center space-y-4 animate-in fade-in zoom-in duration-200 border border-slate-100">
            {/* Balloon or Cake illustration wrapper */}
            <div className="mx-auto w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-3xl animate-bounce">
              🎂
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Aniversariantes Ativos!</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Temos alunos completando mais um ciclo neste mês de Junho. Fortaleça os vínculos!
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-left space-y-2 max-h-36 overflow-y-auto">
              {upcomingBirthdaysList.map((bg) => (
                <div key={bg.id} className="flex justify-between items-center text-xs border-b border-white pb-1.5 last:border-0 last:pb-0">
                  <span className="font-bold text-slate-700">{bg.name}</span>
                  <span className="text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-md">Dia {bg.birthDate.split("-")[2]}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 w-full pt-2">
              <button
                onClick={() => {
                  setShowBirthdayAlert(false);
                  setActiveTab("dashboard");
                }}
                className="flex-1 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Ver Detalhes
              </button>
              <button
                onClick={() => setShowBirthdayAlert(false)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

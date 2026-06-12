import { useState, useMemo, useEffect } from "react";
import { EbdClass, Subject, Student, Attendance, AttendanceRecord } from "../types";
import { Check, CalendarDays, Coins, BookOpen, AlertCircle, FileText, UserPlus, Info, Users } from "lucide-react";

interface AttendanceTabProps {
  classes: EbdClass[];
  subjects: Subject[];
  students: Student[];
  attendance: Attendance[];
  onSaveAttendance: (record: Attendance) => void;
}

export function AttendanceTab({
  classes,
  subjects,
  students,
  attendance,
  onSaveAttendance,
}: AttendanceTabProps) {
  // Today's date in YYYY-MM-DD
  const todayString = useMemo(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - offset * 60 * 1000);
    return localToday.toISOString().split("T")[0];
  }, []);

  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(todayString);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  // Additional numbers
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [biblesCount, setBiblesCount] = useState<number>(0);
  const [magazinesCount, setMagazinesCount] = useState<number>(0);
  const [offeringValue, setOfferingValue] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  // List of local checkbox status
  // Key: studentId, Value: boolean (present)
  const [presenceStates, setPresenceStates] = useState<{ [studentId: string]: boolean }>({});
  const [lateStates, setLateStates] = useState<{ [studentId: string]: boolean }>({});

  const [statusMessage, setStatusMessage] = useState<{ text: string; error: boolean } | null>(null);

  // Default to first class if available
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  // Active students in selected class
  const classStudents = useMemo(() => {
    if (!selectedClassId) return [];
    return students.filter((s) => s.classId === selectedClassId && s.active);
  }, [selectedClassId, students]);

  // Load existing records if any
  useEffect(() => {
    if (!selectedClassId || !selectedDate) return;

    // Search for a saved record on this exact date and class
    const existing = attendance.find(
      (a) => a.classId === selectedClassId && a.date === selectedDate
    );

    if (existing) {
      // Build presence map from saved records
      const presenceMap: { [id: string]: boolean } = {};
      const lateMap: { [id: string]: boolean } = {};
      
      existing.records.forEach((rec) => {
        presenceMap[rec.studentId] = rec.present;
        lateMap[rec.studentId] = !!rec.late;
      });

      // Fill absent fields for any class students not present in the record yet
      classStudents.forEach((student) => {
        if (presenceMap[student.id] === undefined) {
          presenceMap[student.id] = false;
        }
      });

      setPresenceStates(presenceMap);
      setLateStates(lateMap);
      setSelectedSubjectId(existing.subjectId || "");
      setVisitorCount(existing.visitorCount || 0);
      setBiblesCount(existing.biblesCount || 0);
      setMagazinesCount(existing.magazinesCount || 0);
      setOfferingValue(existing.offeringValue || 0);
      setNotes(existing.notes || "");
      
      setStatusMessage({ text: "Registro existente carregado. Modificações serão salvas como alteração.", error: false });
    } else {
      // Setup initial map: everyone is marked present by default (or customizable!)
      const initialPresenceMap: { [id: string]: boolean } = {};
      const initialLateMap: { [id: string]: boolean } = {};
      classStudents.forEach((student) => {
        initialPresenceMap[student.id] = true; // High spirits default
        initialLateMap[student.id] = false;
      });

      setPresenceStates(initialPresenceMap);
      setLateStates(initialLateMap);
      setSelectedSubjectId("");
      setVisitorCount(0);
      setBiblesCount(classStudents.length); // Assuming students brought books
      setMagazinesCount(classStudents.length);
      setOfferingValue(0);
      setNotes("");
      setStatusMessage(null);
    }
  }, [selectedClassId, selectedDate, attendance, classStudents]);

  // Handle saving
  const handleSave = () => {
    if (!selectedClassId) {
      setStatusMessage({ text: "Por favor, selecione uma turma.", error: true });
      return;
    }

    if (!selectedDate) {
      setStatusMessage({ text: "Por favor, defina uma data para a lição.", error: true });
      return;
    }

    // Build standard AttendanceRecord array
    const records: AttendanceRecord[] = classStudents.map((student) => ({
      studentId: student.id,
      present: !!presenceStates[student.id],
      late: !!lateStates[student.id],
    }));

    // Find any existing record ID to replace
    const existing = attendance.find(
      (a) => a.classId === selectedClassId && a.date === selectedDate
    );

    const updatedRecord: Attendance = {
      id: existing ? existing.id : `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      classId: selectedClassId,
      date: selectedDate,
      subjectId: selectedSubjectId || undefined,
      records,
      visitorCount: Number(visitorCount),
      biblesCount: Number(biblesCount),
      magazinesCount: Number(magazinesCount),
      offeringValue: Number(offeringValue),
      notes,
    };

    onSaveAttendance(updatedRecord);
    setStatusMessage({ text: "Presença e relatórios de classe salvos com sucesso!", error: false });

    // Clear alert after some seconds
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const toggleStudentPresence = (studentId: string) => {
    setPresenceStates((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const toggleStudentLate = (studentId: string) => {
    setLateStates((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const markAllStatus = (present: boolean) => {
    const updatedMap: { [id: string]: boolean } = {};
    classStudents.forEach((student) => {
      updatedMap[student.id] = present;
    });
    setPresenceStates(updatedMap);
  };

  return (
    <div className="space-y-6" id="attendance_panel">
      {/* Selector Area */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm" id="attendance_setup_selectors">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight mb-4">Fazer Chamada da EBD</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label htmlFor="attendance-class-select" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Escolher Turma/Sala</label>
            <select
              id="attendance-class-select"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
            >
              {classes.length === 0 ? (
                <option value="">Sem Turmas Cadastradas</option>
              ) : (
                classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label htmlFor="attendance-date" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Data da Chamada (Domingo)</label>
            <input
              id="attendance-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
            />
          </div>

          <div>
            <label htmlFor="attendance-subject" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lição Lecionada (Matéria)</label>
            <select
              id="attendance-subject"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
            >
              <option value="">-- Sem Matéria Fixada --</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${statusMessage.error ? 'bg-rose-50 text-rose-800' : 'bg-indigo-50 text-indigo-800'}`}>
          {statusMessage.error ? <AlertCircle size={18} /> : <Info size={18} />}
          <p className="font-semibold">{statusMessage.text}</p>
        </div>
      )}

      {selectedClassId ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Status Attendance selection list */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-50 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Alunos Matriculados</h3>
                <p className="text-xs text-slate-400">Marque a presença de cada um na sala de aula</p>
              </div>

              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => markAllStatus(true)}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-semibold"
                >
                  Confirmar Todos Presentes
                </button>
                <button
                  type="button"
                  onClick={() => markAllStatus(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-semibold"
                >
                  Limpar Todos
                </button>
              </div>
            </div>

            {classStudents.length === 0 ? (
              <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2 border border-dashed border-slate-100 rounded-2xl">
                <Users size={32} className="opacity-35 text-indigo-400 animate-pulse" />
                <p className="text-sm font-semibold">Nenhum aluno ativo matriculado nesta sala.</p>
                <p className="text-xs">Vá para a seção "Alunos" e cadastre novos membros associados a esta sala!</p>
              </div>
            ) : (
              <div className="space-y-2 mt-2">
                {classStudents.map((st) => {
                  const isPresent = !!presenceStates[st.id];
                  const isLate = !!lateStates[st.id];

                  return (
                    <div
                      key={st.id}
                      onClick={() => toggleStudentPresence(st.id)}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none gap-2 ${
                        isPresent
                          ? "border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/40"
                          : "border-slate-100 hover:bg-slate-50/75"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isPresent
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isPresent && <Check size={14} strokeWidth={3} />}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${isPresent ? "text-slate-800" : "text-slate-500"}`}>
                            {st.name}
                          </p>
                          {st.phone && (
                            <p className="text-[10px] text-slate-400 mt-0.5">Celular: {st.phone}</p>
                          )}
                        </div>
                      </div>

                      {/* Controls like Late and manual actions */}
                      <div className="flex items-center gap-3 sm:self-center self-end" onClick={(e) => e.stopPropagation()}>
                        {isPresent ? (
                          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                            <input
                              type="checkbox"
                              checked={isLate}
                              onChange={() => toggleStudentLate(st.id)}
                              className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 accent-amber-500"
                            />
                            Atrasado
                          </label>
                        ) : (
                          <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">Faltou</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Side stats: Offering, Visitors, bibles, etc. */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-5" id="attendance_aside_report">
            <h3 className="font-bold text-slate-800 text-base pb-2 border-b border-slate-50 flex items-center gap-2">
              <FileText size={16} className="text-indigo-500" />
              Relatório da Aula
            </h3>

            {/* Visitors field */}
            <div className="space-y-1.5">
              <label htmlFor="attendance-visitors" className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <UserPlus size={14} className="text-purple-500" />
                Visitantes de Fora
              </label>
              <input
                id="attendance-visitors"
                type="number"
                min="0"
                value={visitorCount}
                onChange={(e) => setVisitorCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              />
            </div>

            {/* Offerings Fields */}
            <div className="space-y-1.5">
              <label htmlFor="attendance-offering" className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Coins size={14} className="text-amber-500" />
                Oferta da Classe (R$)
              </label>
              <input
                id="attendance-offering"
                type="number"
                min="0"
                step="0.01"
                value={offeringValue}
                onChange={(e) => setOfferingValue(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              />
            </div>

            {/* Bibles Counter */}
            <div className="space-y-1.5">
              <label htmlFor="attendance-bibles" className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <BookOpen size={14} className="text-sky-500" />
                Bíblias Trazidas
              </label>
              <input
                id="attendance-bibles"
                type="number"
                min="0"
                value={biblesCount}
                onChange={(e) => setBiblesCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              />
            </div>

            {/* Magazines count */}
            <div className="space-y-1.5">
              <label htmlFor="attendance-magazines" className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <CalendarDays size={14} className="text-rose-500" />
                Revistas Utilizadas
              </label>
              <input
                id="attendance-magazines"
                type="number"
                min="0"
                value={magazinesCount}
                onChange={(e) => setMagazinesCount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              />
            </div>

            {/* Relatório notes */}
            <div className="space-y-1.5">
              <label htmlFor="attendance-notes" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Anotações e Ocorrências</label>
              <textarea
                id="attendance-notes"
                rows={3}
                placeholder="Pedidos de oração, decisões de fé, avisos relevantes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 resize-none"
              ></textarea>
            </div>

            {/* Grand Action Touchpoint (44px target) */}
            <button
              onClick={handleSave}
              disabled={classStudents.length === 0}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer text-sm tracking-wide disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              Salvar Registro da Chamada
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-100 p-12 text-center rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2">
          <CalendarDays size={48} className="text-slate-300 animate-bounce" />
          <p className="font-semibold text-slate-600">Por favor, crie uma sala/turma primeiro para efetuar a chamada.</p>
        </div>
      )}
    </div>
  );
}

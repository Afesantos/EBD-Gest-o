import { useState, useMemo, FormEvent } from "react";
import { Student, EbdClass, EbdSettings, Member } from "../types";
import { Plus, Search, Filter, Edit, Trash2, CheckCircle2, XCircle, PhoneCall, Mail, MessageSquare, Sparkles, X, Gift } from "lucide-react";

interface StudentsTabProps {
  students: Student[];
  classes: EbdClass[];
  settings: EbdSettings;
  members: Member[];
  onAddStudent: (student: Omit<Student, "id">) => void;
  onUpdateStudent: (id: string, student: Partial<Student>) => void;
  onDeleteStudent: (id: string) => void;
  onSendMessage: (studentName: string, phone: string, type: "absence" | "birthday") => void;
}

export function StudentsTab({
  students,
  classes,
  settings,
  members = [],
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onSendMessage,
}: StudentsTabProps) {
  // Filters state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // 'all' | 'active' | 'inactive'

  // Form State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Individual fields state
  const [name, setName] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [classId, setClassId] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);

  // Filter students based on state
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchName = s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = classFilter === "all" || s.classId === classFilter;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && s.active) ||
        (statusFilter === "inactive" && !s.active);

      return matchName && matchClass && matchStatus;
    });
  }, [students, searchTerm, classFilter, statusFilter]);

  // Open form for a new student
  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setBirthDate("1998-01-01");
    setPhone("");
    setEmail("");
    setClassId(classes[0]?.id || "");
    setActive(true);
    setIsFormOpen(true);
  };

  // Open form to edit student
  const handleOpenEdit = (student: Student) => {
    setEditingId(student.id);
    setName(student.name);
    setBirthDate(student.birthDate);
    setPhone(student.phone || "");
    setEmail(student.email || "");
    setClassId(student.classId);
    setActive(student.active);
    setIsFormOpen(true);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;
    if (!classId) return;

    if (editingId) {
      onUpdateStudent(editingId, {
        name,
        birthDate,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        classId,
        active,
      });
    } else {
      onAddStudent({
        name,
        birthDate,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        classId,
        active,
      });
    }

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6" id="students_panel">
      {/* Controls & Filter Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="students_controls_banner">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Cadastro de Alunos</h2>
          <p className="text-sm text-slate-400">Total de {students.length} aluno{students.length !== 1 ? 's' : ''} cadastrado{students.length !== 1 ? 's' : ''}</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full md:w-auto px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98] cursor-pointer"
        >
          <Plus size={18} />
          Cadastrar Novo Aluno
        </button>
      </div>

      {/* Advanced Filter Pane */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4" id="students_filters_pane">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Text search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Buscar aluno por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            />
          </div>

          {/* Class selector */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Filter size={18} />
            </span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            >
              <option value="all">Todas as Salas/Turmas</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Sparkles size={18} />
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            >
              <option value="all">Filtro de Status: Todos</option>
              <option value="active">Alunos Ativos</option>
              <option value="inactive">Alunos Inativos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Grid/Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="students_data_table">
        {filteredStudents.length === 0 ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Search size={44} className="opacity-30" />
            <p className="font-semibold text-slate-600">Nenhum aluno atende aos critérios de busca.</p>
            <p className="text-xs">Tente redefinir seus filtros ou cadastrar um novo aluno!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-5">Nome do Aluno</th>
                  <th className="py-4 px-5">Sala / Classe</th>
                  <th className="py-4 px-5">Aniversário</th>
                  <th className="py-4 px-5">Contato</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredStudents.map((st) => {
                  const studentClass = classes.find((c) => c.id === st.classId);
                  
                  // Convert birthdate format to PT-BR like 10/12/1990
                  const localizedDate = st.birthDate
                    ? st.birthDate.split("-").reverse().join("/")
                    : "-";

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-800">{st.name}</div>
                        {st.email && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail size={12} />
                            {st.email}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-block py-1 px-2.5 bg-indigo-50/50 border border-indigo-100/50 text-indigo-700 rounded-lg text-xs font-semibold">
                          {studentClass?.name || "Sem Sala Atribuída"}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Gift size={13} className="text-purple-400" />
                          {localizedDate}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        {st.phone ? (
                          <div className="space-y-1">
                            <div className="text-slate-600 font-semibold">{st.phone}</div>
                            {/* Fast message buttons */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => onSendMessage(st.name, st.phone!, "absence")}
                                className="text-[10px] text-indigo-700 hover:text-white bg-indigo-50 hover:bg-indigo-600 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold transition-colors"
                                title="Enviar mensagem de ausência"
                              >
                                <MessageSquare size={10} />
                                Chamar Falta
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Nenhum</span>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        {st.active ? (
                          <span className="inline-flex items-center gap-1 py-1 px-2.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                            <CheckCircle2 size={13} /> Altas / Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 py-1 px-2.5 bg-rose-50 text-rose-700 rounded-full text-xs font-bold">
                            <XCircle size={13} /> Inativo
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(st)}
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Editar Dados"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Deseja realmente remover o aluno ${st.name}?`)) {
                                onDeleteStudent(st.id);
                              }
                            }}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remover Aluno"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Floating dialog/modal for Add or Edit */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4" id="student_input_modal">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center bg-indigo-600 text-white px-6 py-4">
              <h3 className="font-bold text-lg tracking-wide">
                {editingId ? "Editar Aluno" : "Cadastrar Novo Aluno"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-indigo-100 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Lookup from Members */}
              {!editingId && members && members.length > 0 && (
                <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100 flex flex-col gap-1.5 shadow-inner">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-900">
                    <Sparkles size={14} className="text-indigo-600 animate-pulse" />
                    <span>Auto-Preencher com dados de Membro</span>
                  </div>
                  <p className="text-[10px] text-indigo-500/90 leading-normal">
                    Selecione um membro para carregar Nome, Nascimento e dados pré-existentes na base:
                  </p>
                  <select
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (!selectedId) return;
                      const matched = members.find(m => m.id === selectedId);
                      if (matched) {
                        setName(matched.name);
                        if (matched.birthDate) setBirthDate(matched.birthDate);
                      }
                    }}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-indigo-200 rounded-xl focus:border-indigo-400 focus:outline-none text-slate-700 font-semibold cursor-pointer"
                    defaultValue=""
                  >
                    <option value="">-- Selecione o membro (Preenchimento Rápido) --</option>
                    {members.map((m) => {
                      const age = m.birthDate ? `${new Date().getFullYear() - parseInt(m.birthDate.split("-")[0])} anos` : '';
                      return (
                        <option key={m.id || m.name} value={m.id}>
                          {m.name} {m.id ? `(${m.id})` : ''} {age ? `- ${age}` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {/* Full name input */}
              <div className="space-y-1.5">
                <label htmlFor="student-name-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nome do Aluno *</label>
                <input
                  id="student-name-input"
                  type="text"
                  required
                  placeholder="Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                />
              </div>

              {/* Class & Active State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="student-class-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Classe/Turma *</label>
                  <select
                    id="student-class-input"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="student-birth-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Data de Nascimento *</label>
                  <input
                    id="student-birth-input"
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              {/* Email & Contact Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="student-phone-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Telefone WhatsApp</label>
                  <input
                    id="student-phone-input"
                    type="text"
                    placeholder="Ex: 11988887777"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="student-email-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Endereço de E-mail</label>
                  <input
                    id="student-email-input"
                    type="email"
                    placeholder="aluno@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              {/* Toggle active state */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  Aluno Ativo nas Atividades da Escola Dominical
                </label>
              </div>

              {/* Footer buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer shadow-md"
                >
                  {editingId ? "Salvar Alterações" : "Cadastrar Aluno"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

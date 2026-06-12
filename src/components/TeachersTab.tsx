import { useState, useMemo, FormEvent } from "react";
import { Teacher, EbdClass, Subject, Member } from "../types";
import { Plus, Search, Edit, Trash2, Mail, Phone, BookOpen, Presentation, X, Sparkles } from "lucide-react";

interface TeachersTabProps {
  teachers: Teacher[];
  classes: EbdClass[];
  subjects: Subject[];
  members: Member[];
  onAddTeacher: (teacher: Omit<Teacher, "id">) => void;
  onUpdateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  onDeleteTeacher: (id: string) => void;
}

export function TeachersTab({
  teachers,
  classes,
  subjects,
  members = [],
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
}: TeachersTabProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [classId, setClassId] = useState<string>("");
  const [subjectId, setSubjectId] = useState<string>("");

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teachers, searchTerm]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPhone("");
    setClassId(classes[0]?.id || "");
    setSubjectId(subjects[0]?.id || "");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setEditingId(teacher.id);
    setName(teacher.name);
    setEmail(teacher.email || "");
    setPhone(teacher.phone || "");
    setClassId(teacher.classId || "");
    setSubjectId(teacher.subjectId || "");
    setIsFormOpen(true);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = {
      name,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      classId: classId || undefined,
      subjectId: subjectId || undefined,
    };

    if (editingId) {
      onUpdateTeacher(editingId, data);
    } else {
      onAddTeacher(data);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6" id="teachers_panel">
      {/* Overview Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="teachers_top">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Cadastro de Professores / Líderes</h2>
          <p className="text-sm text-slate-400">Gerencie o corpo docente da sua Escola Dominical</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full md:w-auto px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98] cursor-pointer"
        >
          <Plus size={18} />
          Cadastrar Novo Professor
        </button>
      </div>

      {/* Searchbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm" id="teachers_search_bar">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Buscar professores por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Data card grid */}
      {filteredTeachers.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm text-slate-400 flex flex-col items-center justify-center gap-1.5">
          <Presentation size={38} className="opacity-30 text-indigo-500" />
          <p className="font-semibold text-slate-600">Nenhum professor encontrado nas pesquisas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="teachers_grid">
          {filteredTeachers.map((t) => {
            const linkedClass = classes.find((c) => c.id === t.classId);
            const linkedSubject = subjects.find((s) => s.id === t.subjectId);

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Upper teacher card header */}
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-slate-800 text-base">{t.name}</h3>
                      <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block mt-1">
                        Professor EBD
                      </p>
                    </div>
                    {/* Floating mini actions */}
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1 px-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                        title="Editar Professor"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Deseja mesmo remover o professor ${t.name}?`)) {
                            onDeleteTeacher(t.id);
                          }
                        }}
                        className="p-1 px-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Remover Professor"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Class links and Subject links */}
                  <div className="grid grid-cols-1 gap-2 pt-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <Presentation size={14} className="text-indigo-500" />
                      <span>
                        <strong className="text-slate-500 font-bold">Turma:</strong> {linkedClass?.name || "Não definida"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <BookOpen size={14} className="text-sky-500" />
                      <span>
                        <strong className="text-slate-500 font-bold">Leciona:</strong> {linkedSubject?.name || "Livre"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lower teacher card footer with contact targets */}
                <div className="bg-slate-50 border-t border-slate-100 p-4 grid grid-cols-2 text-xs font-semibold text-slate-600 divide-x divide-slate-200">
                  <div className="flex items-center justify-center gap-1.5 focus:outline-none">
                    <Mail size={13} className="text-slate-400" />
                    <span className="truncate max-w-[120px] text-[11px]" title={t.email}>
                      {t.email || "Sem E-mail"}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-center">
                    <Phone size={13} className="text-slate-400" />
                    <span className="text-[11px]">{t.phone || "Sem Celular"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Teacher Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4" id="teacher_input_modal">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center bg-indigo-600 text-white px-6 py-4">
              <h3 className="font-bold text-lg tracking-wide">
                {editingId ? "Editar Professor" : "Cadastrar Professor"}
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
                    Selecione um membro para carregar as informações cadastrais:
                  </p>
                  <select
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (!selectedId) return;
                      const matched = members.find(m => m.id === selectedId);
                      if (matched) {
                        setName(matched.name);
                        // Can also autofill some other suggested parts if needed
                      }
                    }}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-indigo-200 rounded-xl focus:border-indigo-400 focus:outline-none text-slate-700 font-semibold cursor-pointer"
                    defaultValue=""
                  >
                    <option value="">-- Selecione o membro (Preenchimento Rápido) --</option>
                    {members.map((m) => (
                      <option key={m.id || m.name} value={m.id}>
                        {m.name} {m.id ? `(${m.id})` : ''} - {m.gender}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="teacher-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nome Completo *</label>
                <input
                  id="teacher-name"
                  type="text"
                  required
                  placeholder="Nome do Professor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="teacher-phone" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Celular / Whats</label>
                  <input
                    id="teacher-phone"
                    type="text"
                    placeholder="Ex: 11988887777"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="teacher-email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail</label>
                  <input
                    id="teacher-email"
                    type="email"
                    placeholder="professor@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="teacher-class" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Classe Primária</label>
                  <select
                    id="teacher-class"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                  >
                    <option value="">-- Nenhuma --</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="teacher-subject" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Matéria Principal</label>
                  <select
                    id="teacher-subject"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                  >
                    <option value="">-- Nenhuma --</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
                  {editingId ? "Salvar Alterações" : "Cadastrar Professor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

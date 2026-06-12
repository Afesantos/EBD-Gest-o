import { useState, FormEvent } from "react";
import { Subject } from "../types";
import { Plus, Edit, Trash2, BookOpen, Clock, X } from "lucide-react";

interface SubjectsTabProps {
  subjects: Subject[];
  onAddSubject: (subject: Omit<Subject, "id">) => void;
  onUpdateSubject: (id: string, subject: Partial<Subject>) => void;
  onDeleteSubject: (id: string) => void;
}

export function SubjectsTab({
  subjects,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
}: SubjectsTabProps) {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (sub: Subject) => {
    setEditingId(sub.id);
    setName(sub.name);
    setDescription(sub.description || "");
    setIsFormOpen(true);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = {
      name,
      description: description.trim() || undefined,
    };

    if (editingId) {
      onUpdateSubject(editingId, data);
    } else {
      onAddSubject(data);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6" id="subjects_panel">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="subjects_header">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Matérias e Revistas (Lições)</h2>
          <p className="text-sm text-slate-400">Total de {subjects.length} lições cadastradas para estudo bíblico</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full md:w-auto px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98] cursor-pointer"
        >
          <Plus size={18} />
          Cadastrar Nova Lição
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm text-slate-400 flex flex-col items-center justify-center gap-1.5">
          <BookOpen size={38} className="opacity-30 text-indigo-500 animate-pulse" />
          <p className="font-semibold text-slate-600">Nenhuma matéria registrada.</p>
          <p className="text-xs">Registre as lições e temas (Ex: Gálatas, Estudo dos Profetas) para guiar as chamadas!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="subjects_grid">
          {subjects.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl mt-0.5">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-base">{s.name}</h3>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">ESTUDO DA RECURSO</p>
                    </div>
                  </div>

                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenEdit(s)}
                      className="p-1 px-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                      title="Editar Matéria"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Deseja realmente remover a matéria ${s.name}?`
                          )
                        ) {
                          onDeleteSubject(s.id);
                        }
                      }}
                      className="p-1 px-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remover Matéria"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {s.description ? (
                  <p className="text-xs text-slate-500 leading-relaxed bg-slate-50/40 p-3 rounded-xl border border-slate-50/70">
                    {s.description}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-400">Sem descrição para esta lição.</p>
                )}
              </div>

              <div className="flex justify-end gap-1.5 text-[11px] text-slate-400 pt-4 mt-4 border-t border-slate-100 items-center">
                <Clock size={11} />
                <span>Modulado offline</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4" id="subject_input_modal">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center bg-indigo-600 text-white px-6 py-4">
              <h3 className="font-bold text-lg tracking-wide">
                {editingId ? "Editar Lição/Matéria" : "Cadastrar Nova Lição/Matéria"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-indigo-100 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="subject-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Título da Matéria / Lição *</label>
                <input
                  id="subject-name"
                  type="text"
                  required
                  placeholder="Ex: Escatologia Bíblica, Herois de Gênesis"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject-desc" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Tópicos Principais de Estudo</label>
                <textarea
                  id="subject-desc"
                  rows={3}
                  placeholder="Quais capítulos serão estudados, metas de ensino..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none resize-none"
                ></textarea>
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
                  {editingId ? "Salvar Alterações" : "Salvar Lição"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

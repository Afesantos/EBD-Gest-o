import { useState, FormEvent } from "react";
import { EbdClass } from "../types";
import { Plus, Edit, Trash2, Users, Tag, Info, X } from "lucide-react";

interface ClassesTabProps {
  classes: EbdClass[];
  onAddClass: (ebdClass: Omit<EbdClass, "id">) => void;
  onUpdateClass: (id: string, ebdClass: Partial<EbdClass>) => void;
  onDeleteClass: (id: string) => void;
}

export function ClassesTab({
  classes,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
}: ClassesTabProps) {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState<string>("");
  const [ageGroup, setAgeGroup] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setAgeGroup("");
    setDescription("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cls: EbdClass) => {
    setEditingId(cls.id);
    setName(cls.name);
    setAgeGroup(cls.ageGroup || "");
    setDescription(cls.description || "");
    setIsFormOpen(true);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = {
      name,
      ageGroup: ageGroup.trim() || undefined,
      description: description.trim() || undefined,
    };

    if (editingId) {
      onUpdateClass(editingId, data);
    } else {
      onAddClass(data);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6" id="classes_panel">
      {/* Top Controls Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="classes_header">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Salas / Classes da EBD</h2>
          <p className="text-sm text-slate-400">Total de {classes.length} salas registradas e monitoradas</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full md:w-auto px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98] cursor-pointer"
        >
          <Plus size={18} />
          Criar Nova Sala/Classe
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm text-slate-400 flex flex-col items-center justify-center gap-1.5">
          <Users size={38} className="opacity-30 text-indigo-500 animate-pulse" />
          <p className="font-semibold text-slate-600">Nenhuma sala/classe cadastrada.</p>
          <p className="text-xs">Clique no botão acima para adicionar a primeira classe da EBD (ex: Adultos, Jovens)!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="classes_grid">
          {classes.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 text-base">{c.name}</h3>
                    {c.ageGroup && (
                      <span className="inline-flex items-center gap-1.5 py-0.5 px-2 bg-indigo-50 text-indigo-700 rounded-md text-xs font-semibold">
                        <Tag size={12} />
                        Faixa Etária: {c.ageGroup}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="p-1 px-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                      title="Editar Coleções"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Deseja realmente remover a classe ${c.name}? Atenção: alunos associados ficarão sem classe.`
                          )
                        ) {
                          onDeleteClass(c.id);
                        }
                      }}
                      className="p-1 px-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remover Sala"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {c.description ? (
                  <p className="text-xs text-slate-500 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-50/70">
                    {c.description}
                  </p>
                ) : (
                  <p className="text-xs italic text-slate-400">Nenhuma descrição informada para esta sala.</p>
                )}
              </div>

              {/* Inside info badges */}
              <div className="flex justify-end gap-1.5 text-[11px] text-slate-400 pt-4 mt-4 border-t border-slate-100 items-center">
                <Info size={11} />
                <span>ID interno: {c.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4" id="class_input_modal">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center bg-indigo-600 text-white px-6 py-4">
              <h3 className="font-bold text-lg tracking-wide">
                {editingId ? "Editar Sala/Classe" : "Criar Nova Sala/Classe"}
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
                <label htmlFor="class-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nome da Classe/Turma *</label>
                <input
                  id="class-name"
                  type="text"
                  required
                  placeholder="Ex: Jovens (União Jovem), Adultos, Berçário"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="class-age" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Faixa Etária Recomendada</label>
                <input
                  id="class-age"
                  type="text"
                  placeholder="Ex: 15 a 25 anos, Casados, Geral"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="class-desc" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição dos Objetivos da Sala</label>
                <textarea
                  id="class-desc"
                  rows={3}
                  placeholder="Objetivos e descrição sumária da sala de aula para controle..."
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
                  {editingId ? "Salvar Alterações" : "Salvar Classe"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

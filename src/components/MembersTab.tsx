import { useState, useMemo, FormEvent, ChangeEvent } from "react";
import { Member } from "../types";
import { Plus, Search, Filter, Edit, Trash2, Gift, CreditCard, User, X, Sparkles } from "lucide-react";

interface MembersTabProps {
  members: Member[];
  onAddMember: (member: Member) => void;
  onUpdateMember: (id: string, member: Partial<Member>) => void;
  onDeleteMember: (id: string) => void;
}

export function MembersTab({
  members,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
}: MembersTabProps) {
  // Filter States
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("all");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Field States
  const [memberId, setMemberId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [rg, setRg] = useState<string>("");
  const [gender, setGender] = useState<string>("M");
  const [photo, setPhoto] = useState<string>("");

  // Filtered lists
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchText =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.id && m.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.cpf && m.cpf.includes(searchTerm)) ||
        (m.rg && m.rg.includes(searchTerm));

      const matchGender = genderFilter === "all" || m.gender === genderFilter;

      return matchText && matchGender;
    });
  }, [members, searchTerm, genderFilter]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setMemberId(`M${Math.floor(100 + Math.random() * 900)}`); // Prefill with a clean random ID suggestion
    setName("");
    setBirthDate("1998-01-01");
    setCpf("");
    setRg("");
    setGender("M");
    setPhoto("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingId(m.id || "");
    setMemberId(m.id || "");
    setName(m.name);
    setBirthDate(m.birthDate);
    setCpf(m.cpf || "");
    setRg(m.rg || "");
    setGender(m.gender);
    setPhoto(m.photo || "");
    setIsFormOpen(true);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data: Member = {
      id: memberId.trim() || undefined,
      name: name.trim(),
      birthDate,
      cpf: cpf.trim() || undefined,
      rg: rg.trim() || undefined,
      gender,
      photo: photo.trim() || undefined,
    };

    if (editingId) {
      onUpdateMember(editingId, data);
    } else {
      onAddMember(data);
    }

    setIsFormOpen(false);
  };

  // Helper to format CPF dynamically
  const handleCpfChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    setCpf(value);
  };

  return (
    <div className="space-y-6" id="members_tab_container">
      {/* Upper Header and Core triggers */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Catálogo Geral de Membros</h2>
          <p className="text-sm text-slate-400">
            Tabela interna de registros de pessoas para pesquisa e vinculação inteligente. Total: {members.length} membros.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full md:w-auto px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98] cursor-pointer"
        >
          <Plus size={18} />
          Cadastrar Novo Membro
        </button>
      </div>

      {/* Filter and search options row */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Buscar membro por Nome, Código, CPF ou RG..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
          />
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Filter size={18} />
          </span>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-slate-600"
          >
            <option value="all">Filtrar por Sexo: Todos</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
      </div>

      {/* Visual Members Grid & Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <User size={44} className="opacity-30" />
            <p className="font-semibold text-slate-600">Nenhum membro encontrado.</p>
            <p className="text-xs">Importe mais cadastros em Configurações ou cadastre um membro manualmente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-5">Foto & Nome</th>
                  <th className="py-4 px-5">Código (ID)</th>
                  <th className="py-4 px-5">Aniversário</th>
                  <th className="py-4 px-5">Documentos (CPF/RG)</th>
                  <th className="py-4 px-5">Sexo</th>
                  <th className="py-4 px-5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredMembers.map((m) => {
                  const labelGender = m.gender === "M" ? "Masculino" : m.gender === "F" ? "Feminino" : m.gender;
                  const localizedDate = m.birthDate
                    ? m.birthDate.split("-").reverse().join("/")
                    : "-";

                  return (
                    <tr key={m.id || m.name} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5 flex items-center gap-3">
                        {m.photo ? (
                          <img
                            src={m.photo}
                            alt={m.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold flex items-center justify-center text-xs">
                            {m.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-800">{m.name}</div>
                          {m.id && <span className="text-[10px] text-indigo-600 font-mono">Código: {m.id}</span>}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                          {m.id || "Sem Código"}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <Gift size={13} className="text-purple-400" />
                          {localizedDate}
                        </span>
                      </td>
                      <td className="py-4 px-5 space-y-0.5">
                        {m.cpf && (
                          <div className="text-xs text-slate-600 flex items-center gap-1">
                            <CreditCard size={12} className="text-slate-400" />
                            <span className="font-semibold text-slate-500">CPF:</span> {m.cpf}
                          </div>
                        )}
                        {m.rg && (
                          <div className="text-xs text-slate-500">
                            <span className="font-semibold text-slate-400">RG:</span> {m.rg}
                          </div>
                        )}
                        {!m.cpf && !m.rg && <span className="text-xs text-slate-400 italic">Não informados</span>}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-block py-0.5 px-2 rounded-full text-xs font-semibold ${
                          m.gender === "M"
                            ? "bg-indigo-50 border border-indigo-100 text-indigo-700"
                            : m.gender === "F"
                            ? "bg-pink-50 border border-pink-100 text-pink-700"
                            : "bg-slate-50 border border-slate-150 text-slate-600"
                        }`}>
                          {labelGender}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(m)}
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Editar dados do membro"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Deseja realmente remover o membro ${m.name}?`)) {
                                if (m.id) onDeleteMember(m.id);
                              }
                            }}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remover cadastro do membro"
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

      {/* Floating Dialog Modal for Member */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4" id="member_form_modal">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center bg-indigo-600 text-white px-6 py-4">
              <h3 className="font-bold text-lg tracking-wide">
                {editingId ? "Editar Informações do Membro" : "Cadastrar Novo Membro no Banco"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-indigo-100 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Member Code & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="member-code" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Código de Membro (ID) *</label>
                  <input
                    id="member-code"
                    type="text"
                    required
                    placeholder="M101"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="member-gender" className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-bold">Sexo / Gênero *</label>
                  <select
                    id="member-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none text-slate-700"
                  >
                    <option value="M">Masculino (M)</option>
                    <option value="F">Feminino (F)</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="member-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-bold">Nome do Membro *</label>
                <input
                  id="member-name"
                  type="text"
                  required
                  placeholder="Nome Completo do Membro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                />
              </div>

              {/* BirthDate & Photo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="member-birthday" className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-bold">Data de Nascimento *</label>
                  <input
                    id="member-birthday"
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="member-photo" className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-bold">URL da Foto (Opcional)</label>
                  <input
                    id="member-photo"
                    type="url"
                    placeholder="https://exemplo.com/foto.jpg"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>

              {/* CPF & RG */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="member-cpf" className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-bold">CPF (Opcional)</label>
                  <input
                    id="member-cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    maxLength={14}
                    value={cpf}
                    onChange={handleCpfChange}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="member-rg" className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-bold">RG (Opcional)</label>
                  <input
                    id="member-rg"
                    type="text"
                    placeholder="Ex: 12.345.678-0"
                    value={rg}
                    onChange={(e) => setRg(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Footer Actions */}
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
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Sparkles size={16} />
                  {editingId ? "Salvar Alterações" : "Cadastrar Membro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

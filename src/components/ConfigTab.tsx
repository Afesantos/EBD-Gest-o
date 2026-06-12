import { useState, FormEvent, ChangeEvent } from "react";
import { EbdSettings } from "../types";
import { Save, RefreshCw, Download, Upload, AlertTriangle, ShieldCheck, HelpCircle, Users } from "lucide-react";

interface ConfigTabProps {
  settings: EbdSettings;
  onSaveSettings: (settings: EbdSettings) => void;
  onFactoryReset: () => void;
  onImportBackup: (importedData: any) => boolean;
  onExportBackup: () => void;
  onImportMembers: (membersData: any[]) => boolean;
}

export function ConfigTab({
  settings,
  onSaveSettings,
  onFactoryReset,
  onImportBackup,
  onExportBackup,
  onImportMembers,
}: ConfigTabProps) {
  const [churchName, setChurchName] = useState<string>(settings.churchName);
  const [classDay, setClassDay] = useState<string>(settings.classDay);
  const [whatsappTemplate, setWhatsappTemplate] = useState<string>(settings.whatsappTemplate);

  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    onSaveSettings({
      churchName: churchName.trim(),
      classDay,
      whatsappTemplate: whatsappTemplate.trim(),
    });

    setMessage({ text: "Configurações institucionais atualizadas com sucesso!", error: false });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleReset = () => {
    if (
      confirm(
        "Atenção! Esta ação restaurará todos os dados originais fictícios do sistema. Todo o histórico de chamadas e alunos criados por você será irreversivelmente perdido. Deseja continuar?"
      )
    ) {
      onFactoryReset();
      setMessage({ text: "Banco de dados restaurado aos padrões originais!", error: false });
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const success = onImportBackup(parsed);

        if (success) {
          setMessage({ text: "Backup importado com sucesso! A página será reiniciada.", error: false });
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setMessage({
            text: "Erro estrutural: o arquivo JSON informado não corresponde ao formato oficial de backup da EBD.",
            error: true,
          });
        }
      } catch (err) {
        setMessage({ text: "Erro ao ler arquivo: formato JSON corrompido ou inválido.", error: true });
      }
    };
    reader.readAsText(file);
  };

  const handleMembersImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed)) {
          setMessage({ text: "Erro: O arquivo de membros deve ser uma lista (array) JSON.", error: true });
          return;
        }

        const isValid = parsed.every(m => m && typeof m === "object" && "name" in m);
        if (!isValid) {
          setMessage({ text: "Erro: Cada membro deve possuir ao menos o campo 'name' no JSON.", error: true });
          return;
        }

        const success = onImportMembers(parsed);
        if (success) {
          setMessage({ text: `Catálogo de membros importado com sucesso! (${parsed.length} registros).`, error: false });
          setTimeout(() => setMessage(null), 4000);
        } else {
          setMessage({ text: "Erro interno ao salvar a lista de membros no banco.", error: true });
        }
      } catch (err) {
        setMessage({ text: "Erro ao decodificar JSON de membros: arquivo corrompido ou inválido.", error: true });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6" id="config_panel">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm" id="config_header">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Preferências do Sistema</h2>
        <p className="text-sm text-slate-400">Personalize o logotipo de texto, templates de mensagens e exportação de backups.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-2.5 text-sm font-semibold shadow-sm ${message.error ? "bg-rose-50 text-rose-800 border border-rose-100" : "bg-emerald-50 text-emerald-800 border border-emerald-100"}`}>
          <ShieldCheck size={18} />
          <p>{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="config_main_grid">
        {/* Settings Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="font-bold text-slate-800 text-base pb-2 border-b border-slate-50">Identidade & Modelo</h3>

            {/* Institution / Church Name */}
            <div className="space-y-1.5">
              <label htmlFor="church-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nome da Instituição (EBD)</label>
              <input
                id="church-name"
                type="text"
                required
                placeholder="Ex: Igreja Evangélica Betel"
                value={churchName}
                onChange={(e) => setChurchName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* Attendance day select */}
            <div className="space-y-1.5">
              <label htmlFor="class-select-day" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Dia Padrão Evento</label>
              <select
                id="class-select-day"
                value={classDay}
                onChange={(e) => setClassDay(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none"
              >
                <option value="Sunday">Domingo (Tradicional)</option>
                <option value="Saturday">Sábado</option>
                <option value="Wednesday">Quarta-feira</option>
                <option value="Friday">Sexta-feira</option>
              </select>
            </div>

            {/* WhatsApp templates config with replacements guides */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between items-center">
                <label htmlFor="wa-template" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Template Whatsapp de Ausência (Falta)</label>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full">Tag: [ALUNO]</span>
              </div>
              <textarea
                id="wa-template"
                rows={3}
                value={whatsappTemplate}
                onChange={(e) => setWhatsappTemplate(e.target.value)}
                placeholder="Insira o texto e use a tag [ALUNO] para o nome automatizado..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none resize-none"
              ></textarea>
              <p className="text-[10px] text-slate-400">
                O aplicativo substituirá automaticamente o termo <code className="bg-slate-100 px-1 rounded font-mono text-indigo-600">[ALUNO]</code> pelo nome real cadastrado ao gerar a rota externa de clique rápido.
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-xs sm:text-sm active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
            >
              <Save size={16} />
              Salvar Preferências
            </button>
          </form>
        </div>

        {/* Local database backups (JSON layout file download) */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-base pb-2 border-b border-slate-50">Backups de Salvamento</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Como o sistema funciona de forma puramente offline para preservar a privacidade, todos os dados residem unicamente nesta máquina. Recomendamos exportar backups periódicos.
            </p>

            <div className="space-y-3 pt-2">
              {/* Export backup buttons */}
              <button
                onClick={onExportBackup}
                className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download size={15} />
                Exportar Backup EBD (.json)
              </button>

              {/* Import backup button */}
              <div className="relative">
                <label
                  htmlFor="file-import-input"
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Upload size={15} />
                  Importar Backup EBD (.json)
                </label>
                <input
                  type="file"
                  id="file-import-input"
                  accept=".json"
                  onChange={handleFileImport}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Members Import Database */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4" id="members_json_section">
            <h3 className="font-bold text-slate-800 text-base pb-2 border-b border-slate-50 flex items-center gap-1.5 text-indigo-700">
              <Users size={16} />
              Banco de Membros (.json)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Importe uma lista consolidada de membros para que você consiga efetuar preenchimento automatizado e rápido na criação de Alunos e Professores.
            </p>

            <div className="relative pt-1">
              <label
                htmlFor="members-import-input"
                className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Upload size={15} />
                Importar Lista de Membros
              </label>
              <input
                type="file"
                id="members-import-input"
                accept=".json"
                onChange={handleMembersImport}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full pointer-events-none"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Modelo de Formato:</span>
              <pre className="text-[9px] text-slate-600 font-mono bg-slate-100 p-2 rounded-lg overflow-x-auto max-h-32">
{`[
  {
    "id": "M101",
    "name": "Nome do Membro",
    "birthDate": "2010-05-15",
    "cpf": "123.456.789-00",
    "rg": "12.345.678-9",
    "gender": "M",
    "photo": "https://link.com/foto.jpg"
  }
]`}
              </pre>
            </div>
          </div>

          {/* Reset tab */}
          <div className="bg-rose-50/30 p-5 rounded-2xl border border-rose-100 shadow-sm space-y-3">
            <h3 className="font-bold text-rose-800 text-sm flex items-center gap-1.5">
              <AlertTriangle size={16} />
              Área de Perigo
            </h3>
            <p className="text-xs text-rose-700 leading-relaxed">
              Caso deseje inicializar com uma folha em branco ou excluir as alterações para recomeçar o processo de análise de dados.
            </p>

            <button
              onClick={handleReset}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={14} />
              Restaurar Dados Fictícios de Fábrica
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

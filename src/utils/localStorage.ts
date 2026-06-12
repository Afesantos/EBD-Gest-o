import { EbdClass, Subject, Teacher, Student, Attendance, EbdSettings, Member } from "../types";

const STORAGE_KEYS = {
  CLASSES: "ebd_classes",
  SUBJECTS: "ebd_subjects",
  TEACHERS: "ebd_teachers",
  STUDENTS: "ebd_students",
  ATTENDANCE: "ebd_attendance",
  SETTINGS: "ebd_settings",
  MEMBERS: "ebd_members",
};

const DEFAULT_SETTINGS: EbdSettings = {
  churchName: "Igreja Evangélica Memorial",
  classDay: "Sunday",
  whatsappTemplate: "Olá [ALUNO], sentimos sua falta na EBD hoje! Esperamos você no próximo domingo às 09:00.",
};

const INITIAL_MEMBERS: Member[] = [
  { id: "M101", name: "Lucas Souza Lima", birthDate: "2018-06-12", cpf: "123.456.789-01", rg: "12.345.678-9", gender: "M", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" },
  { id: "M102", name: "Beatriz Mello", birthDate: "2019-02-15", cpf: "234.567.890-12", rg: "23.456.789-0", gender: "F", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150" },
  { id: "M103", name: "Marcos Silva", birthDate: "1980-05-10", cpf: "345.678.901-23", rg: "34.567.890-1", gender: "M", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150" },
  { id: "M104", name: "Cláudia Souza", birthDate: "1985-08-25", cpf: "456.789.012-34", rg: "45.678.901-2", gender: "F", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150" },
  { id: "M105", name: "Amélia Santos", birthDate: "1994-09-12", cpf: "567.890.123-45", rg: "56.789.012-3", gender: "F", photo: "" },
  { id: "M106", name: "Fernando Nogueira", birthDate: "1992-03-18", cpf: "678.901.234-56", rg: "67.890.123-4", gender: "M", photo: "" },
  { id: "M107", name: "Gabriela Reis", birthDate: "2018-11-20", cpf: "789.012.345-67", rg: "78.901.234-5", gender: "F" },
  { id: "M108", name: "Matheus Oliveira Cruz", birthDate: "2012-06-03", cpf: "890.123.456-78", rg: "89.012.345-6", gender: "M" },
  { id: "M109", name: "Sarah Santos", birthDate: "2013-09-05", cpf: "901.234.567-89", rg: "90.123.456-7", gender: "F" },
];

const INITIAL_CLASSES: EbdClass[] = [
  { id: "c1", name: "Primários (7-8 anos)", ageGroup: "Crianças", description: "Classe de alfabetização bíblica para os pequeninos" },
  { id: "c2", name: "Adolescentes (12-14 anos)", ageGroup: "Juniores", description: "Desafios práticos e primeiros passos na fé madura" },
  { id: "c3", name: "Jovens (15-25 anos)", ageGroup: "Jovens", description: "Estudo crítico das Escrituras e cultura contemporânea" },
  { id: "c4", name: "Adultos (Discipulado)", ageGroup: "Adultos", description: "Curso intensivo de doutrina cristã básica e avançada" },
];

const INITIAL_SUBJECTS: Subject[] = [
  { id: "sub1", name: "Frutos do Espírito", description: "Estudo detalhado de Gálatas 5:22" },
  { id: "sub2", name: "Herois da Fé", description: "A jornada dos patriarcas de Gênesis" },
  { id: "sub3", name: "Doutrina da Salvação", description: "Graça, fé, justificação e santificação" },
  { id: "sub4", name: "Evangelhos Sinóticos", description: "Harmonia entre Mateus, Marcos e Lucas" },
];

const INITIAL_TEACHERS: Teacher[] = [
  { id: "t1", name: "Prof. Marcos Silva", email: "marcos.silva@email.com", phone: "11988887777", classId: "c3", subjectId: "sub3" },
  { id: "t2", name: "Profa. Cláudia Souza", email: "claudia.souza@email.com", phone: "11977776666", classId: "c1", subjectId: "sub1" },
  { id: "t3", name: "Prof. Roberto Mendes", email: "roberto@email.com", phone: "11966665555", classId: "c4", subjectId: "sub2" },
];

const INITIAL_STUDENTS: Student[] = [
  // Class 1 - Primários
  { id: "s1", name: "Lucas Souza Lima", birthDate: "2018-06-12", phone: "11912345678", email: "lucas@email.com", classId: "c1", active: true },
  { id: "s2", name: "Beatriz Mello", birthDate: "2019-02-15", phone: "11923456789", classId: "c1", active: true },
  { id: "s3", name: "Gabriela Reis", birthDate: "2018-11-20", classId: "c1", active: true },
  
  // Class 2 - Adolescentes
  { id: "s4", name: "Matheus Oliveira Cruz", birthDate: "2012-06-03", phone: "11934567890", classId: "c2", active: true },
  { id: "s5", name: "Sarah Santos", birthDate: "2013-09-05", phone: "11945678901", classId: "c2", active: true },
  
  // Class 3 - Jovens
  { id: "s6", name: "João Pedro Silveira", birthDate: "2005-04-10", phone: "11956789012", email: "joao.pedro@email.com", classId: "c3", active: true },
  { id: "s7", name: "Mariana Alencar", birthDate: "2006-06-14", phone: "11967890123", email: "mariana@email.com", classId: "c3", active: true },
  { id: "s8", name: "Daniel Ferreira Guedes", birthDate: "2004-08-30", phone: "11978901234", classId: "c3", active: true },
  { id: "s9", name: "Esther Rodrigues", birthDate: "2003-12-12", phone: "11989012345", classId: "c3", active: false }, // Inativo

  // Class 4 - Adultos
  { id: "s10", name: "Thiago Mendes Dias", birthDate: "1988-06-08", phone: "11990123456", email: "thiago@email.com", classId: "c4", active: true },
  { id: "s11", name: "Rita Ramos Paiva", birthDate: "1975-03-24", phone: "11901234567", classId: "c4", active: true },
  { id: "s12", name: "Carlos Eduardo Santos", birthDate: "1990-10-18", phone: "11932145678", classId: "c4", active: true },
];

const INITIAL_ATTENDANCE: Attendance[] = [
  // Sunday, May 24, 2026
  {
    id: "att1",
    classId: "c3",
    date: "2026-05-24",
    subjectId: "sub3",
    records: [
      { studentId: "s6", present: true },
      { studentId: "s7", present: true },
      { studentId: "s8", present: false },
    ],
    visitorCount: 1,
    biblesCount: 2,
    magazinesCount: 3,
    offeringValue: 15.50,
    notes: "Primeiro estudo sobre Justificação. Visita do primo da Mariana.",
  },
  {
    id: "att2",
    classId: "c4",
    date: "2026-05-24",
    subjectId: "sub2",
    records: [
      { studentId: "s10", present: true },
      { studentId: "s11", present: true },
      { studentId: "s12", present: true },
    ],
    visitorCount: 0,
    biblesCount: 3,
    magazinesCount: 3,
    offeringValue: 30.00,
  },
  // Sunday, May 31, 2026
  {
    id: "att3",
    classId: "c3",
    date: "2026-05-31",
    subjectId: "sub3",
    records: [
      { studentId: "s6", present: true },
      { studentId: "s7", present: false },
      { studentId: "s8", present: true },
    ],
    visitorCount: 0,
    biblesCount: 2,
    magazinesCount: 2,
    offeringValue: 10.00,
    notes: "Segunda parte: Santificação Prática.",
  },
  {
    id: "att4",
    classId: "c4",
    date: "2026-05-31",
    subjectId: "sub2",
    records: [
      { studentId: "s10", present: true },
      { studentId: "s11", present: false },
      { studentId: "s12", present: true },
    ],
    visitorCount: 2,
    biblesCount: 2,
    magazinesCount: 2,
    offeringValue: 45.00,
    notes: "Grande participação dos adultos hoje.",
  },
  // Sunday, June 7, 2026
  {
    id: "att5",
    classId: "c3",
    date: "2026-06-07",
    subjectId: "sub3",
    records: [
      { studentId: "s6", present: true },
      { studentId: "s7", present: true },
      { studentId: "s8", present: true },
    ],
    visitorCount: 1,
    biblesCount: 3,
    magazinesCount: 3,
    offeringValue: 20.00,
    notes: "Classe cheia. Excelente debate sobre santidade.",
  },
  {
    id: "att6",
    classId: "c1",
    date: "2026-06-07",
    subjectId: "sub1",
    records: [
      { studentId: "s1", present: true },
      { studentId: "s2", present: true },
      { studentId: "s3", present: false },
    ],
    visitorCount: 0,
    biblesCount: 2,
    magazinesCount: 2,
    offeringValue: 5.00,
  }
];

export function initializeDatabase() {
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(INITIAL_CLASSES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUBJECTS)) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(INITIAL_TEACHERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
  }
}

// Low-level safe actions
export function getStoredData<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error("Erro ao carregar dados do localStorage", key, e);
    return fallback;
  }
}

export function setStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Erro ao salvar dados no localStorage", key, e);
  }
}

export const db = {
  getSettings: () => getStoredData<EbdSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS),
  saveSettings: (settings: EbdSettings) => setStoredData(STORAGE_KEYS.SETTINGS, settings),

  getClasses: () => getStoredData<EbdClass[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES),
  saveClasses: (classes: EbdClass[]) => setStoredData(STORAGE_KEYS.CLASSES, classes),

  getSubjects: () => getStoredData<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS),
  saveSubjects: (subjects: Subject[]) => setStoredData(STORAGE_KEYS.SUBJECTS, subjects),

  getTeachers: () => getStoredData<Teacher[]>(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS),
  saveTeachers: (teachers: Teacher[]) => setStoredData(STORAGE_KEYS.TEACHERS, teachers),

  getStudents: () => getStoredData<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS),
  saveStudents: (students: Student[]) => setStoredData(STORAGE_KEYS.STUDENTS, students),

  getMembers: () => getStoredData<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS),
  saveMembers: (members: Member[]) => setStoredData(STORAGE_KEYS.MEMBERS, members),

  getAttendance: () => getStoredData<Attendance[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE),
  saveAttendance: (attendance: Attendance[]) => setStoredData(STORAGE_KEYS.ATTENDANCE, attendance),

  factoryReset: () => {
    localStorage.removeItem(STORAGE_KEYS.CLASSES);
    localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(STORAGE_KEYS.TEACHERS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    initializeDatabase();
  }
};

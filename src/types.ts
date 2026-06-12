export interface EbdClass {
  id: string;
  name: string;
  ageGroup?: string;
  description?: string;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  classId?: string; // Linked primary class
  subjectId?: string; // Linked primary subject
}

export interface Student {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  phone?: string;
  email?: string;
  classId: string; // Linked Class
  active: boolean;
}

export interface AttendanceRecord {
  studentId: string;
  present: boolean;
  late?: boolean;
}

export interface Attendance {
  id: string;
  classId: string;
  date: string; // YYYY-MM-DD
  subjectId?: string;
  records: AttendanceRecord[];
  visitorCount?: number;
  biblesCount?: number;
  magazinesCount?: number;
  offeringValue?: number;
  notes?: string;
}

export interface EbdSettings {
  churchName: string;
  classDay: string; // 'Sunday' | 'Saturday' | 'Wednesday' etc.
  whatsappTemplate: string;
}

export interface Member {
  id?: string; // Optional Member Code (Código de Membro caso houver)
  name: string;
  birthDate: string; // YYYY-MM-DD
  cpf?: string;
  rg?: string;
  gender: string; // 'Male' | 'Female' or in Portuguese 'M' | 'F'
  photo?: string; // photo URL or base64
}

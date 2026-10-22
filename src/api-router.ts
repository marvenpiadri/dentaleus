import { Router, Request, Response } from 'express';

export const apiRouter = Router();

export interface Patient {
  id: string;
  organizationId: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  gender: 'M' | 'F' | 'OTHER' | null;
  nationalId: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface Appointment {
  id: string;
  organizationId: string;
  clinicId: string;
  patientId: string;
  patientNumber: string;
  patientFirstName: string;
  patientLastName: string;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  reason: string | null;
  providerId: string | null;
  providerName: string | null;
  operatoryId: string | null;
  operatoryName: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export type RecallStatus = 'DUE' | 'CONTACTED' | 'SCHEDULED' | 'COMPLETED' | 'DECLINED' | 'INACTIVE';

export interface PatientRecall {
  id: string;
  patientId: string;
  patientNumber: string;
  patientFirstName: string;
  patientLastName: string;
  patientPhone: string | null;
  recallType: string;
  dueOn: string;
  previousCompletedOn: string | null;
  intervalMonths: number;
  status: RecallStatus;
  preferredContactMethod: string | null;
  lastContactedAt: string | null;
  note: string | null;
  contactAttempts: number;
  lastContactOutcome: string | null;
}

export interface Provider {
  id: string;
  displayName: string;
  role: 'DENTIST' | 'ORTHODONTIST' | 'HYGIENIST' | 'ASSISTANT' | 'SPECIALIST';
  color: string;
  userId: string | null;
  active: boolean;
  workingHours: Array<{ dayOfWeek: number; startsAt: string; endsAt: string }>;
}

export interface Operatory {
  id: string;
  name: string;
  chairNumber: number | null;
  color: string;
  active: boolean;
}

// In-memory data store
const currentUser = {
  id: 'usr_demo',
  name: 'Dr. Marven',
  email: 'docteur@dentaleus.fr',
  emailVerified: true,
  image: null,
};

let clinicProfile = {
  id: 'clinic_1',
  name: 'Cabinet Dentaire Central',
  city: 'Paris',
  address: '14 Boulevard Saint-Germain, 75005 Paris',
  phone: '01 43 25 88 99',
  email: 'contact@cabinet-dentaleus.fr',
  timezone: 'Europe/Paris',
  updatedAt: new Date().toISOString(),
};

const organizations = [
  {
    id: 'org_1',
    name: 'Groupe Dentaleus',
    slug: 'cabinet-marven',
    currency: 'EUR',
    locale: 'fr-FR',
    organization_role: 'ORGANIZATION_ADMIN',
    clinics: [
      {
        id: 'clinic_1',
        name: 'Cabinet Dentaire Central',
        role: 'CLINIC_ADMIN',
        timezone: 'Europe/Paris',
        city: 'Paris',
      },
    ],
  },
];

const providers: Provider[] = [
  {
    id: 'prov_1',
    displayName: 'Dr. Marven',
    role: 'DENTIST',
    color: '#087f75',
    userId: 'usr_demo',
    active: true,
    workingHours: [
      { dayOfWeek: 1, startsAt: '08:30', endsAt: '18:30' },
      { dayOfWeek: 2, startsAt: '08:30', endsAt: '18:30' },
      { dayOfWeek: 3, startsAt: '08:30', endsAt: '18:30' },
      { dayOfWeek: 4, startsAt: '08:30', endsAt: '18:30' },
      { dayOfWeek: 5, startsAt: '08:30', endsAt: '17:00' },
    ],
  },
  {
    id: 'prov_2',
    displayName: 'Dr. Sarah Alami',
    role: 'ORTHODONTIST',
    color: '#3b82f6',
    userId: null,
    active: true,
    workingHours: [
      { dayOfWeek: 2, startsAt: '09:00', endsAt: '17:00' },
      { dayOfWeek: 4, startsAt: '09:00', endsAt: '17:00' },
    ],
  },
  {
    id: 'prov_3',
    displayName: 'Nathalie Vasseur',
    role: 'HYGIENIST',
    color: '#10b981',
    userId: null,
    active: true,
    workingHours: [
      { dayOfWeek: 1, startsAt: '09:00', endsAt: '18:00' },
      { dayOfWeek: 3, startsAt: '09:00', endsAt: '18:00' },
    ],
  },
];

const operatories: Operatory[] = [
  { id: 'op_1', name: 'Fauteuil 1 (Chirurgie)', chairNumber: 1, color: '#087f75', active: true },
  { id: 'op_2', name: 'Fauteuil 2 (Omnipratique)', chairNumber: 2, color: '#6366f1', active: true },
  { id: 'op_3', name: 'Fauteuil 3 (Hygiène & Prévention)', chairNumber: 3, color: '#10b981', active: true },
];

const patients: Patient[] = [
  {
    id: 'pat_1',
    organizationId: 'org_1',
    patientNumber: 'D-2026-001',
    firstName: 'Thomas',
    lastName: 'Dubois',
    birthDate: '1988-04-12',
    gender: 'M',
    nationalId: '1880475012345',
    phone: '06 12 34 56 78',
    email: 'thomas.dubois@email.fr',
    address: '18 Rue de Rennes',
    city: 'Paris',
    notes: 'Sensibilité dentaire au froid secteur 1. Bilan annuel.',
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'pat_2',
    organizationId: 'org_1',
    patientNumber: 'D-2026-002',
    firstName: 'Sophie',
    lastName: 'Martin',
    birthDate: '1995-09-23',
    gender: 'F',
    nationalId: '2950975054321',
    phone: '06 98 76 54 32',
    email: 'sophie.martin@example.org',
    address: '42 Avenue Victor Hugo',
    city: 'Boulogne-Billancourt',
    notes: 'Traitement orthodontique en cours. Surveillance facettes 11-21.',
    createdAt: '2026-02-10T11:20:00.000Z',
    updatedAt: '2026-02-10T11:20:00.000Z',
  },
  {
    id: 'pat_3',
    organizationId: 'org_1',
    patientNumber: 'D-2026-003',
    firstName: 'Lucas',
    lastName: 'Bernard',
    birthDate: '2001-12-05',
    gender: 'M',
    nationalId: '1011275098765',
    phone: '07 88 11 22 33',
    email: 'lucas.bernard@mail.com',
    address: '7 Place de la République',
    city: 'Paris',
    notes: 'Détartrage et contrôle semestriel. Pas d’allergie signalée.',
    createdAt: '2026-03-01T14:45:00.000Z',
    updatedAt: '2026-03-01T14:45:00.000Z',
  },
  {
    id: 'pat_4',
    organizationId: 'org_1',
    patientNumber: 'D-2026-004',
    firstName: 'Éléonore',
    lastName: 'Mercier',
    birthDate: '1976-06-18',
    gender: 'F',
    nationalId: '2760675033445',
    phone: '06 55 44 33 22',
    email: 'e.mercier@cabinet.net',
    address: '25 Rue Monge',
    city: 'Paris',
    notes: 'Implant 46 posé en 2025. Contrôle d’ostéointégration favorable.',
    createdAt: '2026-03-20T10:00:00.000Z',
    updatedAt: '2026-03-20T10:00:00.000Z',
  },
  {
    id: 'pat_5',
    organizationId: 'org_1',
    patientNumber: 'D-2026-005',
    firstName: 'Karim',
    lastName: 'Benali',
    birthDate: '1992-02-28',
    gender: 'M',
    nationalId: '1920275044556',
    phone: '06 33 22 11 00',
    email: 'k.benali@outlook.fr',
    address: '9 Rue La Fayette',
    city: 'Paris',
    notes: 'Bruxisme nocturne. Gouttière de libération occlusale délivrée.',
    createdAt: '2026-04-05T08:30:00.000Z',
    updatedAt: '2026-04-05T08:30:00.000Z',
  },
];

const now = new Date();
const todayYMD = now.toISOString().slice(0, 10);

const appointments: Appointment[] = [
  {
    id: 'apt_1',
    organizationId: 'org_1',
    clinicId: 'clinic_1',
    patientId: 'pat_1',
    patientNumber: 'D-2026-001',
    patientFirstName: 'Thomas',
    patientLastName: 'Dubois',
    startsAt: `${todayYMD}T09:00:00.000Z`,
    endsAt: `${todayYMD}T09:45:00.000Z`,
    status: 'CONFIRMED',
    reason: 'Contrôle annuel et détartrage supra-gingival',
    providerId: 'prov_1',
    providerName: 'Dr. Marven',
    operatoryId: 'op_1',
    operatoryName: 'Fauteuil 1 (Chirurgie)',
    createdById: 'usr_demo',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'apt_2',
    organizationId: 'org_1',
    clinicId: 'clinic_1',
    patientId: 'pat_2',
    patientNumber: 'D-2026-002',
    patientFirstName: 'Sophie',
    patientLastName: 'Martin',
    startsAt: `${todayYMD}T10:15:00.000Z`,
    endsAt: `${todayYMD}T11:00:00.000Z`,
    status: 'IN_PROGRESS',
    reason: 'Ajustement appareil orthodontique et contrôle d’alignement',
    providerId: 'prov_2',
    providerName: 'Dr. Sarah Alami',
    operatoryId: 'op_2',
    operatoryName: 'Fauteuil 2 (Omnipratique)',
    createdById: 'usr_demo',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'apt_3',
    organizationId: 'org_1',
    clinicId: 'clinic_1',
    patientId: 'pat_3',
    patientNumber: 'D-2026-003',
    patientFirstName: 'Lucas',
    patientLastName: 'Bernard',
    startsAt: `${todayYMD}T14:00:00.000Z`,
    endsAt: `${todayYMD}T14:30:00.000Z`,
    status: 'SCHEDULED',
    reason: 'Séance d’hygiène et polissage',
    providerId: 'prov_3',
    providerName: 'Nathalie Vasseur',
    operatoryId: 'op_3',
    operatoryName: 'Fauteuil 3 (Hygiène & Prévention)',
    createdById: 'usr_demo',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'apt_4',
    organizationId: 'org_1',
    clinicId: 'clinic_1',
    patientId: 'pat_4',
    patientNumber: 'D-2026-004',
    patientFirstName: 'Éléonore',
    patientLastName: 'Mercier',
    startsAt: `${todayYMD}T15:30:00.000Z`,
    endsAt: `${todayYMD}T16:15:00.000Z`,
    status: 'CONFIRMED',
    reason: 'Contrôle prothétique sur implant 46',
    providerId: 'prov_1',
    providerName: 'Dr. Marven',
    operatoryId: 'op_1',
    operatoryName: 'Fauteuil 1 (Chirurgie)',
    createdById: 'usr_demo',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const recalls: PatientRecall[] = [
  {
    id: 'rec_1',
    patientId: 'pat_1',
    patientNumber: 'D-2026-001',
    patientFirstName: 'Thomas',
    patientLastName: 'Dubois',
    patientPhone: '06 12 34 56 78',
    recallType: 'Contrôle annuel & Bilan radiographique',
    dueOn: todayYMD,
    previousCompletedOn: '2025-04-12',
    intervalMonths: 12,
    status: 'DUE',
    preferredContactMethod: 'SMS',
    lastContactedAt: null,
    note: 'Rappel pour contrôle préventif annuel',
    contactAttempts: 0,
    lastContactOutcome: null,
  },
  {
    id: 'rec_2',
    patientId: 'pat_4',
    patientNumber: 'D-2026-004',
    patientFirstName: 'Éléonore',
    patientLastName: 'Mercier',
    patientPhone: '06 55 44 33 22',
    recallType: 'Maintenance implantaire 46',
    dueOn: '2026-11-15',
    previousCompletedOn: '2025-11-10',
    intervalMonths: 12,
    status: 'SCHEDULED',
    preferredContactMethod: 'EMAIL',
    lastContactedAt: '2026-10-18T10:00:00.000Z',
    note: 'Rendez-vous programmé pour contrôle de vissage',
    contactAttempts: 1,
    lastContactOutcome: 'CONFIRMED',
  },
  {
    id: 'rec_3',
    patientId: 'pat_5',
    patientNumber: 'D-2026-005',
    patientFirstName: 'Karim',
    patientLastName: 'Benali',
    patientPhone: '06 33 22 11 00',
    recallType: 'Contrôle gouttière occlusale',
    dueOn: '2026-09-30',
    previousCompletedOn: '2026-03-30',
    intervalMonths: 6,
    status: 'CONTACTED',
    preferredContactMethod: 'PHONE',
    lastContactedAt: '2026-10-02T14:30:00.000Z',
    note: 'Message vocal laissé pour planifier la séance',
    contactAttempts: 2,
    lastContactOutcome: 'VOICEMAIL',
  },
];

interface OdontogramRecord {
  status: Record<string, unknown>;
  plan: Record<string, unknown> | null;
  planChanges: Array<{ toothNo: number; axis: string; from?: unknown; to?: unknown }>;
  updatedAt: string;
}

const odontogramStore = new Map<string, OdontogramRecord>();
const odontogramRevisions = new Map<string, Array<{ versionNo: number; recordedByName: string | null; createdAt: string }>>();

odontogramStore.set('pat_1', {
  status: {
    version: '2.22',
    teeth: {
      '16': { condition: 'caries', surfaces: ['O'] },
      '26': { condition: 'amalgam', surfaces: ['MO'] },
      '46': { condition: 'composite', surfaces: ['MOD'] },
    },
    globals: {},
  },
  plan: {
    version: '2.22',
    teeth: {
      '16': { planned: 'composite', surfaces: ['O'] },
    },
    globals: {},
  },
  planChanges: [{ toothNo: 16, axis: 'O', to: 'composite' }],
  updatedAt: new Date().toISOString(),
});

odontogramRevisions.set('pat_1', [
  { versionNo: 1, recordedByName: 'Dr. Marven', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
]);

interface EncounterItem {
  id: string;
  appointmentId: string | null;
  status: string;
  encounterType: string;
  responsibleProviderId: string | null;
  responsibleDentistName: string;
  startedAt: string;
  endedAt: string | null;
  chiefComplaint: string;
  createdByName: string;
  signedAt: string | null;
  signedById: string | null;
  signedByName: string | null;
  noteCount: number;
  procedureCount: number;
  mediaCount: number;
  notes: any[];
  findings: any[];
  procedures: any[];
  media: any[];
  followUps: any[];
  participants: any[];
}

const encountersStore = new Map<string, EncounterItem[]>();
encountersStore.set('pat_1', [
  {
    id: 'enc_1',
    appointmentId: 'apt_1',
    status: 'COMPLETED',
    encounterType: 'CONSULTATION',
    responsibleProviderId: 'prov_1',
    responsibleDentistName: 'Dr. Marven',
    startedAt: '2026-01-15T09:00:00.000Z',
    endedAt: '2026-01-15T09:40:00.000Z',
    chiefComplaint: 'Sensibilité au froid sur la molaire supérieure droite',
    createdByName: 'Dr. Marven',
    signedAt: '2026-01-15T09:40:00.000Z',
    signedById: 'usr_demo',
    signedByName: 'Dr. Marven',
    noteCount: 1,
    procedureCount: 1,
    mediaCount: 0,
    notes: [
      {
        id: 'note_1',
        noteType: 'ASSESSMENT',
        content: 'Examen clinique satisfaisant. Hygiène globale bien maintenue. Présence d’une lésion carieuse occlusale débutante sur 16.',
        createdByName: 'Dr. Marven',
        signedById: 'usr_demo',
        signedByName: 'Dr. Marven',
        signedAt: '2026-01-15T09:40:00.000Z',
        createdAt: '2026-01-15T09:20:00.000Z',
        amendments: [],
      },
    ],
    findings: [
      {
        id: 'fnd_1',
        findingType: 'DIAGNOSIS',
        description: 'Carie de l’émail et de la dentine sans atteinte pulpaire',
        severity: 'MODERATE',
        toothNo: 16,
        surface: 'O',
        createdAt: '2026-01-15T09:25:00.000Z',
        amendments: [],
      },
    ],
    procedures: [
      {
        id: 'prc_1',
        title: 'Bilan bucco-dentaire complet',
        category: 'EXAM',
        status: 'COMPLETED',
        notes: 'Examen parodontal et radiographies rétro-alvéolaires de contrôle.',
        performedAt: '2026-01-15T09:35:00.000Z',
        toothSites: [{ toothNo: 16, surface: 'O' }],
        amendments: [],
      },
    ],
    media: [],
    followUps: [
      {
        id: 'flw_1',
        instruction: 'Prévoir restauration composite sur 16 lors de la prochaine séance.',
        dueAt: `${todayYMD}T09:00:00.000Z`,
        status: 'PENDING',
        createdById: 'usr_demo',
        createdAt: '2026-01-15T09:40:00.000Z',
      },
    ],
    participants: [{ userId: 'usr_demo', name: 'Dr. Marven', role: 'DENTIST', createdAt: '2026-01-15T09:00:00.000Z' }],
  },
]);

function getParam(req: Request, key: string): string {
  const val = req.params[key];
  if (Array.isArray(val)) return val[0] ?? '';
  return val ?? '';
}

// Auth Endpoints
apiRouter.get('/auth/session', (_req: Request, res: Response): void => {
  res.json({ user: currentUser, session: { expiresAt: '2030-01-01T00:00:00.000Z' } });
});

apiRouter.post('/auth/sign-in/email', (_req: Request, res: Response): void => {
  res.json({ success: true, user: currentUser });
});

apiRouter.post('/auth/sign-out', (_req: Request, res: Response): void => {
  res.json({ success: true });
});

apiRouter.get('/v1/session', (_req: Request, res: Response): void => {
  res.json({
    user: currentUser,
    session: { expiresAt: '2030-01-01T00:00:00.000Z' },
  });
});

// Organizations & Clinics
apiRouter.get('/v1/organizations', (_req: Request, res: Response): void => {
  res.json({ data: organizations });
});

apiRouter.get('/v1/organizations/:orgId/clinics/:clinicId/settings/profile', (_req: Request, res: Response): void => {
  res.json({ data: clinicProfile, canEdit: true });
});

apiRouter.put('/v1/organizations/:orgId/clinics/:clinicId/settings/profile', (req: Request, res: Response): void => {
  const body = req.body as Partial<typeof clinicProfile>;
  clinicProfile = {
    ...clinicProfile,
    ...body,
    updatedAt: new Date().toISOString(),
  };
  res.json({ data: clinicProfile });
});

// Scheduling Resources
apiRouter.get('/v1/organizations/:orgId/clinics/:clinicId/scheduling-resources', (_req: Request, res: Response): void => {
  res.json({ data: { providers, operatories } });
});

apiRouter.post('/v1/organizations/:orgId/clinics/:clinicId/scheduling-resources/providers', (req: Request, res: Response): void => {
  const body = req.body as { displayName?: string; role?: Provider['role']; color?: string };
  const newProvider: Provider = {
    id: `prov_${Date.now()}`,
    displayName: body.displayName ?? 'Nouveau Praticien',
    role: body.role ?? 'DENTIST',
    color: body.color ?? '#087f75',
    userId: null,
    active: true,
    workingHours: [
      { dayOfWeek: 1, startsAt: '09:00', endsAt: '18:00' },
      { dayOfWeek: 2, startsAt: '09:00', endsAt: '18:00' },
      { dayOfWeek: 3, startsAt: '09:00', endsAt: '18:00' },
      { dayOfWeek: 4, startsAt: '09:00', endsAt: '18:00' },
      { dayOfWeek: 5, startsAt: '09:00', endsAt: '18:00' },
    ],
  };
  providers.push(newProvider);
  res.json({ data: newProvider });
});

apiRouter.post('/v1/organizations/:orgId/clinics/:clinicId/scheduling-resources/operatories', (req: Request, res: Response): void => {
  const body = req.body as { name?: string; chairNumber?: number | null; color?: string };
  const newOperatory: Operatory = {
    id: `op_${Date.now()}`,
    name: body.name ?? 'Fauteuil',
    chairNumber: body.chairNumber ?? (operatories.length + 1),
    color: body.color ?? '#6366f1',
    active: true,
  };
  operatories.push(newOperatory);
  res.json({ data: newOperatory });
});

apiRouter.put('/v1/organizations/:orgId/clinics/:clinicId/scheduling-resources/providers/:providerId/working-hours/bulk', (req: Request, res: Response): void => {
  const provId = getParam(req, 'providerId');
  const provider = providers.find((p) => p.id === provId);
  const body = req.body as { hours?: Array<{ dayOfWeek: number; startsAt: string; endsAt: string }> };
  if (provider && Array.isArray(body.hours)) {
    provider.workingHours = body.hours;
  }
  res.json({ success: true });
});

// Patients
apiRouter.get('/v1/organizations/:orgId/clinics/:clinicId/patients', (req: Request, res: Response): void => {
  const q = typeof req.query['q'] === 'string' ? req.query['q'].trim().toLowerCase() : '';
  const filtered = q
    ? patients.filter(
        (p) =>
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.patientNumber.toLowerCase().includes(q) ||
          (p.phone !== null && p.phone.includes(q)),
      )
    : patients;
  res.json({ data: filtered, count: filtered.length });
});

apiRouter.post('/v1/organizations/:orgId/clinics/:clinicId/patients', (req: Request, res: Response): void => {
  const body = req.body as Partial<Patient>;
  const orgId = getParam(req, 'orgId') || 'org_1';
  const newPatient: Patient = {
    id: `pat_${Date.now()}`,
    organizationId: orgId,
    patientNumber: `D-2026-${String(patients.length + 1).padStart(3, '0')}`,
    firstName: body.firstName ?? '',
    lastName: body.lastName ?? '',
    birthDate: body.birthDate ?? null,
    gender: body.gender ?? null,
    nationalId: body.nationalId ?? null,
    phone: body.phone ?? null,
    email: body.email ?? null,
    address: body.address ?? null,
    city: body.city ?? null,
    notes: body.notes ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  patients.unshift(newPatient);
  res.json({ data: newPatient });
});

apiRouter.get('/v1/organizations/:orgId/clinics/:clinicId/patients/:patientId', (req: Request, res: Response): void => {
  const patId = getParam(req, 'patientId');
  const patient = patients.find((p) => p.id === patId);
  if (!patient) {
    res.status(404).json({ error: { message: 'Patient introuvable' } });
    return;
  }
  res.json({ data: patient });
});

apiRouter.put('/v1/organizations/:orgId/clinics/:clinicId/patients/:patientId', (req: Request, res: Response): void => {
  const patId = getParam(req, 'patientId');
  const index = patients.findIndex((p) => p.id === patId);
  if (index === -1) {
    res.status(404).json({ error: { message: 'Patient introuvable' } });
    return;
  }
  const existing = patients[index]!;
  const body = req.body as Partial<Patient>;
  patients[index] = {
    ...existing,
    ...body,
    updatedAt: new Date().toISOString(),
  };
  res.json({ data: patients[index] });
});

// Appointments
apiRouter.get('/v1/organizations/:orgId/clinics/:clinicId/appointments', (_req: Request, res: Response): void => {
  res.json({ data: appointments, count: appointments.length });
});

apiRouter.get('/v1/organizations/:orgId/clinics/:clinicId/patients/:patientId/appointments', (req: Request, res: Response): void => {
  const patId = getParam(req, 'patientId');
  const list = appointments.filter((a) => a.patientId === patId);
  res.json({ data: list, count: list.length });
});

apiRouter.post('/v1/organizations/:orgId/clinics/:clinicId/appointments', (req: Request, res: Response): void => {
  const body = req.body as {
    patientId: string;
    startsAt: string;
    endsAt: string;
    reason?: string;
    providerId?: string | null;
    operatoryId?: string | null;
  };
  const patient = patients.find((p) => p.id === body.patientId);
  const provider = providers.find((p) => p.id === body.providerId);
  const operatory = operatories.find((o) => o.id === body.operatoryId);
  const orgId = getParam(req, 'orgId') || 'org_1';
  const clinicId = getParam(req, 'clinicId') || 'clinic_1';

  const newAppointment: Appointment = {
    id: `apt_${Date.now()}`,
    organizationId: orgId,
    clinicId: clinicId,
    patientId: body.patientId,
    patientNumber: patient?.patientNumber ?? 'D-2026-NEW',
    patientFirstName: patient?.firstName ?? 'Nouveau',
    patientLastName: patient?.lastName ?? 'Patient',
    startsAt: body.startsAt,
    endsAt: body.endsAt,
    status: 'SCHEDULED',
    reason: body.reason ?? null,
    providerId: body.providerId ?? null,
    providerName: provider?.displayName ?? null,
    operatoryId: body.operatoryId ?? null,
    operatoryName: operatory?.name ?? null,
    createdById: 'usr_demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  appointments.push(newAppointment);
  res.json({ data: newAppointment });
});

apiRouter.patch('/v1/organizations/:orgId/clinics/:clinicId/appointments/:appointmentId/status', (req: Request, res: Response): void => {
  const aptId = getParam(req, 'appointmentId');
  const apt = appointments.find((a) => a.id === aptId);
  const body = req.body as { status: AppointmentStatus };
  if (apt) {
    apt.status = body.status;
    apt.updatedAt = new Date().toISOString();
  }
  res.json({ success: true, data: apt });
});

apiRouter.patch('/v1/organizations/:orgId/clinics/:clinicId/appointments/:appointmentId/reschedule', (req: Request, res: Response): void => {
  const aptId = getParam(req, 'appointmentId');
  const apt = appointments.find((a) => a.id === aptId);
  const body = req.body as {
    startsAt?: string;
    endsAt?: string;
    providerId?: string | null;
    operatoryId?: string | null;
  };
  if (apt) {
    if (body.startsAt !== undefined) apt.startsAt = body.startsAt;
    if (body.endsAt !== undefined) apt.endsAt = body.endsAt;
    if (body.providerId !== undefined) {
      apt.providerId = body.providerId;
      apt.providerName = providers.find((p) => p.id === body.providerId)?.displayName ?? null;
    }
    if (body.operatoryId !== undefined) {
      apt.operatoryId = body.operatoryId;
      apt.operatoryName = operatories.find((o) => o.id === body.operatoryId)?.name ?? null;
    }
    apt.updatedAt = new Date().toISOString();
  }
  res.json({ success: true, data: apt });
});

// Recalls
apiRouter.get('/v1/organizations/:orgId/clinics/:clinicId/recalls', (req: Request, res: Response): void => {
  const status = typeof req.query['status'] === 'string' ? req.query['status'] : '';
  const q = typeof req.query['q'] === 'string' ? req.query['q'].trim().toLowerCase() : '';
  let filtered = recalls;
  if (status) {
    filtered = filtered.filter((r) => r.status === status);
  }
  if (q) {
    filtered = filtered.filter(
      (r) =>
        r.patientFirstName.toLowerCase().includes(q) ||
        r.patientLastName.toLowerCase().includes(q) ||
        r.patientNumber.toLowerCase().includes(q) ||
        r.recallType.toLowerCase().includes(q),
    );
  }
  res.json({ data: filtered, count: filtered.length });
});

apiRouter.post('/v1/organizations/:orgId/clinics/:clinicId/recalls', (req: Request, res: Response): void => {
  const body = req.body as {
    patientId: string;
    recallType?: string;
    dueOn?: string;
    intervalMonths?: number;
    note?: string;
  };
  const patient = patients.find((p) => p.id === body.patientId);
  const newRecall: PatientRecall = {
    id: `rec_${Date.now()}`,
    patientId: body.patientId,
    patientNumber: patient?.patientNumber ?? 'D-2026-NEW',
    patientFirstName: patient?.firstName ?? 'Patient',
    patientLastName: patient?.lastName ?? '',
    patientPhone: patient?.phone ?? null,
    recallType: body.recallType ?? 'Contrôle périodique',
    dueOn: body.dueOn ?? todayYMD,
    previousCompletedOn: null,
    intervalMonths: body.intervalMonths ?? 6,
    status: 'DUE',
    preferredContactMethod: 'SMS',
    lastContactedAt: null,
    note: body.note ?? null,
    contactAttempts: 0,
    lastContactOutcome: null,
  };
  recalls.unshift(newRecall);
  res.json({ data: { id: newRecall.id, status: newRecall.status } });
});

apiRouter.patch('/v1/organizations/:orgId/clinics/:clinicId/recalls/:recallId/status', (req: Request, res: Response): void => {
  const recId = getParam(req, 'recallId');
  const rec = recalls.find((r) => r.id === recId);
  const body = req.body as { status: RecallStatus };
  if (rec) {
    rec.status = body.status;
  }
  res.json({ success: true });
});

apiRouter.post('/v1/organizations/:orgId/clinics/:clinicId/recalls/:recallId/contacts', (req: Request, res: Response): void => {
  const recId = getParam(req, 'recallId');
  const rec = recalls.find((r) => r.id === recId);
  const body = req.body as { outcome?: string };
  if (rec) {
    rec.contactAttempts++;
    rec.lastContactedAt = new Date().toISOString();
    rec.lastContactOutcome = body.outcome ?? 'CONTACTED';
    rec.status = 'CONTACTED';
  }
  res.json({ success: true });
});

// Odontogram
apiRouter.get('/v1/organizations/:orgId/clinics/:clinicId/patients/:patientId/odontogram', (req: Request, res: Response): void => {
  const patientId = getParam(req, 'patientId');
  const record = odontogramStore.get(patientId) ?? {
    status: { version: '2.22', teeth: {}, globals: {} },
    plan: { version: '2.22', teeth: {}, globals: {} },
    planChanges: [],
    updatedAt: new Date().toISOString(),
  };
  res.json({ data: record });
});

apiRouter.put('/v1/organizations/:orgId/clinics/:clinicId/patients/:patientId/odontogram', (req: Request, res: Response): void => {
  const patientId = getParam(req, 'patientId');
  const body = req.body as Partial<OdontogramRecord>;
  const record: OdontogramRecord = {
    status: body.status ?? { version: '2.22', teeth: {}, globals: {} },
    plan: body.plan ?? null,
    planChanges: body.planChanges ?? [],
    updatedAt: new Date().toISOString(),
  };
  odontogramStore.set(patientId, record);

  const revisions = odontogramRevisions.get(patientId) ?? [];
  revisions.unshift({
    versionNo: revisions.length + 1,
    recordedByName: 'Dr. Marven',
    createdAt: new Date().toISOString(),
  });
  odontogramRevisions.set(patientId, revisions);

  res.json({ data: record });
});

apiRouter.get('/v1/organizations/:orgId/clinics/:clinicId/patients/:patientId/odontogram/revisions', (req: Request, res: Response): void => {
  const patientId = getParam(req, 'patientId');
  const revisions = odontogramRevisions.get(patientId) ?? [];
  res.json({ data: revisions });
});

// Clinical Encounters
apiRouter.get('/v1/organizations/:orgId/clinics/:clinicId/clinical-providers', (_req: Request, res: Response): void => {
  const clinicalProviders = providers.map((p) => ({
    id: p.id,
    displayName: p.displayName,
    role: p.role,
  }));
  res.json({ data: clinicalProviders });
});

apiRouter.get('/v1/organizations/:orgId/clinics/:clinicId/patients/:patientId/encounters', (req: Request, res: Response): void => {
  const patientId = getParam(req, 'patientId');
  const encounters = encountersStore.get(patientId) ?? [];
  res.json({ data: encounters, count: encounters.length });
});

apiRouter.get('/v1/organizations/:orgId/clinics/:clinicId/patients/:patientId/encounters/:encounterId', (req: Request, res: Response): void => {
  const patientId = getParam(req, 'patientId');
  const encounters = encountersStore.get(patientId) ?? [];
  const encId = getParam(req, 'encounterId');
  const encounter = encounters.find((e) => e.id === encId);
  if (!encounter) {
    res.status(404).json({ error: { message: 'Consultation introuvable' } });
    return;
  }
  res.json({ data: encounter });
});

apiRouter.post('/v1/organizations/:orgId/clinics/:clinicId/patients/:patientId/encounters', (req: Request, res: Response): void => {
  const patientId = getParam(req, 'patientId');
  const body = req.body as { encounterType?: string; responsibleProviderId?: string; chiefComplaint?: string };
  const newEncounter: EncounterItem = {
    id: `enc_${Date.now()}`,
    appointmentId: null,
    status: 'IN_PROGRESS',
    encounterType: body.encounterType ?? 'CONSULTATION',
    responsibleProviderId: body.responsibleProviderId ?? 'prov_1',
    responsibleDentistName: 'Dr. Marven',
    startedAt: new Date().toISOString(),
    endedAt: null,
    chiefComplaint: body.chiefComplaint ?? '',
    createdByName: 'Dr. Marven',
    signedAt: null,
    signedById: null,
    signedByName: null,
    noteCount: 0,
    procedureCount: 0,
    mediaCount: 0,
    notes: [],
    findings: [],
    procedures: [],
    media: [],
    followUps: [],
    participants: [{ userId: 'usr_demo', name: 'Dr. Marven', role: 'DENTIST', createdAt: new Date().toISOString() }],
  };
  const list = encountersStore.get(patientId) ?? [];
  list.unshift(newEncounter);
  encountersStore.set(patientId, list);
  res.json({ data: newEncounter });
});

apiRouter.post('/v1/organizations/:orgId/clinics/:clinicId/patients/:patientId/encounters/:encounterId/notes', (req: Request, res: Response): void => {
  const patientId = getParam(req, 'patientId');
  const encounters = encountersStore.get(patientId) ?? [];
  const encId = getParam(req, 'encounterId');
  const encounter = encounters.find((e) => e.id === encId);
  const body = req.body as { noteType?: string; content?: string };
  const newNote = {
    id: `note_${Date.now()}`,
    noteType: body.noteType ?? 'PROGRESS',
    content: body.content ?? '',
    createdByName: 'Dr. Marven',
    signedById: null,
    signedByName: null,
    signedAt: null,
    createdAt: new Date().toISOString(),
    amendments: [],
  };
  if (encounter) {
    encounter.notes.push(newNote);
    encounter.noteCount = encounter.notes.length;
  }
  res.json({ data: newNote });
});

apiRouter.post('/v1/organizations/:orgId/clinics/:clinicId/patients/:patientId/encounters/:encounterId/sign', (req: Request, res: Response): void => {
  const patientId = getParam(req, 'patientId');
  const encounters = encountersStore.get(patientId) ?? [];
  const encId = getParam(req, 'encounterId');
  const encounter = encounters.find((e) => e.id === encId);
  const timestamp = new Date().toISOString();
  if (encounter) {
    encounter.status = 'COMPLETED';
    encounter.signedById = 'usr_demo';
    encounter.signedByName = 'Dr. Marven';
    encounter.signedAt = timestamp;
    encounter.endedAt = timestamp;
  }
  res.json({
    data: {
      id: encounter?.id ?? '',
      status: 'COMPLETED',
      signedById: 'usr_demo',
      signedAt: timestamp,
      endedAt: timestamp,
      version: 1,
    },
  });
});

// Reports Overview
apiRouter.get('/v1/organizations/:orgId/clinics/:clinicId/reports/overview', (req: Request, res: Response): void => {
  const from = typeof req.query['from'] === 'string' ? req.query['from'] : `${todayYMD.slice(0, 7)}-01`;
  const to = typeof req.query['to'] === 'string' ? req.query['to'] : todayYMD;

  res.json({
    data: {
      period: { from, to },
      appointments: {
        total: appointments.length,
        byStatus: {
          CONFIRMED: appointments.filter((a) => a.status === 'CONFIRMED').length,
          SCHEDULED: appointments.filter((a) => a.status === 'SCHEDULED').length,
          IN_PROGRESS: appointments.filter((a) => a.status === 'IN_PROGRESS').length,
          COMPLETED: 12,
          CANCELLED: 1,
          NO_SHOW: 0,
        },
        completed: 12,
        cancelled: 1,
        noShow: 0,
        completionRate: 92.3,
      },
      patients: {
        total: patients.length,
        added: patients.length,
      },
      recalls: {
        overdue: recalls.filter((r) => r.status === 'DUE').length,
        due_in_period: recalls.length,
        completed: 4,
      },
      trend: [
        { day: '2026-10-15', total: 6, completed: 5, cancelled: 1, no_show: 0 },
        { day: '2026-10-16', total: 8, completed: 8, cancelled: 0, no_show: 0 },
        { day: '2026-10-17', total: 7, completed: 7, cancelled: 0, no_show: 0 },
        { day: '2026-10-18', total: 9, completed: 8, cancelled: 1, no_show: 0 },
        { day: '2026-10-19', total: 5, completed: 5, cancelled: 0, no_show: 0 },
        { day: '2026-10-20', total: 8, completed: 7, cancelled: 1, no_show: 0 },
        { day: todayYMD, total: appointments.length, completed: 2, cancelled: 0, no_show: 0 },
      ],
    },
  });
});

// Team
apiRouter.get('/v1/organizations/:orgId/clinics/:clinicId/team', (_req: Request, res: Response): void => {
  res.json({
    data: [
      {
        userId: 'usr_demo',
        name: 'Dr. Marven',
        email: 'docteur@dentaleus.fr',
        organizationRole: 'ORGANIZATION_ADMIN',
        clinicRole: 'CLINIC_ADMIN',
        effectiveRole: 'CLINIC_ADMIN',
      },
      {
        userId: 'usr_2',
        name: 'Dr. Sarah Alami',
        email: 'sarah.alami@dentaleus.fr',
        role: 'DENTIST',
        organizationRole: 'DENTIST',
        clinicRole: 'ORTHODONTIST',
        effectiveRole: 'ORTHODONTIST',
      },
      {
        userId: 'usr_3',
        name: 'Nathalie Vasseur',
        email: 'nathalie.vasseur@dentaleus.fr',
        role: 'HYGIENIST',
        organizationRole: 'HYGIENIST',
        clinicRole: 'HYGIENIST',
        effectiveRole: 'HYGIENIST',
      },
    ],
    canManage: true,
  });
});

apiRouter.get('/v1/organizations/:orgId/team', (_req: Request, res: Response): void => {
  res.json({
    data: [
      {
        userId: 'usr_demo',
        name: 'Dr. Marven',
        email: 'docteur@dentaleus.fr',
        role: 'ORGANIZATION_ADMIN',
        joinedAt: '2025-01-01T00:00:00.000Z',
        isCurrentUser: true,
        clinics: [{ id: 'clinic_1', name: 'Cabinet Dentaire Central', role: 'CLINIC_ADMIN' }],
      },
      {
        userId: 'usr_2',
        name: 'Dr. Sarah Alami',
        email: 'sarah.alami@dentaleus.fr',
        role: 'DENTIST',
        joinedAt: '2025-06-01T00:00:00.000Z',
        isCurrentUser: false,
        clinics: [{ id: 'clinic_1', name: 'Cabinet Dentaire Central', role: 'ORTHODONTIST' }],
      },
      {
        userId: 'usr_3',
        name: 'Nathalie Vasseur',
        email: 'nathalie.vasseur@dentaleus.fr',
        role: 'HYGIENIST',
        joinedAt: '2025-09-01T00:00:00.000Z',
        isCurrentUser: false,
        clinics: [{ id: 'clinic_1', name: 'Cabinet Dentaire Central', role: 'HYGIENIST' }],
      },
    ],
    canManage: true,
    canManageOwners: true,
  });
});

apiRouter.get('/v1/organizations/:orgId/invitations', (_req: Request, res: Response): void => {
  res.json({ data: [] });
});

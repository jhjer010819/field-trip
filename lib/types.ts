export type DocKind = "application" | "report";

export type StepId = "kind" | "student" | "trip" | "content" | "preview";

export interface ScheduleRow {
  id: string;
  time: string;
  place: string;
  activity: string;
}

export interface PhotoItem {
  id: string;
  caption: string;
  dataUrl: string;
}

export interface StudentInfo {
  school: string;
  grade: string;
  className: string;
  number: string;
  name: string;
  teacher: string;
}

export interface TripInfo {
  topic: string;
  place: string;
  address: string;
  startDate: string;
  endDate: string;
  purpose: string;
  transport: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
}

export interface ApplicationInfo {
  goals: string;
  materials: string;
  guardianNote: string;
}

export interface ReportInfo {
  body: string;
  learned: string;
  feelings: string;
  next: string;
  photos: PhotoItem[];
}

export interface Draft {
  id: string;
  kind: DocKind;
  createdAt: string;
  updatedAt: string;
  exampleNotice: boolean;
  student: StudentInfo;
  trip: TripInfo;
  schedule: ScheduleRow[];
  application: ApplicationInfo;
  report: ReportInfo;
}

export interface Issue {
  message: string;
  level: "required" | "recommended";
}

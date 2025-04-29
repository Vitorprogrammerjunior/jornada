
export type UserRole = 'coordinator' | 'leader' | 'student' | 'inactive' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  approvedBy?: string;
  groupId?: string;
  courseId?: string;
  periodSemester?: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  members: User[];
  createdAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  course_id: string;
  period_semester: number;
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  order: number;
}

export interface Submission {
  id: string;
  groupId: string;
  phaseId: string;
  fileUrl: string;
  submittedAt: Date;
  submittedBy: string;
  grade?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: Date;
}

export interface JoinRequest {
  id: string;
  groupId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface LeaderRequest {
  id: number;
  userId: number;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  // …outros campos, se precisar
}

export interface Course {
  id: string;
  name: string;
}

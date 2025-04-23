
import { User, Group, Phase, Submission, JoinRequest, LeaderRequest } from '../types';

// Site Configuration Data
export const mockSiteConfig = {
  siteName: "Jornada Fluxo Digital",
  description: "Plataforma para gerenciamento de jornadas acadêmicas",
  keywords: "jornada, fluxo digital, universidade, pesquisa",
  themeColor: "#00a651",
  logoUrl: "https://example.com/logo.png",
  faviconUrl: "https://example.com/favicon.ico",
  enableDarkMode: false,
  welcomeMessage: "Bem-vindo à Jornada Fluxo Digital!",
  footerText: "© 2025 Jornada Fluxo Digital - Todos os direitos reservados",
  contactEmail: "contato@jornadafluxodigital.com",
};

// Announcement Data
export const mockAnnouncements = [
  {
    id: "1",
    title: "Início das Inscrições para Jornada 2025",
    content: "As inscrições para a Jornada Fluxo Digital 2025 estão abertas! Acesse sua área do aluno para participar.",
    isActive: true,
    createdAt: new Date("2025-03-15"),
    createdBy: "1",
  },
  {
    id: "2",
    title: "Nova Fase de Submissões",
    content: "A fase de submissão de resumos expandidos começa no próximo dia 10. Preparem seus trabalhos!",
    isActive: false,
    createdAt: new Date("2025-03-20"),
    createdBy: "1",
  }
];

// Sample data for demo purposes
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Coordenador Silva',
    email: 'coordenador@example.com',
    role: 'coordinator',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'João Líder',
    email: 'joao@example.com',
    role: 'leader',
    createdAt: new Date('2023-01-15'),
    approvedBy: '1',
    groupId: '1',
  },
  {
    id: '3',
    name: 'Maria Estudante',
    email: 'maria@example.com',
    role: 'student',
    createdAt: new Date('2023-01-20'),
    approvedBy: '1',
    groupId: '1',
  },
  {
    id: '4',
    name: 'Pedro Aluno',
    email: 'pedro@example.com',
    role: 'student',
    createdAt: new Date('2023-01-25'),
    approvedBy: '1',
    groupId: '1',
  },
  {
    id: '5',
    name: 'Ana Líder',
    email: 'ana@example.com',
    role: 'leader',
    createdAt: new Date('2023-01-18'),
    approvedBy: '1',
    groupId: '2',
  },
  {
    id: '6',
    name: 'Carlos Estudante',
    email: 'carlos@example.com',
    role: 'student',
    createdAt: new Date('2023-01-22'),
    approvedBy: '1',
    groupId: '2',
  },
  {
    id: '7',
    name: 'Lucas Pendente',
    email: 'lucas@example.com',
    role: 'pending',
    createdAt: new Date('2023-02-01'),
  },
  {
    id: '8',
    name: 'Paula Pendente',
    email: 'paula@example.com',
    role: 'pending',
    createdAt: new Date('2023-02-05'),
  },
];

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Grupo Inovação',
    description: 'Grupo focado em inovação tecnológica',
    leaderId: '2',
    members: mockUsers.filter(user => user.groupId === '1'),
    createdAt: new Date('2023-01-15'),
    approvedAt: new Date('2023-01-16'),
    approvedBy: '1',
  },
  {
    id: '2',
    name: 'Grupo Futuro',
    description: 'Pesquisa sobre tecnologias do futuro',
    leaderId: '5',
    members: mockUsers.filter(user => user.groupId === '2'),
    createdAt: new Date('2023-01-18'),
    approvedAt: new Date('2023-01-19'),
    approvedBy: '1',
  },
];

export const mockPhases: Phase[] = [
  {
    id: '1',
    name: 'Formação dos Grupos',
    description: 'Período para formação e aprovação dos grupos',
    startDate: new Date('2023-02-01'),
    endDate: new Date('2023-02-15'),
    isActive: false,
    order: 1,
  },
  {
    id: '2',
    name: 'Submissão do Resumo',
    description: 'Envio do resumo do trabalho',
    startDate: new Date('2023-02-16'),
    endDate: new Date('2023-03-01'),
    isActive: true,
    order: 2,
  },
  {
    id: '3',
    name: 'Resumo Expandido + Artigo',
    description: 'Envio do artigo completo',
    startDate: new Date('2023-03-02'),
    endDate: new Date('2023-03-31'),
    isActive: false,
    order: 3,
  },
  {
    id: '4',
    name: 'Submissão dos Slides',
    description: 'Envio dos slides para apresentação',
    startDate: new Date('2023-04-01'),
    endDate: new Date('2023-04-15'),
    isActive: false,
    order: 4,
  },
  {
    id: '5',
    name: 'Apresentação Final',
    description: 'Apresentação presencial dos trabalhos',
    startDate: new Date('2023-04-20'),
    endDate: new Date('2023-04-25'),
    isActive: false,
    order: 5,
  },
  {
    id: '6',
    name: 'Encerramento',
    description: 'Encerramento da jornada e divulgação dos resultados',
    startDate: new Date('2023-04-30'),
    endDate: new Date('2023-04-30'),
    isActive: false,
    order: 6,
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    groupId: '1',
    phaseId: '2',
    fileUrl: '/uploads/grupo1-resumo.pdf',
    submittedAt: new Date('2023-02-20'),
    submittedBy: '2',
    grade: 85,
    feedback: 'Bom trabalho, mas pode melhorar na metodologia.',
    gradedBy: '1',
    gradedAt: new Date('2023-02-22'),
  },
  {
    id: '2',
    groupId: '2',
    phaseId: '2',
    fileUrl: '/uploads/grupo2-resumo.pdf',
    submittedAt: new Date('2023-02-18'),
    submittedBy: '5',
    grade: 92,
    feedback: 'Excelente trabalho, bem estruturado.',
    gradedBy: '1',
    gradedAt: new Date('2023-02-21'),
  },
];

export const mockJoinRequests: JoinRequest[] = [
  {
    id: '1',
    groupId: '1',
    userId: '7',
    status: 'pending',
    requestedAt: new Date('2023-02-08'),
  },
  {
    id: '2',
    groupId: '2',
    userId: '8',
    status: 'pending',
    requestedAt: new Date('2023-02-10'),
  },
];



// Helper function to get user by email (for authentication)
export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email);
};

// Helper function to get user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// Helper function to get group by ID
export const getGroupById = (id: string): Group | undefined => {
  return mockGroups.find(group => group.id === id);
};

// Helper function to get current active phase
export const getCurrentPhase = (): Phase | undefined => {
  return mockPhases.find(phase => phase.isActive);
};

// Helper function to get submissions by group ID
export const getSubmissionsByGroupId = (groupId: string): Submission[] => {
  return mockSubmissions.filter(submission => submission.groupId === groupId);
};

// Helper function to get join requests by group ID
export const getJoinRequestsByGroupId = (groupId: string): JoinRequest[] => {
  return mockJoinRequests.filter(request => request.groupId === groupId);
};

// Helper function to get leader request by user ID
export const getLeaderRequestByUserId = (userId: string): LeaderRequest | undefined => {
  return mockLeaderRequests.find(request => request.userId === userId);
};

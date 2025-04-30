
import { toast } from "sonner";

const API_URL = "http://localhost:5000/api";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data.message || response.statusText;
    toast.error(error);
    throw new Error(error);
  }
  
  return data;
};

// Group Request services
// Group Request services
// em src/services/api.ts

// Group Request services
export const groupRequestService = {
  // Estudante solicita entrada em um grupo
  requestJoinGroup: async (groupId: string) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/join`, {
      method: "POST",
      headers: { "x-auth-token": localStorage.getItem("token") || "" },
    });
    return handleResponse(response);
  },

  // Líder lista solicitações de entrada pendentes
  getJoinRequestsByGroup: async (groupId: string) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/join-requests`, {
      headers: { "x-auth-token": localStorage.getItem("token") || "" },
    });
    return handleResponse(response);
  },

  // Líder aprova ou rejeita solicitação
  respondJoinRequest: async (
    groupId: string,
    requestId: string,
    status: 'approved' | 'rejected'
  ) => {
    const response = await fetch(
      `${API_URL}/groups/${groupId}/join-requests/${requestId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ status }),
      }
    );
    return handleResponse(response);
  },
};



// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },
  
  register: async (userData: any) => {
    // Agora o userData deve conter: name, email, password, courseId, periodSemester e role
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },
  
  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });
    return handleResponse(response);
  },
  
  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/user`, {
      headers: {
        "x-auth-token": localStorage.getItem("token") || ""
      },
    });
    return handleResponse(response);
  },
};

// User services
export const userService = {
  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response);
  },
  
  getPendingUsers: async () => {
    const response = await fetch(`${API_URL}/users/pending`, {
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response);
  },
  
  approveUser: async (userId: string) => {
    const response = await fetch(`${API_URL}/users/approve/${userId}`, {
      method: "PUT",
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response);
  },
  
  rejectUser: async (userId: string) => {
    const response = await fetch(`${API_URL}/users/reject/${userId}`, {
      method: "PUT",
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response);
  },
  
  requestLeader: async () => {
    const response = await fetch(`${API_URL}/users/request-leader`, {
      method: "POST",
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response);
  },

 
};

// Leader-request services
export const leaderRequestService = {
  getAllLeaderRequests: async () => {
    const response = await fetch(`${API_URL}/leader-requests`, {
      headers: { "x-auth-token": localStorage.getItem("token") || "" }
    });
    return handleResponse(response); // { requests: LeaderRequest[] }
  },
  approveLeaderRequest: async (requestId: string) => {
    const response = await fetch(`${API_URL}/leader-requests/${requestId}/approve`, {
      method: "PUT",
      headers: { "x-auth-token": localStorage.getItem("token") || "" }
    });
    return handleResponse(response);
  },
  rejectLeaderRequest: async (requestId: string) => {
    const response = await fetch(`${API_URL}/leader-requests/${requestId}/reject`, {
      method: "PUT",
      headers: { "x-auth-token": localStorage.getItem("token") || "" }
    });
    return handleResponse(response);
  },
};


// Group services
export const groupService = {
  getAllGroups: async () => {
    const response = await fetch(`${API_URL}/groups`, {
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response);
  },
  
  getGroupById: async (groupId: string) => {
    const response = await fetch(`${API_URL}/groups/${groupId}`, {
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response);
  },

    // student leaves group
    leaveGroup: async (groupId: string) => {
      const response = await fetch(`${API_URL}/groups/${groupId}/leave`, {
        method: "DELETE",
        headers: {
          "x-auth-token": localStorage.getItem("token") || "",
        },
      });
      return handleResponse(response); // { message: string }
    },
  
  createGroup: async (groupData: any) => {
    const response = await fetch(`${API_URL}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token") || "",
      },
      body: JSON.stringify(groupData),
    });
    return handleResponse(response);
  },
  
  // student solicita entrar
  requestJoinGroup: async (groupId: string) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/join`, {
      method: "POST",
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response); // { request: JoinRequest }
  },

  // líder pega solicitações pendentes
  getJoinRequests: async (groupId: string) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/join-requests`, {
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response); // { requests: JoinRequest[] }
  },

  // líder aprova ou rejeita
  respondToJoinRequest: async (
    groupId: string,
    requestId: number,
    status: 'approved' | 'rejected'
  ) => {
    const response = await fetch(
      `${API_URL}/groups/${groupId}/join-requests/${requestId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ status }),
      }
    );
    return handleResponse(response);
  },
};
// Schedule services
export const scheduleService = {
  getSchedule: async () => {
    const response = await fetch(`${API_URL}/schedule`, {
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response);
  },
  
  updatePhase: async (phaseId: string, phaseData: any) => {
    const response = await fetch(`${API_URL}/schedule/${phaseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token") || "",
      },
      body: JSON.stringify(phaseData),
    });
    return handleResponse(response);
  },
};

// Submission services
export const submissionService = {
  getSubmissions: async () => {
    const response = await fetch(`${API_URL}/submissions`, {
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response);
  },
  
  submitFile: async (formData: FormData) => {
    const response = await fetch(`${API_URL}/submissions`, {
      method: "POST",
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
      body: formData,
    });
    return handleResponse(response);
  },
  
  gradeSubmission: async (submissionId: string, gradeData: any) => {
    const response = await fetch(`${API_URL}/submissions/${submissionId}/grade`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token") || "",
      },
      body: JSON.stringify(gradeData),
    });
    return handleResponse(response);
  },
};

// Results services
export const resultService = {
  getResults: async () => {
    const response = await fetch(`${API_URL}/results`, {
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response);
  },
  
  getRankings: async () => {
    const response = await fetch(`${API_URL}/results/rankings`, {
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response);
  },
  
  getCourseRankings: async () => {
    const response = await fetch(`${API_URL}/results/courses`, {
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response);
  },
};

// Settings services
export const settingsService = {
  getSettings: async () => {
    const response = await fetch(`${API_URL}/settings`, {
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response);
  },
  
  updateGeneralSettings: async (settingsData: any) => {
    const response = await fetch(`${API_URL}/settings/general`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token") || "",
      },
      body: JSON.stringify(settingsData),
    });
    return handleResponse(response);
  },
  
  updateDeliveriesSettings: async (settingsData: any) => {
    const response = await fetch(`${API_URL}/settings/deliveries`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token") || "",
      },
      body: JSON.stringify(settingsData),
    });
    return handleResponse(response);
  },
  
  updateJourneySettings: async (settingsData: any) => {
    const response = await fetch(`${API_URL}/settings/journey`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token") || "",
      },
      body: JSON.stringify(settingsData),
    });
    return handleResponse(response);
  },

  

  
};

// … lá em cima, após Settings services

// Super-Admin services
export const superAdminService = {
  // Usuários
  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/super-admin/users`, {
      headers: { "x-auth-token": localStorage.getItem("token") || "" }
    });
    return handleResponse(response);
  },
  getUserById: async (userId: string) => {
    const response = await fetch(`${API_URL}/super-admin/users/${userId}`, {
      headers: { "x-auth-token": localStorage.getItem("token") || "" }
    });
    return handleResponse(response);
  },
  updateUser: async (userId: string, data: any) => {
    const response = await fetch(`${API_URL}/super-admin/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token") || ""
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  deleteUser: async (userId: string) => {
    const response = await fetch(`${API_URL}/super-admin/users/${userId}`, {
      method: "DELETE",
      headers: { "x-auth-token": localStorage.getItem("token") || "" }
    });
    return handleResponse(response);
  },

  // Fases
  getAllPhases: async () => {
    const response = await fetch(`${API_URL}/super-admin/phases`, {
      headers: { "x-auth-token": localStorage.getItem("token") || "" }
    });
    return handleResponse(response);
  },
  createPhase: async (phaseData: any) => {
    const response = await fetch(`${API_URL}/super-admin/phases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token") || ""
      },
      body: JSON.stringify(phaseData)
    });
    return handleResponse(response);
  },
  updatePhase: async (phaseId: string, phaseData: any) => {
    const response = await fetch(`${API_URL}/super-admin/phases/${phaseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token") || ""
      },
      body: JSON.stringify(phaseData)
    });
    return handleResponse(response);
  },
  startPhase: async (phaseId: string) => {
    const response = await fetch(`${API_URL}/super-admin/phases/${phaseId}/start`, {
      method: "PUT",
      headers: { "x-auth-token": localStorage.getItem("token") || "" }
    });
    return handleResponse(response);
  },
  finishPhase: async (phaseId: string) => {
    const response = await fetch(`${API_URL}/super-admin/phases/${phaseId}/finish`, {
      method: "PUT",
      headers: { "x-auth-token": localStorage.getItem("token") || "" }
    });
    return handleResponse(response);
  },
  deletePhase: async (phaseId: string) => {
    const response = await fetch(`${API_URL}/super-admin/phases/${phaseId}`, {
      method: "DELETE",
      headers: { "x-auth-token": localStorage.getItem("token") || "" }
    });
    return handleResponse(response);
  }

  
};




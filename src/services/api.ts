
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
      method: "PUT",
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
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
  
  updateGroup: async (groupId: string, groupData: any) => {
    const response = await fetch(`${API_URL}/groups/${groupId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token") || "",
      },
      body: JSON.stringify(groupData),
    });
    return handleResponse(response);
  },
  
  requestJoinGroup: async (groupId: string) => {
    const response = await fetch(`${API_URL}/groups/${groupId}/join`, {
      method: "POST",
      headers: {
        "x-auth-token": localStorage.getItem("token") || "",
      },
    });
    return handleResponse(response);
  },
  
  respondToJoinRequest: async (groupId: string, userId: string, status: 'approved' | 'rejected') => {
    const response = await fetch(`${API_URL}/groups/${groupId}/members/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token") || "",
      },
      body: JSON.stringify({ status }),
    });
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

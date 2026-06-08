import {
  demoJobs,
  demoUsers,
  demoApplications,
  demoNotifications,
  demoMessages,
  type DemoApplication,
  type DemoNotification,
  type DemoMessage,
  type DemoUser,
} from "@/data/demo";
import type { JobWithDistance } from "@/types";
import { getDistanceMeters } from "@/lib/geo";

interface Store {
  jobs: JobWithDistance[];
  users: DemoUser[];
  applications: DemoApplication[];
  notifications: DemoNotification[];
  messages: DemoMessage[];
}

const globalStore = globalThis as unknown as { __workGoStore?: Store };

function getStore(): Store {
  if (!globalStore.__workGoStore) {
    globalStore.__workGoStore = {
      jobs: structuredClone(demoJobs),
      users: structuredClone(demoUsers),
      applications: structuredClone(demoApplications),
      notifications: structuredClone(demoNotifications),
      messages: structuredClone(demoMessages),
    };
  }
  return globalStore.__workGoStore;
}

export function getJobs(filters?: {
  lat?: number;
  lng?: number;
  radius?: number;
  workType?: string;
  search?: string;
}): JobWithDistance[] {
  const { jobs } = getStore();
  const lat = filters?.lat ?? 4.711;
  const lng = filters?.lng ?? -74.0721;
  const radius = filters?.radius ?? 50000;

  return jobs
    .filter((j) => j.status === "active")
    .filter((j) => {
      if (filters?.workType && filters.workType !== "all" && j.workType !== filters.workType)
        return false;
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        return (
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          (j.locationLabel?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    })
    .map((job) => ({
      ...job,
      distance:
        job.lat && job.lng
          ? getDistanceMeters(lat, lng, job.lat, job.lng)
          : undefined,
      employer: {
        profile: getUser(job.employerId)?.profile,
      },
    }))
    .filter((job) => {
      if (job.workType === "remote") return true;
      if (job.distance === undefined) return true;
      return job.distance <= radius;
    })
    .sort((a, b) => {
      if (a.workType === "remote" && b.workType !== "remote") return 1;
      if (b.workType === "remote" && a.workType !== "remote") return -1;
      return (a.distance ?? Infinity) - (b.distance ?? Infinity);
    });
}

export function getJob(id: string, lat = 4.711, lng = -74.0721) {
  const job = getStore().jobs.find((j) => j.id === id);
  if (!job) return null;
  const employer = getUser(job.employerId);
  return {
    ...job,
    distance:
      job.lat && job.lng
        ? getDistanceMeters(lat, lng, job.lat, job.lng)
        : undefined,
    employer: employer ? { profile: employer.profile } : undefined,
    applications: getStore().applications.filter((a) => a.jobId === id),
  };
}

export function createJob(data: Omit<JobWithDistance, "id" | "createdAt">) {
  const job: JobWithDistance = {
    ...data,
    id: `job-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "active",
  };
  getStore().jobs.unshift(job);
  return job;
}

export function getUser(id: string) {
  return getStore().users.find((u) => u.id === id);
}

export function getUserByEmail(email: string) {
  return getStore().users.find((u) => u.email === email);
}

export function updateUserProfile(userId: string, data: Partial<DemoUser["profile"]>) {
  const user = getUser(userId);
  if (!user) return null;
  user.profile = { ...user.profile, ...data };
  return user.profile;
}

export function getApplications(filters: {
  candidateId?: string;
  employerId?: string;
  jobId?: string;
}) {
  const { applications, jobs, users } = getStore();
  return applications
    .filter((a) => {
      if (filters.candidateId && a.candidateId !== filters.candidateId) return false;
      if (filters.jobId && a.jobId !== filters.jobId) return false;
      if (filters.employerId) {
        const job = jobs.find((j) => j.id === a.jobId);
        if (!job || job.employerId !== filters.employerId) return false;
      }
      return true;
    })
    .map((a) => ({
      ...a,
      job: jobs.find((j) => j.id === a.jobId),
      candidate: users.find((u) => u.id === a.candidateId),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getApplication(id: string) {
  const app = getStore().applications.find((a) => a.id === id);
  if (!app) return null;
  const job = getStore().jobs.find((j) => j.id === app.jobId);
  const candidate = getUser(app.candidateId);
  const messages = getStore()
    .messages.filter((m) => m.applicationId === id)
    .map((m) => ({
      ...m,
      sender: getUser(m.senderId),
    }));
  return {
    ...app,
    job: job
      ? { ...job, employer: { profile: getUser(job.employerId)?.profile } }
      : undefined,
    candidate,
    messages,
  };
}

export function createApplication(data: {
  jobId: string;
  candidateId: string;
  coverNote?: string;
}) {
  const store = getStore();
  const exists = store.applications.find(
    (a) => a.jobId === data.jobId && a.candidateId === data.candidateId
  );
  if (exists) return null;

  const app: DemoApplication = {
    id: `app-${Date.now()}`,
    jobId: data.jobId,
    candidateId: data.candidateId,
    status: "pending",
    coverNote: data.coverNote,
    createdAt: new Date().toISOString(),
  };
  store.applications.push(app);

  const job = store.jobs.find((j) => j.id === data.jobId);
  const candidate = getUser(data.candidateId);
  if (job) {
    store.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: job.employerId,
      type: "new_application",
      title: "Nueva postulación",
      body: `${candidate?.profile.fullName ?? "Candidato"} se postuló a "${job.title}"`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }
  return app;
}

export function updateApplicationStatus(id: string, status: DemoApplication["status"]) {
  const app = getStore().applications.find((a) => a.id === id);
  if (!app) return null;
  app.status = status;
  const job = getStore().jobs.find((j) => j.id === app.jobId);
  if (job) {
    getStore().notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: app.candidateId,
      type: "application_update",
      title: "Actualización de postulación",
      body: `Tu postulación a "${job.title}" fue ${status === "accepted" ? "aceptada" : status === "rejected" ? "rechazada" : "actualizada"}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }
  return app;
}

export function getNotifications(userId: string) {
  return getStore()
    .notifications.filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function markNotificationsRead(userId: string, id?: string) {
  const store = getStore();
  if (id) {
    const n = store.notifications.find((x) => x.id === id && x.userId === userId);
    if (n) n.read = true;
  } else {
    store.notifications.filter((n) => n.userId === userId).forEach((n) => (n.read = true));
  }
}

export function unreadNotificationCount(userId: string) {
  return getStore().notifications.filter((n) => n.userId === userId && !n.read).length;
}

export function addMessage(data: {
  applicationId: string;
  senderId: string;
  content: string;
}) {
  const msg: DemoMessage = {
    id: `msg-${Date.now()}`,
    applicationId: data.applicationId,
    senderId: data.senderId,
    content: data.content,
    createdAt: new Date().toISOString(),
  };
  getStore().messages.push(msg);
  return msg;
}

export function getEmployerJobs(employerId: string) {
  return getStore()
    .jobs.filter((j) => j.employerId === employerId)
    .map((j) => ({
      ...j,
      _count: {
        applications: getStore().applications.filter((a) => a.jobId === j.id).length,
      },
    }));
}

export { getStore };

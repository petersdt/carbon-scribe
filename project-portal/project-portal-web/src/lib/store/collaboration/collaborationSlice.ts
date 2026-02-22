import { StateCreator } from 'zustand';
import type {
  CollaborationSlice,
  ProjectMember,
  ProjectInvitation,
  ActivityLog,
  Comment,
  Task,
  SharedResource,
  InviteUserRequest,
  CreateCommentRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  CreateResourceRequest,
  CollaborationLoadingState,
  CollaborationErrorState,
} from './collaboration.types';
import {
  fetchMembersApi,
  fetchInvitationsApi,
  fetchActivitiesApi,
  fetchCommentsApi,
  fetchTasksApi,
  fetchResourcesApi,
  inviteUserApi,
  removeMemberApi,
  createCommentApi,
  createTaskApi,
  updateTaskApi,
  createResourceApi,
} from './collaboration.api';
import { getErrorMessage } from '@/lib/utils/errorMessage';

const initialLoading: CollaborationLoadingState = {
  members: false,
  invitations: false,
  activities: false,
  comments: false,
  tasks: false,
  resources: false,
  invite: false,
  removeMember: false,
  createComment: false,
  createTask: false,
  updateTask: false,
  createResource: false,
};

const initialErrors: CollaborationErrorState = {
  members: null,
  invitations: null,
  activities: null,
  comments: null,
  tasks: null,
  resources: null,
  invite: null,
  removeMember: null,
  createComment: null,
  createTask: null,
  updateTask: null,
  createResource: null,
};

export const createCollaborationSlice: StateCreator<CollaborationSlice> = (set, get) => ({
  currentProjectId: null,
  members: [],
  invitations: [],
  activities: [],
  activitiesPagination: { limit: 20, offset: 0, total: 0 },
  activityTypeFilter: 'All',
  comments: [],
  tasks: [],
  resources: [],
  loading: initialLoading,
  errors: initialErrors,

  fetchMembers: async (projectId: string) => {
    set((s) => ({ loading: { ...s.loading, members: true }, errors: { ...s.errors, members: null } }));
    try {
      const members = await fetchMembersApi(projectId);
      set({ members, loading: { ...get().loading, members: false } });
    } catch (error) {
      set({
        loading: { ...get().loading, members: false },
        errors: { ...get().errors, members: getErrorMessage(error) },
      });
    }
  },

  fetchInvitations: async (projectId: string) => {
    set((s) => ({ loading: { ...s.loading, invitations: true }, errors: { ...s.errors, invitations: null } }));
    try {
      const invitations = await fetchInvitationsApi(projectId);
      set({ invitations, loading: { ...get().loading, invitations: false } });
    } catch (error) {
      set({
        loading: { ...get().loading, invitations: false },
        errors: { ...get().errors, invitations: getErrorMessage(error) },
      });
    }
  },

  fetchActivities: async (projectId: string, limit = 20, offset = 0) => {
    set((s) => ({ loading: { ...s.loading, activities: true }, errors: { ...s.errors, activities: null } }));
    try {
      const activities = await fetchActivitiesApi(projectId, limit, offset);
      set({
        activities,
        activitiesPagination: { limit, offset, total: activities.length },
        loading: { ...get().loading, activities: false },
      });
    } catch (error) {
      set({
        loading: { ...get().loading, activities: false },
        errors: { ...get().errors, activities: getErrorMessage(error) },
      });
    }
  },

  fetchComments: async (projectId: string) => {
    set((s) => ({ loading: { ...s.loading, comments: true }, errors: { ...s.errors, comments: null } }));
    try {
      const comments = await fetchCommentsApi(projectId);
      set({ comments, loading: { ...get().loading, comments: false } });
    } catch (error) {
      set({
        loading: { ...get().loading, comments: false },
        errors: { ...get().errors, comments: getErrorMessage(error) },
      });
    }
  },

  fetchTasks: async (projectId: string) => {
    set((s) => ({ loading: { ...s.loading, tasks: true }, errors: { ...s.errors, tasks: null } }));
    try {
      const tasks = await fetchTasksApi(projectId);
      set({ tasks, loading: { ...get().loading, tasks: false } });
    } catch (error) {
      set({
        loading: { ...get().loading, tasks: false },
        errors: { ...get().errors, tasks: getErrorMessage(error) },
      });
    }
  },

  fetchResources: async (projectId: string) => {
    set((s) => ({ loading: { ...s.loading, resources: true }, errors: { ...s.errors, resources: null } }));
    try {
      const resources = await fetchResourcesApi(projectId);
      set({ resources, loading: { ...get().loading, resources: false } });
    } catch (error) {
      set({
        loading: { ...get().loading, resources: false },
        errors: { ...get().errors, resources: getErrorMessage(error) },
      });
    }
  },

  inviteUser: async (projectId: string, data: InviteUserRequest): Promise<ProjectInvitation | null> => {
    set((s) => ({ loading: { ...s.loading, invite: true }, errors: { ...s.errors, invite: null } }));
    try {
      const invite = await inviteUserApi(projectId, data);
      set((s) => ({
        invitations: [invite, ...s.invitations],
        loading: { ...s.loading, invite: false },
      }));
      return invite;
    } catch (error) {
      set({
        loading: { ...get().loading, invite: false },
        errors: { ...get().errors, invite: getErrorMessage(error) },
      });
      return null;
    }
  },

  removeMember: async (projectId: string, userId: string): Promise<boolean> => {
    set((s) => ({ loading: { ...s.loading, removeMember: true }, errors: { ...s.errors, removeMember: null } }));
    try {
      await removeMemberApi(projectId, userId);
      set((s) => ({
        members: s.members.filter((m) => m.user_id !== userId),
        loading: { ...s.loading, removeMember: false },
      }));
      return true;
    } catch (error) {
      set({
        loading: { ...get().loading, removeMember: false },
        errors: { ...get().errors, removeMember: getErrorMessage(error) },
      });
      return false;
    }
  },

  createComment: async (data: CreateCommentRequest): Promise<Comment | null> => {
    set((s) => ({ loading: { ...s.loading, createComment: true }, errors: { ...s.errors, createComment: null } }));
    try {
      const comment = await createCommentApi(data);
      set((s) => ({
        comments: [...s.comments, comment],
        loading: { ...s.loading, createComment: false },
      }));
      return comment;
    } catch (error) {
      set({
        loading: { ...get().loading, createComment: false },
        errors: { ...get().errors, createComment: getErrorMessage(error) },
      });
      return null;
    }
  },

  createTask: async (data: CreateTaskRequest): Promise<Task | null> => {
    set((s) => ({ loading: { ...s.loading, createTask: true }, errors: { ...s.errors, createTask: null } }));
    try {
      const task = await createTaskApi(data);
      set((s) => ({
        tasks: [task, ...s.tasks],
        loading: { ...s.loading, createTask: false },
      }));
      return task;
    } catch (error) {
      set({
        loading: { ...get().loading, createTask: false },
        errors: { ...get().errors, createTask: getErrorMessage(error) },
      });
      return null;
    }
  },

  updateTask: async (taskId: string, data: UpdateTaskRequest): Promise<Task | null> => {
    set((s) => ({ loading: { ...s.loading, updateTask: true }, errors: { ...s.errors, updateTask: null } }));
    try {
      const updated = await updateTaskApi(taskId, data);
      set((s) => ({
        tasks: s.tasks.map((t) => (t.id === taskId ? updated : t)),
        loading: { ...s.loading, updateTask: false },
      }));
      return updated;
    } catch (error) {
      set({
        loading: { ...get().loading, updateTask: false },
        errors: { ...get().errors, updateTask: getErrorMessage(error) },
      });
      return null;
    }
  },

  createResource: async (data: CreateResourceRequest): Promise<SharedResource | null> => {
    set((s) => ({ loading: { ...s.loading, createResource: true }, errors: { ...s.errors, createResource: null } }));
    try {
      const resource = await createResourceApi(data);
      set((s) => ({
        resources: [...s.resources, resource],
        loading: { ...s.loading, createResource: false },
      }));
      return resource;
    } catch (error) {
      set({
        loading: { ...get().loading, createResource: false },
        errors: { ...get().errors, createResource: getErrorMessage(error) },
      });
      return null;
    }
  },

  setCurrentProjectId: (projectId) => set({ currentProjectId: projectId }),
  setActivityTypeFilter: (type) => set({ activityTypeFilter: type }),
  clearCollaborationErrors: () => set({ errors: initialErrors }),
  resetCollaborationState: () =>
    set({
      currentProjectId: null,
      members: [],
      invitations: [],
      activities: [],
      activitiesPagination: { limit: 20, offset: 0, total: 0 },
      activityTypeFilter: 'All',
      comments: [],
      tasks: [],
      resources: [],
      loading: initialLoading,
      errors: initialErrors,
    }),
});

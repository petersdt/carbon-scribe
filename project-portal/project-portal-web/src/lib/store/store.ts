import { create } from 'zustand';
import { createProjectsSlice } from './projects/projectsSlice';
import { createCollaborationSlice } from './collaboration/collaborationSlice';
import type { ProjectsSlice } from './projects/projects.types';
import type { CollaborationSlice } from './collaboration/collaboration.types';

export type StoreState = ProjectsSlice & CollaborationSlice;

export const useStore = create<StoreState>()((...args) => ({
  ...createProjectsSlice(...args),
  ...createCollaborationSlice(...args),
}));

import { atom } from 'recoil';
import type { Event, CustomModule, EventDraft } from '../types';

// Events State
export const eventsState = atom<Event[]>({
  key: 'eventsState',
  default: [],
});

// Draft Events State (events that are being created but not yet live)
export const draftEventsState = atom<EventDraft[]>({
  key: 'draftEventsState',
  default: [],
});

// Custom Modules State
export const customModulesState = atom<CustomModule[]>({
  key: 'customModulesState',
  default: [],
});

// Current Event being edited
export const currentEventState = atom<EventDraft | null>({
  key: 'currentEventState',
  default: null,
});

// Loading State
export const loadingState = atom<boolean>({
  key: 'loadingState',
  default: false,
});

// Error State
export const errorState = atom<string | null>({
  key: 'errorState',
  default: null,
});

// Auto-save State
export const autoSaveState = atom<{
  lastSaved?: number;
  isSaving: boolean;
}>({
  key: 'autoSaveState',
  default: {
    lastSaved: undefined,
    isSaving: false,
  },
});

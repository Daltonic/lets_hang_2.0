import { useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { database } from '../services/database';
import {
  eventsState,
  draftEventsState,
  customModulesState,
  currentEventState,
  loadingState,
  errorState,
  autoSaveState,
} from '../store/atoms';
import type { Event, CustomModule, EventDraft } from '../types';

export const useDatabase = () => {
  const [events, setEvents] = useRecoilState(eventsState);
  const [draftEvents, setDraftEvents] = useRecoilState(draftEventsState);
  const [customModules, setCustomModules] = useRecoilState(customModulesState);
  const [currentEvent, setCurrentEvent] = useRecoilState(currentEventState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [error, setError] = useRecoilState(errorState);
  const [autoSave, setAutoSave] = useRecoilState(autoSaveState);

  // Initialize database and load data
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await database.initialize();
        await loadAllData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Load all data from localStorage
  const loadAllData = useCallback(async () => {
    try {
      const [eventsData, draftsData, modulesData] = await Promise.all([
        database.getEvents(),
        database.getDraftEvents(),
        database.getCustomModules(),
      ]);
      setEvents(eventsData);
      setDraftEvents(draftsData);
      setCustomModules(modulesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    }
  }, [setEvents, setDraftEvents, setCustomModules, setError]);

  // ==================== Event Operations ====================

  const createEvent = useCallback(async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const newEvent = await database.addEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setEvents, setLoading, setError]);

  const updateEvent = useCallback(async (id: string, updates: Partial<Event>) => {
    setLoading(true);
    try {
      const updatedEvent = await database.updateEvent(id, updates);
      if (updatedEvent) {
        setEvents(prev => prev.map(event => event.id === id ? updatedEvent : event));
      }
      return updatedEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setEvents, setLoading, setError]);

  const deleteEvent = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await database.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.id !== id));
      // Also delete associated modules
      const eventModules = customModules.filter(m => m.eventId === id);
      for (const module of eventModules) {
        await database.deleteCustomModule(module.id);
      }
      setCustomModules(prev => prev.filter(m => m.eventId !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setEvents, setCustomModules, customModules, setLoading, setError]);

  const goLive = useCallback(async (eventId: string) => {
    setLoading(true);
    try {
      const updatedEvent = await database.goLive(eventId);
      if (updatedEvent) {
        setEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event));
      }
      return updatedEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to go live');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setEvents, setLoading, setError]);

  // ==================== Draft Operations ====================

  const saveDraft = useCallback(async (draft: Partial<EventDraft> & { phoneNumber: string }) => {
    setAutoSave(prev => ({ ...prev, isSaving: true }));
    try {
      const savedDraft = await database.saveDraft(draft);
      setDraftEvents(prev => {
        const existingIndex = prev.findIndex(d => d.phoneNumber === draft.phoneNumber);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = savedDraft;
          return updated;
        }
        return [...prev, savedDraft];
      });
      setCurrentEvent(savedDraft);
      setAutoSave({
        lastSaved: Date.now(),
        isSaving: false,
      });
      return savedDraft;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft');
      setAutoSave(prev => ({ ...prev, isSaving: false }));
      throw err;
    }
  }, [setDraftEvents, setCurrentEvent, setAutoSave, setError]);

  const loadDraftByPhone = useCallback(async (phoneNumber: string) => {
    setLoading(true);
    try {
      const draft = await database.getDraftByPhoneNumber(phoneNumber);
      if (draft) {
        setCurrentEvent(draft);
      }
      return draft;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load draft');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setCurrentEvent, setLoading, setError]);

  const deleteDraft = useCallback(async (id: string) => {
    try {
      await database.deleteDraft(id);
      setDraftEvents(prev => prev.filter(draft => draft.id !== id));
      if (currentEvent?.id === id) {
        setCurrentEvent(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete draft');
      throw err;
    }
  }, [setDraftEvents, currentEvent, setCurrentEvent, setError]);

  const publishDraft = useCallback(async (draftId: string) => {
    setLoading(true);
    try {
      const newEvent = await database.publishDraft(draftId);
      if (newEvent) {
        // Add to main events array
        setEvents(prev => [...prev, newEvent]);
        // Keep the draft for resubmission with changes
      }
      return newEvent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish draft');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setEvents, setLoading, setError]);

  // ==================== Custom Module Operations ====================

  const addCustomModule = useCallback(async (moduleData: Omit<CustomModule, 'id' | 'createdAt'>) => {
    try {
      const newModule = await database.addCustomModule(moduleData);
      setCustomModules(prev => [...prev, newModule]);
      return newModule;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add module');
      throw err;
    }
  }, [setCustomModules, setError]);

  const updateCustomModule = useCallback(async (id: string, updates: Partial<CustomModule>) => {
    try {
      const updatedModule = await database.updateCustomModule(id, updates);
      if (updatedModule) {
        setCustomModules(prev => prev.map(module => module.id === id ? updatedModule : module));
      }
      return updatedModule;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update module');
      throw err;
    }
  }, [setCustomModules, setError]);

  const deleteCustomModule = useCallback(async (id: string) => {
    try {
      await database.deleteCustomModule(id);
      setCustomModules(prev => prev.filter(module => module.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete module');
      throw err;
    }
  }, [setCustomModules, setError]);

  const reorderModules = useCallback(async (eventId: string, moduleIds: string[]) => {
    try {
      await database.reorderModules(eventId, moduleIds);
      // Reload modules to get updated order
      const modules = await database.getCustomModules(eventId);
      setCustomModules(prev => {
        const otherModules = prev.filter(m => m.eventId !== eventId);
        return [...otherModules, ...modules];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder modules');
      throw err;
    }
  }, [setCustomModules, setError]);

  const getEventModules = useCallback((eventId: string) => {
    return customModules
      .filter(m => m.eventId === eventId)
      .sort((a, b) => a.order - b.order);
  }, [customModules]);

  // ==================== Utility Operations ====================

  const clearAllData = useCallback(async () => {
    setLoading(true);
    try {
      await database.clearAllData();
      setEvents([]);
      setDraftEvents([]);
      setCustomModules([]);
      setCurrentEvent(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setEvents, setDraftEvents, setCustomModules, setCurrentEvent, setError, setLoading]);

  const exportData = useCallback(async () => {
    try {
      return await database.exportData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
      throw err;
    }
  }, [setError]);

  const importData = useCallback(async (jsonData: string) => {
    setLoading(true);
    try {
      await database.importData(jsonData);
      await loadAllData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadAllData, setLoading, setError]);

  return {
    // State
    events,
    draftEvents,
    customModules,
    currentEvent,
    loading,
    error,
    autoSave,
    
    // Event operations
    createEvent,
    updateEvent,
    deleteEvent,
    goLive,
    
    // Draft operations
    saveDraft,
    loadDraftByPhone,
    deleteDraft,
    publishDraft,
    
    // Module operations
    addCustomModule,
    updateCustomModule,
    deleteCustomModule,
    reorderModules,
    getEventModules,
    
    // Utility operations
    clearAllData,
    exportData,
    importData,
    loadAllData,
    setCurrentEvent,
    setError,
  };
};
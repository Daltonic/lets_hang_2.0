import type { Event, CustomModule, EventDraft } from '../types'

class DatabaseService {
  private readonly EVENTS_KEY = 'letshang_events'
  private readonly DRAFT_EVENTS_KEY = 'letshang_draft_events'
  private readonly CUSTOM_MODULES_KEY = 'letshang_custom_modules'

  // Initialize database
  async initialize(): Promise<void> {
    if (!localStorage.getItem(this.EVENTS_KEY)) {
      localStorage.setItem(this.EVENTS_KEY, JSON.stringify([]))
    }
    if (!localStorage.getItem(this.DRAFT_EVENTS_KEY)) {
      localStorage.setItem(this.DRAFT_EVENTS_KEY, JSON.stringify([]))
    }
    if (!localStorage.getItem(this.CUSTOM_MODULES_KEY)) {
      localStorage.setItem(this.CUSTOM_MODULES_KEY, JSON.stringify([]))
    }
  }

  // ==================== Event Operations ====================

  async getEvents(): Promise<Event[]> {
    const events = localStorage.getItem(this.EVENTS_KEY)
    return events ? JSON.parse(events) : []
  }

  async getEventById(id: string): Promise<Event | null> {
    const events = await this.getEvents()
    return events.find((event) => event.id === id) || null
  }

  async addEvent(
    event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Event> {
    const events = await this.getEvents()
    const newEvent: Event = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    events.push(newEvent)
    localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events))
    return newEvent
  }

  async updateEvent(
    id: string,
    updates: Partial<Event>,
  ): Promise<Event | null> {
    const events = await this.getEvents()
    const eventIndex = events.findIndex((event) => event.id === id)

    if (eventIndex === -1) return null

    const updatedEvent = {
      ...events[eventIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    events[eventIndex] = updatedEvent
    localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events))
    return updatedEvent
  }

  async deleteEvent(id: string): Promise<void> {
    const events = await this.getEvents()
    const filteredEvents = events.filter((event) => event.id !== id)
    localStorage.setItem(this.EVENTS_KEY, JSON.stringify(filteredEvents))
  }

  async goLive(eventId: string): Promise<Event | null> {
    return this.updateEvent(eventId, { isLive: true })
  }

  // ==================== Draft Event Operations ====================

  async getDraftEvents(): Promise<EventDraft[]> {
    const drafts = localStorage.getItem(this.DRAFT_EVENTS_KEY)
    return drafts ? JSON.parse(drafts) : []
  }

  async getDraftByPhoneNumber(phoneNumber: string): Promise<EventDraft | null> {
    const drafts = await this.getDraftEvents()
    return drafts.find((draft) => draft.phoneNumber === phoneNumber) || null
  }

  async getDraftById(id: string): Promise<EventDraft | null> {
    const drafts = await this.getDraftEvents()
    return drafts.find((draft) => draft.id === id) || null
  }

  async saveDraft(
    draft: Partial<EventDraft> & { phoneNumber: string },
  ): Promise<EventDraft> {
    const drafts = await this.getDraftEvents()
    const existingDraftIndex = drafts.findIndex(
      (d) => d.phoneNumber === draft.phoneNumber,
    )

    if (existingDraftIndex !== -1) {
      // Update existing draft
      const updatedDraft: EventDraft = {
        ...drafts[existingDraftIndex],
        ...draft,
        lastSavedAt: new Date().toISOString(),
        isDraft: true,
      }
      drafts[existingDraftIndex] = updatedDraft
      localStorage.setItem(this.DRAFT_EVENTS_KEY, JSON.stringify(drafts))
      return updatedDraft
    } else {
      // Create new draft
      const newDraft: EventDraft = {
        id: `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...draft,
        isDraft: true,
        lastSavedAt: new Date().toISOString(),
      }
      drafts.push(newDraft)
      localStorage.setItem(this.DRAFT_EVENTS_KEY, JSON.stringify(drafts))
      return newDraft
    }
  }

  async deleteDraft(id: string): Promise<void> {
    const drafts = await this.getDraftEvents()
    const filteredDrafts = drafts.filter((draft) => draft.id !== id)
    localStorage.setItem(this.DRAFT_EVENTS_KEY, JSON.stringify(filteredDrafts))
  }

  async publishDraft(draftId: string): Promise<Event | null> {
    const draft = await this.getDraftById(draftId)
    if (!draft) return null

    // Create event from draft
    const event = await this.addEvent({
      name: draft.name || '',
      phoneNumber: draft.phoneNumber || '',
      dateTime: draft.dateTime || '',
      location: draft.location || '',
      costPerPerson: draft.costPerPerson || '',
      description: draft.description || '',
      imageUrl: draft.imageUrl || '',
      gradient: draft.gradient || {
        primary: '#ff4da6',
        secondary: '#a87aff',
        accent: '#6688ff',
      },
      isLive: false,
      isDraft: false,
    })

    // Delete the draft
    await this.deleteDraft(draftId)

    return event
  }

  // ==================== Custom Module Operations ====================

  async getCustomModules(eventId?: string): Promise<CustomModule[]> {
    const modules = localStorage.getItem(this.CUSTOM_MODULES_KEY)
    const allModules: CustomModule[] = modules ? JSON.parse(modules) : []

    if (eventId) {
      return allModules.filter((module) => module.eventId === eventId)
    }

    return allModules
  }

  async getModuleById(id: string): Promise<CustomModule | null> {
    const modules = await this.getCustomModules()
    return modules.find((module) => module.id === id) || null
  }

  async addCustomModule(
    module: Omit<CustomModule, 'id' | 'createdAt'>,
  ): Promise<CustomModule> {
    const modules = await this.getCustomModules()
    const newModule: CustomModule = {
      ...module,
      id: `module_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    modules.push(newModule)
    localStorage.setItem(this.CUSTOM_MODULES_KEY, JSON.stringify(modules))
    return newModule
  }

  async updateCustomModule(
    id: string,
    updates: Partial<CustomModule>,
  ): Promise<CustomModule | null> {
    const modules = await this.getCustomModules()
    const moduleIndex = modules.findIndex((module) => module.id === id)

    if (moduleIndex === -1) return null

    const updatedModule = {
      ...modules[moduleIndex],
      ...updates,
    }

    modules[moduleIndex] = updatedModule
    localStorage.setItem(this.CUSTOM_MODULES_KEY, JSON.stringify(modules))
    return updatedModule
  }

  async deleteCustomModule(id: string): Promise<void> {
    const modules = await this.getCustomModules()
    const filteredModules = modules.filter((module) => module.id !== id)
    localStorage.setItem(
      this.CUSTOM_MODULES_KEY,
      JSON.stringify(filteredModules),
    )
  }

  async reorderModules(_eventId: string, moduleIds: string[]): Promise<void> {
    const modules = await this.getCustomModules()

    // Update order for each module
    moduleIds.forEach((id, index) => {
      const moduleIndex = modules.findIndex((m) => m.id === id)
      if (moduleIndex !== -1) {
        modules[moduleIndex].order = index
      }
    })

    localStorage.setItem(this.CUSTOM_MODULES_KEY, JSON.stringify(modules))
  }

  // ==================== Utility Operations ====================

  async clearAllData(): Promise<void> {
    localStorage.removeItem(this.EVENTS_KEY)
    localStorage.removeItem(this.DRAFT_EVENTS_KEY)
    localStorage.removeItem(this.CUSTOM_MODULES_KEY)
    await this.initialize()
  }

  async exportData(): Promise<string> {
    const events = await this.getEvents()
    const drafts = await this.getDraftEvents()
    const modules = await this.getCustomModules()

    return JSON.stringify(
      {
        events,
        drafts,
        modules,
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    )
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData)

      if (data.events) {
        localStorage.setItem(this.EVENTS_KEY, JSON.stringify(data.events))
      }
      if (data.drafts) {
        localStorage.setItem(this.DRAFT_EVENTS_KEY, JSON.stringify(data.drafts))
      }
      if (data.modules) {
        localStorage.setItem(
          this.CUSTOM_MODULES_KEY,
          JSON.stringify(data.modules),
        )
      }
    } catch {
      throw new Error('Invalid data format')
    }
  }
}

export const database = new DatabaseService()

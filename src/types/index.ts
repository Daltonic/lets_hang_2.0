export interface Event {
  id: string
  phoneNumber: string
  name: string
  dateTime: string
  location: string
  costPerPerson: string
  description: string
  imageUrl: string // Base64 string or URL
  gradient: {
    primary: string
    secondary: string
    accent: string
  }
  isLive: boolean
  isDraft: boolean
  createdAt: string
  updatedAt: string
}

export interface CustomModule {
  id: string
  eventId: string
  name: string
  description: string
  icon: string // Icon name from lucide-react
  code: string // Frontend code to render the module
  order: number // For ordering modules
  createdAt: string
}

export interface EventDraft extends Partial<Event> {
  id: string
  phoneNumber?: string
  isDraft: true
  lastSavedAt: string
}

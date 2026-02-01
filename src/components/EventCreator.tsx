// File: src/components/EventCreator.tsx
import { useState, useRef, useEffect } from 'react';
import { useDatabase } from '../hooks/useDatabase';
import type { EventDraft } from '../types';

import Header from './Header';
import ImagePreview from './ImagePreview';
import AutoSaveIndicator from './AutoSaveIndicator';
import PhoneInput from './PhoneInput';
import EventDetailsCard from './EventDetailsCard';
import DescriptionTextarea from './DescriptionTextarea';
import QuickAddButtons from './QuickAddButtons';
import CustomizeSection from './CustomizeSection';
import GoLiveButton from './GoLiveButton';
import DatePickerModal from './DatePickerModal';

import { formatDateForDisplay } from '../utils/format';
import { EventNameInput } from './EventNameInput';

interface GradientColors {
    primary: string;
    secondary: string;
    accent: string;
}

interface ValidationErrors {
    phoneNumber?: string;
    eventName?: string;
    dateTime?: string;
    location?: string;
    costPerPerson?: string;
}

const EventCreator = () => {
    const {
        currentEvent,
        saveDraft,
        loadDraftByPhone,
        publishDraft,
        goLive,
        autoSave,
        addCustomModule,
        getEventModules,
        deleteCustomModule,
    } = useDatabase();

    const [gradient, setGradient] = useState<GradientColors>({ primary: '#ff4da6', secondary: '#a87aff', accent: '#6688ff' });
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [eventName, setEventName] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [location, setLocation] = useState('');
    const [costPerPerson, setCostPerPerson] = useState('');
    const [description, setDescription] = useState('');
    const [showMore, setShowMore] = useState(false);
    const [isPhoneLocked, setIsPhoneLocked] = useState(false);
    const [showModuleCreator, setShowModuleCreator] = useState(false);
    const [newModuleName, setNewModuleName] = useState('');
    const [newModuleDescription, setNewModuleDescription] = useState('');
    const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>('');

    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Load draft when phone number is entered
    useEffect(() => {
        const digitsOnly = phoneNumber.replace(/\D/g, '');
        if (digitsOnly.length >= 10 && !hasLoadedDraft) {
            loadDraftByPhone(digitsOnly).then((draft) => {
                if (draft) {
                    setEventName(draft.name || '');
                    setDateTime(draft.dateTime || '');
                    setLocation(draft.location || '');
                    setCostPerPerson(draft.costPerPerson || '');
                    setDescription(draft.description || '');
                    if (draft.imageUrl) {
                        setCustomImage(draft.imageUrl);
                    }
                    if (draft.gradient) {
                        setGradient(draft.gradient);
                    }
                    setIsPhoneLocked(true);
                    setHasLoadedDraft(true);
                }
            });
        }
    }, [phoneNumber, loadDraftByPhone, hasLoadedDraft]);

    // Auto-save draft when data changes
    useEffect(() => {
        const digitsOnly = phoneNumber.replace(/\D/g, '');
        if (!phoneNumber || digitsOnly.length < 10) return;

        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        autoSaveTimerRef.current = setTimeout(() => {
            const draftData: Partial<EventDraft> & { phoneNumber: string } = {
                phoneNumber: digitsOnly,
                name: eventName,
                dateTime,
                location,
                costPerPerson,
                description,
                imageUrl: customImage || 'default', // Adjusted to match original default
                gradient,
            };
            saveDraft(draftData);
        }, 2000);

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [phoneNumber, eventName, dateTime, location, costPerPerson, description, customImage, gradient, saveDraft]);

    const handlePhoneNumberSubmit = () => {
        const digitsOnly = phoneNumber.replace(/\D/g, '');
        if (digitsOnly.length >= 10 && !validationErrors.phoneNumber) {
            setIsPhoneLocked(true);
        }
    };

    const handleGoLive = async () => {
        // Validate all fields before going live
        const errors: ValidationErrors = {
            phoneNumber: validationErrors.phoneNumber,
            eventName: validationErrors.eventName,
            dateTime: validationErrors.dateTime,
            location: validationErrors.location,
            costPerPerson: validationErrors.costPerPerson,
        };

        // Filter out undefined errors
        const hasErrors = Object.values(errors).some(error => error !== undefined);

        if (hasErrors) {
            alert('Please fix validation errors before going live');
            return;
        }

        const digitsOnly = phoneNumber.replace(/\D/g, '');
        if (!phoneNumber || digitsOnly.length < 10) {
            alert('Please save your draft first by entering your phone number');
            return;
        }

        try {
            console.log('Starting publish process');
            
            // Save current state as draft first to ensure we have the latest changes
            const draftData: Partial<EventDraft> & { phoneNumber: string } = {
                phoneNumber: digitsOnly,
                name: eventName,
                dateTime,
                location,
                costPerPerson,
                description,
                imageUrl: customImage || 'default',
                gradient,
            };
            console.log('Saving draft with data:', draftData);
            const latestDraft = await saveDraft(draftData);
            console.log('Draft saved:', latestDraft);
            
            // Publish the latest draft
            console.log('Publishing draft:', latestDraft.id);
            const newEvent = await publishDraft(latestDraft.id);
            console.log('New event created:', newEvent);
            
            if (newEvent) {
                console.log('Going live with event:', newEvent.id);
                await goLive(newEvent.id);
                alert('Event is now live! 🎉');
                
                // Debug local storage
                const events = JSON.parse(localStorage.getItem('letshang_events') || '[]');
                const drafts = JSON.parse(localStorage.getItem('letshang_draft_events') || '[]');
                console.log('Final events:', events);
                console.log('Final drafts:', drafts);
            }
        } catch (error) {
            console.error('Error going live:', error);
            alert('Failed to go live. Please try again.');
        }
    };

    const handleAddModule = async () => {
        if (!currentEvent?.id || !newModuleName) return;

        try {
            await addCustomModule({
                eventId: currentEvent.id,
                name: newModuleName,
                description: newModuleDescription,
                icon: 'Sparkles',
                code: '// Custom module code goes here',
                order: getEventModules(currentEvent.id).length,
            });
            setNewModuleName('');
            setNewModuleDescription('');
            setShowModuleCreator(false);
        } catch {
            alert('Failed to add module');
        }
    };

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        const formattedDate = formatDateForDisplay(date);
        const time = selectedTime || '12:00 PM';
        setDateTime(`${formattedDate} at ${time}`);
        setShowDatePicker(false);
    };

    const handleTimeChange = (time: string) => {
        setSelectedTime(time);
        if (selectedDate) {
            const formattedDate = formatDateForDisplay(selectedDate);
            setDateTime(`${formattedDate} at ${time}`);
        }
    };

    const modules = currentEvent ? getEventModules(currentEvent.id) : [];

    return (
        <div
            className="min-h-screen transition-all duration-700 ease-in-out relative overflow-hidden"
            style={{
                background: `linear-gradient(135deg, ${gradient.primary} 0%, ${gradient.secondary} 50%, ${gradient.accent} 100%)`
            }}
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float"
                    style={{
                        background: gradient.primary,
                        top: '-10%',
                        left: '-5%',
                        animationDelay: '0s'
                    }}
                />
                <div
                    className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float"
                    style={{
                        background: gradient.accent,
                        bottom: '-10%',
                        right: '-5%',
                        animationDelay: '2s'
                    }}
                />
            </div>

            <Header />

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start">
                    <ImagePreview
                        customImage={customImage}
                        setCustomImage={setCustomImage}
                        setGradient={setGradient}
                    />

                    <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 lg:mb-8">
                            Name your event
                        </h2>

                        <AutoSaveIndicator autoSave={autoSave} />

                        <PhoneInput
                            phoneNumber={phoneNumber}
                            setPhoneNumber={setPhoneNumber}
                            isPhoneLocked={isPhoneLocked}
                            validationErrors={validationErrors}
                            setValidationErrors={setValidationErrors}
                            handlePhoneNumberSubmit={handlePhoneNumberSubmit}
                        />

                        <EventNameInput
                            eventName={eventName}
                            setEventName={setEventName}
                            validationErrors={validationErrors}
                            setValidationErrors={setValidationErrors}
                        />

                        <EventDetailsCard
                            dateTime={dateTime}
                            setDateTime={setDateTime}
                            location={location}
                            setLocation={setLocation}
                            costPerPerson={costPerPerson}
                            setCostPerPerson={setCostPerPerson}
                            validationErrors={validationErrors}
                            setValidationErrors={setValidationErrors}
                            focusedField={focusedField}
                            setFocusedField={setFocusedField}
                            setShowDatePicker={setShowDatePicker}
                        />

                        <DescriptionTextarea
                            description={description}
                            setDescription={setDescription}
                        />

                        <QuickAddButtons
                            showMore={showMore}
                            setShowMore={setShowMore}
                        />

                        <CustomizeSection
                            modules={modules}
                            showModuleCreator={showModuleCreator}
                            setShowModuleCreator={setShowModuleCreator}
                            newModuleName={newModuleName}
                            setNewModuleName={setNewModuleName}
                            newModuleDescription={newModuleDescription}
                            setNewModuleDescription={setNewModuleDescription}
                            handleAddModule={handleAddModule}
                            deleteCustomModule={deleteCustomModule}
                            currentEvent={currentEvent}
                            gradient={gradient}
                        />

                        <GoLiveButton
                            handleGoLive={handleGoLive}
                            disabled={!currentEvent || !phoneNumber}
                        />
                    </div>
                </div>
            </main>

            <DatePickerModal
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                handleTimeChange={handleTimeChange}
                handleDateSelect={handleDateSelect}
            />

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default EventCreator;
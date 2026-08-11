import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, Ticket, Clock, CheckCircle2, Award, Sparkles } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { events, showToast, user } = useAuth();
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);

  const handleRegisterEvent = (eventId: string, title: string) => {
    if (!user) {
      showToast('Please sign in to register for official ARMA events', 'error');
      return;
    }
    if (registeredEventIds.includes(eventId)) {
      showToast('You are already registered for this event', 'info');
      return;
    }
    setRegisteredEventIds((prev) => [...prev, eventId]);
    showToast(`Registered successfully for ${title}! E-ticket issued.`, 'success');
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-[#12161A] min-h-screen text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00A1DE]/10 text-[#00A1DE] text-xs font-mono font-bold">
            <Calendar className="w-3.5 h-3.5 text-[#00A1DE]" />
            OFFICIAL RWANDA FASHION CALENDAR
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight">
            National Fashion Events & Workshops
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Attend official Fashion Weeks, ARMA Catwalk Bootcamps, Model Rights Seminars, and Industry Networking Conventions in Kigali and across Rwanda.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((evt) => {
            const isRegistered = registeredEventIds.includes(evt.id);
            return (
              <div
                key={evt.id}
                className="group rounded-3xl bg-white dark:bg-[#1E2630] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00A1DE] text-white shadow">
                    {evt.category}
                  </span>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-serif font-bold tracking-tight">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-mono mt-0.5 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#00A1DE]" />
                      {evt.venue}, {evt.location}
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px]">DATES</span>
                      <strong className="text-slate-800 dark:text-slate-200">{evt.startDate} to {evt.endDate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">ORGANIZER</span>
                      <strong className="text-[#00A1DE]">{evt.organizer}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-mono font-bold text-[#20603D]">
                      {evt.ticketPrice || 'Free Entry'}
                    </span>

                    {isRegistered ? (
                      <span className="px-5 py-2.5 rounded-xl bg-[#20603D]/10 text-[#20603D] text-xs font-bold font-mono flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Registered (E-Ticket Ready)
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRegisterEvent(evt.id, evt.title)}
                        className="px-6 py-2.5 rounded-xl bg-[#00A1DE] text-white text-xs font-semibold hover:bg-[#0081B3] transition-colors flex items-center gap-2 shadow"
                      >
                        <Ticket className="w-4 h-4 text-[#FAD201]" />
                        Register & Get Pass
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

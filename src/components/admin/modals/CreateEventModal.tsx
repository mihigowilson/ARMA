import React, { useState } from 'react';
import { X, Calendar, Plus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { EventItem } from '../../../types/arma';
import { validateData, adminCreateEventSchema } from '../../../lib/validationSchemas';
import { ImageUploader } from '../../common/ImageUploader';

interface CreateEventModalProps {
  onClose: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose }) => {
  const { addEvent, showToast } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventItem['category']>('Fashion Week');
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-09-17');
  const [location, setLocation] = useState('Kigali');
  const [venue, setVenue] = useState('Kigali Convention Centre');
  const [description, setDescription] = useState('');
  const [ticketPrice, setTicketPrice] = useState('25,000 RWF Regular / 75,000 RWF VIP');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateData(adminCreateEventSchema, {
      title,
      organizer: 'ARMA Secretariat & Fashion Committee',
      date: startDate,
      time: '09:00 AM CAT',
      venue,
      category,
      description: description || title + ' - National fashion industry event hosted under ARMA guidelines.'
    });

    if (!validation.success) {
      const firstErr = Object.values(validation.errors)[0];
      showToast(`Validation Error: ${firstErr}`, 'error');
      return;
    }

    const newEvent: EventItem = {
      id: `evt-${Date.now()}`,
      title,
      category,
      startDate,
      endDate,
      location,
      venue,
      description: description || 'Official fashion industry event hosted under ARMA guidelines.',
      image: imageUrl,
      organizer: 'ARMA Secretariat & Fashion Committee',
      ticketPrice,
      status: 'Upcoming',
      isFeatured: true
    };

    addEvent(newEvent);
    showToast(`Created event "${title}"!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#12161A] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00A1DE]/10 text-[#00A1DE] flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold">Publish New Event</h3>
            <p className="text-xs text-slate-500">Create a fashion show, masterclass, or casting event</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mercedes-Benz Fashion Week Kigali 2026"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <option value="Fashion Week">Fashion Week</option>
                <option value="Casting">Casting</option>
                <option value="Competition">Competition</option>
                <option value="Training">Training</option>
                <option value="Seminar">Seminar</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">City / Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Venue Address</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Kigali Marriott Hotel Ballroom"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Ticket Pricing & Access</label>
            <input
              type="text"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              placeholder="e.g. Free for ARMA Members"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event highlights and details..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div>
            <ImageUploader
              label="Event Banner / Poster Image *"
              currentImage={imageUrl}
              onImageChange={(newImg) => setImageUrl(newImg)}
              aspectRatio="landscape"
              placeholderText="Upload Event Poster or Banner"
              rounded="2xl"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#00A1DE] text-white font-semibold hover:bg-[#0081B3] transition-colors shadow-lg"
          >
            Publish Event
          </button>
        </form>
      </div>
    </div>
  );
};

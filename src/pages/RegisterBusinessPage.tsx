import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useVycinty } from '../store/state';
import { SEED_CATEGORIES } from '../data';
import { Business, OpeningHours } from '../types';
import { 
  Building2, MapPin, Image, Contact, Clock, Calendar, Check,
  ChevronRight, ChevronLeft, Sparkles, CheckCircle, Info, Phone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const RegisterBusinessPage: React.FC = () => {
  const { categories, addBusiness, currentUser } = useVycinty();
  const navigate = useNavigate();

  // Multi-step phase state
  const [step, setStep] = useState<number>(1);
  const [success, setSuccess] = useState<boolean>(false);

  // Form Fields State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');

  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [isPhysical, setIsPhysical] = useState<boolean>(true);
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number>(7.505);
  const [lng, setLng] = useState<number>(4.520);

  // Cover & supplemental media
  const [coverURL, setCoverURL] = useState('https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800');
  const [galleryUrls, setGalleryUrls] = useState<string>('');

  // Weekly operation hours mapping
  const [monOpen, setMonOpen] = useState(true);
  const [monHours, setMonHours] = useState('8:00 AM - 6:00 PM');
  const [tueOpen, setTueOpen] = useState(true);
  const [tueHours, setTueHours] = useState('8:00 AM - 6:00 PM');
  const [wedOpen, setWedOpen] = useState(true);
  const [wedHours, setWedHours] = useState('8:00 AM - 6:00 PM');
  const [thuOpen, setThuOpen] = useState(true);
  const [thuHours, setThuHours] = useState('8:00 AM - 6:00 PM');
  const [friOpen, setFriOpen] = useState(true);
  const [friHours, setFriHours] = useState('8:00 AM - 6:00 PM');
  const [satOpen, setSatOpen] = useState(true);
  const [satHours, setSatHours] = useState('9:00 AM - 4:00 PM');
  const [sunOpen, setSunOpen] = useState(false);
  const [sunHours, setSunHours] = useState('Closed');

  // Group categories alphabetically by parent for clean grouping
  const parentCategories = useMemo(() => {
    return categories.filter(c => c.parentId === null);
  }, [categories]);

  const selectCategoriesList = useMemo(() => {
    // Generate grouped list
    const list: { id: string; name: string; group: string }[] = [];
    parentCategories.forEach(parent => {
      // Find children
      const children = categories.filter(c => c.parentId === parent.id);
      if (children.length > 0) {
        children.forEach(child => {
          list.push({ id: child.id, name: child.name, group: parent.name });
        });
      } else {
        list.push({ id: parent.id, name: parent.name, group: 'General Segments' });
      }
    });
    return list;
  }, [categories, parentCategories]);

  const handleNext = () => {
    if (step === 1) {
      if (!name || !categoryId || !shortDesc) {
        alert('Please fill out all required basic information fields.');
        return;
      }
    } else if (step === 2) {
      if (!phone || !email || (isPhysical && !address)) {
        alert('Please fill in phone, email, and coordinates address values.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Setup opening hours object
    const opHours: OpeningHours = {
      mon: monOpen ? monHours : 'Closed',
      tue: tueOpen ? tueHours : 'Closed',
      wed: wedOpen ? wedHours : 'Closed',
      thu: thuOpen ? thuHours : 'Closed',
      fri: friOpen ? friHours : 'Closed',
      sat: satOpen ? satHours : 'Closed',
      sun: sunOpen ? sunHours : 'Closed'
    };

    const supplementalList = galleryUrls
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Submit payload
    const payload = {
      ownerId: currentUser?.id || null,
      name,
      slug,
      description: longDesc || `${name} is an active local business providing custom services in Ile-Ife.`,
      categoryId,
      city: 'Ile-Ife',
      address: isPhysical ? address : 'Digital / Remote Vendor',
      phone,
      whatsapp: whatsapp || phone.replace(/\+/g, ''),
      email,
      website: website || undefined,
      instagram: instagram || undefined,
      latitude: Number(lat) || 7.505,
      longitude: Number(lng) || 4.520,
      coverImage: coverURL || 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800',
      images: [coverURL, ...supplementalList],
      isPhysical,
    };

    addBusiness(payload);
    setSuccess(true);
  };

  const randomCoverSuggestion = (type: string) => {
    const urls: Record<string, string> = {
      restaurant: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=600',
      lounge: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=600',
      gadget: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=600',
      clothing: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600',
      hotel: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600',
      fitness: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600'
    };
    if (urls[type]) {
      setCoverURL(urls[type]);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-200">
          <Check className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1A1A2E] font-heading">
          Submitted for Verification!
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm font-sans leading-relaxed">
          Your business listing **{name}** has been recorded successfully. To maintain directory authenticity, Vycinty administrators review and verify details before publishing it live on the main categories grid.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-left text-xs text-yellow-950 flex gap-2 font-sans">
          <Info className="w-5 h-5 shrink-0 text-yellow-600" />
          <div>
            <p className="font-bold">Simulate Admin Approval Sandbox Mode:</p>
            <p className="mt-1">
              You can instantly see, inspect, and approve this listing! Click your profile dropdown at the top, switch your simulator role to **Admin**, then go to the **Admin Approval Panel** to activate this listing in 1 click!
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-3 pt-4">
          <Link
            to="/dashboard"
            className="bg-[#1A1A2E] hover:bg-[#FF5722] text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors decoration-none"
          >
            My Listing Status
          </Link>
          <Link
            to="/"
            className="border border-gray-300 hover:bg-slate-50 text-slate-700 font-bold px-6 py-3 rounded-xl text-xs transition-all decoration-none"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAF8] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stepper Header Progress */}
        <div className="text-center space-y-2 mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1A1A2E] font-heading">
            Register Your Business
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-sans max-w-md mx-auto">
            Get your shop or service discoverable to thousands of students and residents in Ile-Ife.
          </p>

          {/* Graphical Step Bubble Track */}
          <div className="flex items-center justify-center space-x-4 pt-6 max-w-md mx-auto">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${
                      step >= s 
                        ? 'border-[#FF5722] bg-[#FF5722] text-white' 
                        : 'border-gray-200 bg-white text-gray-400'
                    }`}
                  >
                    {s}
                  </div>
                  <span className={`text-[11px] font-bold font-mono ${step >= s ? 'text-[#FF5722]' : 'text-gray-400'}`}>
                    {s === 1 ? 'Primary info' : s === 2 ? 'Contacts' : 'Media & Hours'}
                  </span>
                </div>
                {s < 3 && <div className={`h-0.5 flex-1 max-w-[40px] ${step > s ? 'bg-[#FF5722]' : 'bg-gray-200'}`}></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <h2 className="text-lg font-bold text-[#1A1A2E] border-b border-gray-100 pb-2 font-heading">
                  Step 1: Primary Details
                </h2>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chicken Republic Lagere, OAU Staff Lounge"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF5722]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Category *</label>
                    <select
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 bg-white cursor-pointer focus:outline-none focus:border-[#FF5722]"
                    >
                      <option value="">-- Select Specific Segment --</option>
                      {selectCategoriesList.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          [{cat.group}] {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">City (Pre-filled for Launch) *</label>
                    <input
                      type="text"
                      disabled
                      value="Ile-Ife (Osun State)"
                      className="w-full bg-slate-50 text-slate-400 text-xs sm:text-sm p-3 rounded-lg border border-gray-200 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Catchy Single-Line Description * <span className="text-[10px] text-gray-400">(Max 160 chars)</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    placeholder="Premium student hangout spot specializing in continental dishes and extreme music."
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    className="w-full text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF5722]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Full Operational Description</label>
                  <textarea
                    rows={5}
                    placeholder="Provide depth about your services. Is there high-speed internet? Student payment discounts? Senator suits options for weddings, or authentic Apple chargers with 3 months warranties?"
                    value={longDesc}
                    onChange={(e) => setLongDesc(e.target.value)}
                    className="w-full text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none inline-block focus:border-[#FF5722]"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 2: Contacts & Location */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <h2 className="text-lg font-bold text-[#1A1A2E] border-b border-gray-100 pb-2 font-heading">
                  Step 2: Contacts & Map Coordinates
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Phone Call Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +2348123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">WhatsApp Chat Connection</label>
                    <input
                      type="text"
                      placeholder="e.g. 2348123456789 (no '+' symbol)"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sales@chickenreplagere.ng"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Instagram Handle</label>
                    <input
                      type="text"
                      placeholder="e.g. my_joint_ife"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Website URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="e.g. https://myjoint.ng"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF5722]"
                  />
                </div>

                {/* Physical Location Toggle */}
                <div className="bg-slate-50 p-4 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Do you have a physical shop / outlet in Ife?</p>
                      <p className="text-[10px] text-slate-500 font-sans">Turn off if you are an online-only student vendor.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPhysical(!isPhysical)}
                      className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer focus:outline-none ${
                        isPhysical ? 'bg-[#FF5722]' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${isPhysical ? 'translate-x-6' : ''}`}></div>
                    </button>
                  </div>

                  {isPhysical && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3 pt-3 border-t border-gray-200"
                    >
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">Street Address *</label>
                        <input
                          type="text"
                          required={isPhysical}
                          placeholder="e.g. Mayfair Plaza, opposite Zenith Bank, Lagere, Ile-Ife"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-white text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF5722]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">Latitude Coordinates</label>
                          <input
                            type="number"
                            step="any"
                            value={lat}
                            onChange={(e) => setLat(Number(e.target.value))}
                            className="w-full bg-white text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 font-mono focus:outline-none focus:border-[#FF5722]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-700">Longitude Coordinates</label>
                          <input
                            type="number"
                            step="any"
                            value={lng}
                            onChange={(e) => setLng(Number(e.target.value))}
                            className="w-full bg-white text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 font-mono focus:outline-none focus:border-[#FF5722]"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        💡 Suggestion: Standard Ile-Ife central lat/long falls around (7.505, 4.520). Use these if not sure of exact indices.
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Media & Opening Hours */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-lg font-bold text-[#1A1A2E] border-b border-gray-100 pb-2 font-heading">
                  Step 3: Cover Photo & Work Hours
                </h2>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Cover Image URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="Provide an online image link (Unsplash or postimg.cc)"
                      value={coverURL}
                      onChange={(e) => setCoverURL(e.target.value)}
                      className="w-full text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF5722]"
                    />
                  </div>

                  {/* Built-in image suggestions triggers */}
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1 font-semibold uppercase tracking-wider font-mono">
                      Quick suggestions templates:
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      {[
                        { label: 'Restaurant / Dining', type: 'restaurant' },
                        { label: 'Drink Lounge / Club', type: 'lounge' },
                        { label: 'Gadget Store', type: 'gadget' },
                        { label: 'Tailor & Fashion', type: 'clothing' },
                        { label: 'Hotel & Lodging', type: 'hotel' },
                        { label: 'Wellness Gym', type: 'fitness' }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => randomCoverSuggestion(item.type)}
                          className="bg-slate-100 p-1.5 rounded-sm hover:bg-[#FF5722] hover:text-white transition-colors cursor-pointer font-medium"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Additional Gallery Images <span className="text-gray-400 font-normal">(Comma separated URLs, up to 5)</span></label>
                  <input
                    type="text"
                    placeholder="URL1, URL2, URL3..."
                    value={galleryUrls}
                    onChange={(e) => setGalleryUrls(e.target.value)}
                    className="w-full text-slate-800 text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#FF5722]"
                  />
                </div>

                {/* Operations checklist */}
                <div className="border border-gray-100 rounded-xl p-4 bg-[#FAFAF8] space-y-3">
                  <span className="text-xs font-bold text-slate-700 flex items-center">
                    <Clock className="w-4 h-4 text-[#FF5722] mr-1.5" /> Adjust Opening Hours schedule:
                  </span>

                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {[
                      { day: 'Mon', label: 'Monday', open: monOpen, setOpen: setMonOpen, hours: monHours, setHours: setMonHours },
                      { day: 'Tue', label: 'Tuesday', open: tueOpen, setOpen: setTueOpen, hours: tueHours, setHours: setTueHours },
                      { day: 'Wed', label: 'Wednesday', open: wedOpen, setOpen: setWedOpen, hours: wedHours, setHours: setWedHours },
                      { day: 'Thu', label: 'Thursday', open: thuOpen, setOpen: setThuOpen, hours: thuHours, setHours: setThuHours },
                      { day: 'Fri', label: 'Friday', open: friOpen, setOpen: setFriOpen, hours: friHours, setHours: setFriHours },
                      { day: 'Sat', label: 'Saturday', open: satOpen, setOpen: setSatOpen, hours: satHours, setHours: setSatHours },
                      { day: 'Sun', label: 'Sunday', open: sunOpen, setOpen: setSunOpen, hours: sunHours, setHours: setSunHours }
                    ].map((row, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 hover:bg-white rounded-md border border-transparent hover:border-gray-100 transition-colors">
                        <div className="flex items-center space-x-3 pb-1 sm:pb-0">
                          <input
                            type="checkbox"
                            checked={row.open}
                            onChange={(e) => row.setOpen(e.target.checked)}
                            className="accent-[#FF5722] w-4 h-4 cursor-pointer"
                            id={`day-${idx}`}
                          />
                          <label htmlFor={`day-${idx}`} className="text-xs font-bold text-[#1A1A2E] w-20 cursor-pointer">{row.label}</label>
                        </div>
                        {row.open ? (
                          <input
                            type="text"
                            value={row.hours}
                            onChange={(e) => row.setHours(e.target.value)}
                            className="text-xs p-1.5 border rounded border-gray-200 bg-white font-mono w-full sm:w-48 text-slate-700"
                          />
                        ) : (
                          <span className="text-[11px] font-bold text-red-500 font-mono uppercase bg-red-50 border border-red-100 px-2 py-0.5 rounded leading-none">
                            Closed
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step Controls */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="bg-slate-100 hover:bg-slate-200 text-[#1A1A2E] px-5 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 hover:scale-101 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div></div> // Placeholder space
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#1A1A2E] hover:bg-[#FF5722] text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 hover:scale-102 cursor-pointer"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-[#FF5722] hover:bg-[#1A1A2E] text-white px-8 py-3 rounded-xl text-xs font-bold transition-transform hover:scale-103 shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Register Listing</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

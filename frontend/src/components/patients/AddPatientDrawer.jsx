import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddPatientDrawer = ({ isOpen, onClose, onSave, onDelete, patient }) => {
  if (!isOpen) return null;

  // 1. Admission Profile State
  const [dateAdmission, setDateAdmission] = useState('');
  const [dateArrival, setDateArrival] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [status, setStatus] = useState('');

  // 2. Contacts & Address State
  const [nationality, setNationality] = useState('');
  const [address, setAddress] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [relation, setRelation] = useState('');
  const [guardianMobile, setGuardianMobile] = useState('');
  const [altContact, setAltContact] = useState('');

  // 3. Medical Category State
  const [residentCategory, setResidentCategory] = useState('');
  const [otherCategory, setOtherCategory] = useState('');

  // 4. Biometrics & Routine State
  const [wakeUpTime, setWakeUpTime] = useState('');
  const [sleepingTime, setSleepingTime] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState('');

  // Live Automatic Age Estimation Engine from Date of Birth Selection
  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let estimatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        estimatedAge--;
      }
      setAge(estimatedAge >= 0 ? estimatedAge.toString() : '0');
    } else {
      setAge('');
    }
  }, [dob]);

  // Live Automatic Physical BMI Metric Estimation Engine (kg / m^2)
  useEffect(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const heightInMeters = h / 100;
      const score = w / (heightInMeters * heightInMeters);
      setBmi(score.toFixed(1));
    } else {
      setBmi('');
    }
  }, [height, weight]);

  // Sync state parameters when editing an existing patient profile
  useEffect(() => {
    if (patient) {
      setDateAdmission(patient.dateAdmission || '');
      setDateArrival(patient.dateArrival || '');
      setName(patient.name || '');
      setGender(patient.gender || '');
      setDob(patient.dob || '');
      setAge(patient.age || '');
      setBloodGroup(patient.bloodGroup || '');
      setStatus(patient.status || '');
      setNationality(patient.nationality || '');
      setAddress(patient.address || '');
      setGuardianName(patient.guardianName || '');
      setRelation(patient.relation || '');
      setGuardianMobile(patient.guardianMobile || '');
      setAltContact(patient.altContact || '');
      setResidentCategory(patient.residentCategory || '');
      setOtherCategory(patient.otherCategory || '');
      setWakeUpTime(patient.wakeUpTime || '');
      setSleepingTime(patient.sleepingTime || '');
      setHeight(patient.height || '');
      setWeight(patient.weight || '');
      setBmi(patient.bmi || '');
    } else {
      setDateAdmission('');
      setDateArrival('');
      setName('');
      setGender('');
      setDob('');
      setAge('');
      setBloodGroup('');
      setStatus('');
      setNationality('');
      setAddress('');
      setGuardianName('');
      setRelation('');
      setGuardianMobile('');
      setAltContact('');
      setResidentCategory('');
      setOtherCategory('');
      setWakeUpTime('');
      setSleepingTime('');
      setHeight('');
      setWeight('');
      setBmi('');
    }
  }, [patient, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ 
      dateAdmission,
      dateArrival,
      name, 
      gender, 
      dob,
      age,
      bloodGroup,
      status: status || 'Active',
      nationality,
      address,
      guardianName,
      relation,
      guardianMobile,
      altContact,
      residentCategory,
      otherCategory: residentCategory === 'Others' ? otherCategory : '',
      wakeUpTime,
      sleepingTime,
      height,
      weight,
      bmi
    });
  };
  return (
    <>
      <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50" onClick={onClose} />

      {/* 
        FIXED:
        - Changed 'w-full max-w-xl' to 'w-full sm:max-w-xl' to match narrow mobile views cleanly.
      */}
      <form onSubmit={handleSubmit} className="fixed inset-y-0 right-0 w-full sm:max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100 transition-all duration-300">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{patient ? 'Update Clinical Registry' : 'Add New Admission'}</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"><X size={20} /></button>
        </div>

        {/* Fluid custom padding 'p-4 sm:p-6' drops spacing down perfectly on smartphone frames */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* SECTION 1: PRIMARY BIOGRAPHICAL PROFILE */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b pb-1.5">1. Admission Information</h3>
            
            {/* FIXED: Changed grid-cols-2 to grid-cols-1 sm:grid-cols-2 to stack inputs vertically on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date of Admission</label>
                <input type="date" required value={dateAdmission} onChange={(e) => setDateAdmission(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date of Arrival</label>
                <input type="date" required value={dateArrival} onChange={(e) => setDateArrival(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
              <input type="text" required placeholder="Enter full name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
            </div>

            {/* FIXED: Changed grid-cols-2 to grid-cols-1 sm:grid-cols-2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date of Birth</label>
                <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Calculated Age</label>
                <input type="text" disabled placeholder="-" value={age} className="w-full px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold" />
              </div>
            </div>

            {/* FIXED: Changed grid-cols-2 to grid-cols-1 sm:grid-cols-2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
                <select required value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Blood Group</label>
                <select required value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700">
                  <option value="">Select</option>
                  <option value="A+">A+</option> <option value="A-">A-</option>
                  <option value="B+">B+</option> <option value="B-">B-</option>
                  <option value="O+">O+</option> <option value="O-">O-</option>
                  <option value="AB+">AB+</option> <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Admission Status</label>
              <select required value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700">
                <option value="">Select option</option>
                <option value="Active">Active</option>
                <option value="Inpatient">Inpatient</option>
                <option value="Outpatient">Outpatient</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
          </div>

          {/* SECTION 2: REGISTRY CONTACT METRICS */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b pb-1.5">2. Contact & Address Details</h3>
            
            {/* FIXED: Changed grid-cols-2 to grid-cols-1 sm:grid-cols-2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nationality</label>
                <input type="text" required placeholder="Nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Guardian Name</label>
                <input type="text" required placeholder="Guardian full name" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
              </div>
            </div>

            {/* FIXED: Changed grid-cols-2 to grid-cols-1 sm:grid-cols-2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Relationship</label>
                <input type="text" required placeholder="e.g. Son, Wife" value={relation} onChange={(e) => setRelation(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Guardian Mobile</label>
                <input type="tel" required placeholder="Mobile number" value={guardianMobile} onChange={(e) => setGuardianMobile(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Alternative Contact Number</label>
              <input type="tel" placeholder="Backup phone number" value={altContact} onChange={(e) => setAltContact(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Permanent Address</label>
              <textarea rows="2" required placeholder="Enter full address details" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 resize-none" />
            </div>
          </div>

          {/* SECTION 3: RESIDENT CATEGORY SELECTION */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b pb-1.5">3. Resident Medical Category</h3>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Diagnostic Profile Classification</label>
              <select required value={residentCategory} onChange={(e) => setResidentCategory(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-700">
                <option value="">Select Category</option>
                <option value="Independent">Independent</option>
                <option value="Bedridden">Bedridden</option>
                <option value="Semi-Bedridden">Semi-Bedridden</option>
                <option value="Wheelchair">Wheelchair</option>
                <option value="Assisted Walking">Assisted Walking</option>
                <option value="Dementia">Dementia</option>
                <option value="Alzheimer's">Alzheimer's</option>
                <option value="Parkinson's">Parkinson's</option>
                <option value="Stroke">Stroke</option>
                <option value="Mental Illness">Mental Illness</option>
                <option value="Psychiatric Disorder">Psychiatric Disorder</option>
                <option value="Hearing">Hearing Impairment</option>
                <option value="Vision">Vision Impairment</option>
                <option value="Speech">Speech Impairment</option>
                <option value="Palliative">Palliative Care</option>
                <option value="Terminally Ill">Terminally Ill</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {residentCategory === 'Others' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Specify Other Condition</label>
                <input type="text" required placeholder="Specify condition details" value={otherCategory} onChange={(e) => setOtherCategory(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
              </div>
            )}
          </div>

          {/* SECTION 4: ROUTINES & BIOMETRICS */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest border-b pb-1.5">4. Routines & Physical Metrics</h3>
            
            {/* FIXED: Changed grid-cols-2 to grid-cols-1 sm:grid-cols-2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Wake-Up Time</label>
                <input type="time" value={wakeUpTime} onChange={(e) => setWakeUpTime(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sleeping Time</label>
                <input type="time" value={sleepingTime} onChange={(e) => setSleepingTime(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
              </div>
            </div>

            {/* FIXED: Changed grid-cols-3 to grid-cols-1 sm:grid-cols-3 to collapse row columns clean on phones */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Height (cm)</label>
                <input type="number" placeholder="cm" min="0" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Weight (kg)</label>
                <input type="number" placeholder="kg" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Calculated BMI</label>
                <input type="text" disabled placeholder="-" value={bmi} className="w-full px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-bold" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 mt-auto">
          <div>
            {patient ? (
              <button type="button" onClick={() => onDelete(patient._id)} className="px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors">Delete Record</button>
            ) : (
              <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer transition-colors">Close</button>
            )}
          </div>
          <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm cursor-pointer transition-colors">
            {patient ? 'Save Changes' : 'Register Patient'}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddPatientDrawer;


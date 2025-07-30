import React, { useState, useEffect } from 'react';
import { Clock, Users, Settings, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { EXAM_SLOTS, STUDENTS_WITH_SLOTS, generateUniqueLink } from '../data/examSets';
import { useExam } from '../contexts/ExamContext';

export function SlotManagement() {
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [generatedLinks, setGeneratedLinks] = useState<Record<string, string[]>>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const { state } = useExam();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const generateSlotLinks = (slotId: string) => {
    const slotStudents = STUDENTS_WITH_SLOTS.filter(s => s.slotTime === slotId);
    const links = slotStudents.map(student => {
      const baseUrl = window.location.origin;
      return `${baseUrl}?student=${student.id}&slot=${slotId}&token=${btoa(`${student.id}-${slotId}-${Date.now()}`)}`;
    });
    
    setGeneratedLinks(prev => ({
      ...prev,
      [slotId]: links
    }));
  };

  const exportSlotLinks = (slotId: string) => {
    const slotStudents = STUDENTS_WITH_SLOTS.filter(s => s.slotTime === slotId);
    const slot = EXAM_SLOTS.find(s => s.id === slotId);
    
    if (!slot) return;

    const csvContent = [
      'Student ID,Student Name,Exam Link,Slot Time,Exam Set',
      ...slotStudents.map(student => {
        const link = `${window.location.origin}?student=${student.id}&slot=${slotId}&token=${btoa(`${student.id}-${slotId}-${Date.now()}`)}`;
        return `${student.id},"${student.name}","${link}","${slot.name}",${student.examSet}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam_links_${slot.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSlotStatus = (slot: typeof EXAM_SLOTS[0]) => {
    const now = currentTime;
    if (now < slot.startTime) return 'upcoming';
    if (now > slot.endTime) return 'completed';
    return 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return state.highContrast ? 'text-blue-300' : 'text-blue-600';
      case 'active': return state.highContrast ? 'text-green-300' : 'text-green-600';
      case 'completed': return state.highContrast ? 'text-gray-400' : 'text-gray-500';
      default: return state.highContrast ? 'text-gray-400' : 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Clock size={16} />;
      case 'active': return <CheckCircle size={16} />;
      case 'completed': return <AlertTriangle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className={`min-h-screen p-6 ${
      state.highContrast ? 'bg-black text-white' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${
          state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
        } rounded-2xl p-6 mb-8`}>
          <div className="flex items-center space-x-4 mb-4">
            <Settings size={32} className={state.highContrast ? 'text-blue-400' : 'text-blue-600'} />
            <div>
              <h1 className={`font-bold ${
                state.fontSize === 'small' ? 'text-2xl' : 
                state.fontSize === 'large' ? 'text-4xl' : 'text-3xl'
              }`}>
                Exam Slot Management
              </h1>
              <p className={`${
                state.fontSize === 'small' ? 'text-sm' : 
                state.fontSize === 'large' ? 'text-lg' : 'text-base'
              } ${state.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                Manage exam slots and generate unique student links
              </p>
            </div>
          </div>
          
          <div className={`text-center p-4 rounded-lg ${
            state.highContrast ? 'bg-gray-800' : 'bg-blue-50'
          }`}>
            <p className={`font-medium ${
              state.fontSize === 'small' ? 'text-base' : 
              state.fontSize === 'large' ? 'text-xl' : 'text-lg'
            } ${state.highContrast ? 'text-blue-300' : 'text-blue-700'}`}>
              Current Time: {currentTime.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Slots Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {EXAM_SLOTS.map(slot => {
            const status = getSlotStatus(slot);
            const slotStudents = STUDENTS_WITH_SLOTS.filter(s => s.slotTime === slot.id);
            
            return (
              <div key={slot.id} className={`p-6 rounded-xl border ${
                status === 'active' 
                  ? state.highContrast ? 'bg-green-900 border-green-600' : 'bg-green-50 border-green-200'
                  : state.highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
              } shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold ${
                    state.fontSize === 'small' ? 'text-lg' : 
                    state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
                  }`}>
                    {slot.name}
                  </h3>
                  <div className={`flex items-center space-x-1 ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                    <span className={`font-medium capitalize ${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className={`flex items-center justify-between ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  }`}>
                    <span className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>Start:</span>
                    </span>
                    <span className="font-medium">{slot.startTime.toLocaleTimeString()}</span>
                  </div>

                  <div className={`flex items-center justify-between ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  }`}>
                    <span className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>End:</span>
                    </span>
                    <span className="font-medium">{slot.endTime.toLocaleTimeString()}</span>
                  </div>

                  <div className={`flex items-center justify-between ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  }`}>
                    <span className="flex items-center space-x-2">
                      <Users size={16} />
                      <span>Students:</span>
                    </span>
                    <span className="font-medium">{slotStudents.length}/{slot.maxStudents}</span>
                  </div>

                  <div className={`flex items-center justify-between ${
                    state.fontSize === 'small' ? 'text-sm' : 
                    state.fontSize === 'large' ? 'text-lg' : 'text-base'
                  }`}>
                    <span>Exam Set:</span>
                    <span className="font-medium">{slot.examSet}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => generateSlotLinks(slot.id)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    } ${
                      state.highContrast 
                        ? 'bg-blue-800 text-blue-200 hover:bg-blue-700' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Generate Links
                  </button>
                  
                  <button
                    onClick={() => exportSlotLinks(slot.id)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      state.fontSize === 'small' ? 'text-sm' : 
                      state.fontSize === 'large' ? 'text-lg' : 'text-base'
                    } ${
                      state.highContrast 
                        ? 'bg-green-800 text-green-200 hover:bg-green-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Export CSV
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Generated Links Display */}
        {Object.keys(generatedLinks).length > 0 && (
          <div className={`${
            state.highContrast ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-lg border border-gray-200'
          } rounded-2xl p-6`}>
            <h2 className={`font-bold mb-4 ${
              state.fontSize === 'small' ? 'text-xl' : 
              state.fontSize === 'large' ? 'text-3xl' : 'text-2xl'
            }`}>
              Generated Links
            </h2>
            
            {Object.entries(generatedLinks).map(([slotId, links]) => {
              const slot = EXAM_SLOTS.find(s => s.id === slotId);
              const slotStudents = STUDENTS_WITH_SLOTS.filter(s => s.slotTime === slotId);
              
              return (
                <div key={slotId} className="mb-6">
                  <h3 className={`font-medium mb-3 ${
                    state.fontSize === 'small' ? 'text-lg' : 
                    state.fontSize === 'large' ? 'text-2xl' : 'text-xl'
                  }`}>
                    {slot?.name} - {links.length} Links Generated
                  </h3>
                  
                  <div className={`max-h-60 overflow-y-auto p-4 rounded-lg ${
                    state.highContrast ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    {slotStudents.slice(0, 10).map((student, index) => (
                      <div key={student.id} className={`mb-2 p-2 rounded border ${
                        state.highContrast ? 'border-gray-600' : 'border-gray-200'
                      }`}>
                        <div className={`font-medium ${
                          state.fontSize === 'small' ? 'text-sm' : 
                          state.fontSize === 'large' ? 'text-lg' : 'text-base'
                        }`}>
                          {student.id} - {student.name}
                        </div>
                        <div className={`text-xs font-mono break-all ${
                          state.highContrast ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {links[index]}
                        </div>
                      </div>
                    ))}
                    {slotStudents.length > 10 && (
                      <p className={`text-center ${
                        state.fontSize === 'small' ? 'text-sm' : 
                        state.fontSize === 'large' ? 'text-lg' : 'text-base'
                      } ${state.highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                        ... and {slotStudents.length - 10} more students
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Button, Modal, TextField, IconButton, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import 'tailwindcss/tailwind.css';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(JSON.parse(localStorage.getItem('events')) || {});
  const [modalOpen, setModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    name: '',
    startTime: '',
    endTime: '',
    description: '',
  });

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (year, month) =>
    new Array(31)
      .fill('')
      .map((_, i) => {
        const date = new Date(year, month, i + 1);
        return date.getMonth() === month ? date : null;
      })
      .filter(Boolean);

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const handleEventChange = (field, value) => {
    setEventForm({ ...eventForm, [field]: value });
  };

  const saveEvent = () => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    setEvents({
      ...events,
      [dateKey]: [...(events[dateKey] || []), eventForm],
    });
    setEventForm({ name: '', startTime: '', endTime: '', description: '' });
    setModalOpen(false);
  };

  const deleteEvent = (dateKey, index) => {
    const updatedEvents = { ...events };
    updatedEvents[dateKey].splice(index, 1);
    if (!updatedEvents[dateKey].length) delete updatedEvents[dateKey];
    setEvents(updatedEvents);
  };

  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button variant="contained" onClick={() => changeMonth(-1)}>
          Previous
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h1>
        <Button variant="contained" onClick={() => changeMonth(1)}>
          Next
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="font-semibold text-gray-600">
            {day}
          </div>
        ))}
        {days.map((date) => (
          <div
            key={date}
            onClick={() => handleDayClick(date)}
            className={`p-4 border rounded cursor-pointer ${
              date.toDateString() === new Date().toDateString()
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {date.getDate()}
            {events[date.toISOString().split('T')[0]] && (
              <Tooltip title={`${events[date.toISOString().split('T')[0]].length} Events`}>
                <div className="mt-2 text-sm text-blue-500 underline">
                  {events[date.toISOString().split('T')[0]].length} Events
                </div>
              </Tooltip>
            )}
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-6 bg-white rounded shadow-lg max-w-md mx-auto mt-20">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Add Event</h2>
          <TextField
            label="Event Name"
            fullWidth
            placeholder="Enter event name"
            value={eventForm.name}
            onChange={(e) => handleEventChange('name', e.target.value)}
            className="mb-4"
          />
          <TextField
            label="Start Time"
            fullWidth
            placeholder="e.g., 10:00 AM"
            value={eventForm.startTime}
            onChange={(e) => handleEventChange('startTime', e.target.value)}
            className="mb-4"
          />
          <TextField
            label="End Time"
            fullWidth
            placeholder="e.g., 11:00 AM"
            value={eventForm.endTime}
            onChange={(e) => handleEventChange('endTime', e.target.value)}
            className="mb-4"
          />
          <TextField
            label="Description"
            fullWidth
            placeholder="Optional: Enter event details"
            value={eventForm.description}
            onChange={(e) => handleEventChange('description', e.target.value)}
            className="mb-4"
          />
          <Button variant="contained" color="primary" fullWidth onClick={saveEvent}>
            Save Event
          </Button>
        </div>
      </Modal>

      {selectedDate && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Events on {selectedDate.toLocaleDateString()}
          </h2>
          {(events[selectedDate.toISOString().split('T')[0]] || []).map((event, index) => (
            <div key={index} className="border p-4 mb-2 rounded-md bg-gray-50">
              <h3 className="font-bold text-gray-700">{event.name}</h3>
              <p className="text-gray-600">{event.startTime} - {event.endTime}</p>
              <p className="text-gray-600">{event.description}</p>
              <div className="flex gap-2 mt-2">
                <IconButton onClick={() => deleteEvent(selectedDate.toISOString().split('T')[0], index)}>
                  <Delete color="error" />
                </IconButton>
                <IconButton onClick={() => alert('Edit functionality coming soon!')}>
                  <Edit color="primary" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import socket from '../socket';

interface Event {
  title: string;
  date: string;
}

const Notifications: React.FC = () => {
  useEffect(() => {
    // Registration updates
    const handleRegistration = (msg: string) => {
      toast.success(msg);
    };

    // Event created
    const handleEventCreated = (event: Event) => {
      toast.success(`New Event: "${event.title}" (Scheduled for ${new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })})`);
    };

    // Event updated
    const handleEventUpdated = (event: Event) => {
      console.log(event);
      toast.success(`Event updated: "${event.title}" (Scheduled for ${new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })})`);
    };

    // Event deleted
    const handleEventDeleted = () => {
      toast.error(`Event deleted check for your registered events.`);
    };

    // Set up all listeners
    socket.on('registrationUpdate', handleRegistration);
    socket.on('event_created', handleEventCreated);
    socket.on('event_updated', handleEventUpdated);
    socket.on('event_deleted', handleEventDeleted);

    // Clean up function
    return () => {
      socket.off('registrationUpdate', handleRegistration);
      socket.off('event_created', handleEventCreated);
      socket.off('event_updated', handleEventUpdated);
      socket.off('event_deleted', handleEventDeleted);
    };
  }, []);

  return null; 
};

export default Notifications;
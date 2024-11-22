// Previous imports remain the same...

export function EventModal({ event, onClose }: EventModalProps) {
  const { user } = useAuth();
  const club = clubs.find(c => c.id === event.clubId);
  const isCoordinator = user?.id === club?.coordinatorId;
  const coordinator = users.find(u => u.id === club?.coordinatorId);
  const proposedBy = event.proposedBy ? users.find(u => u.id === event.proposedBy) : null;

  const handleEventResponse = (status: 'approved' | 'rejected') => {
    // Update event status
    event.status = status;
    
    // Show feedback
    const message = status === 'approved' 
      ? 'Event approved and now visible to students'
      : 'Event rejected';
    alert(message);
    
    onClose();
  };

  // Rest of the component remains the same with updated visibility logic...
}
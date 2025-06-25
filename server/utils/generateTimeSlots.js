function generateTimeSlots(startTime, endTime, duration) {
  const slots = [];
  let [startH, startM] = startTime.split(':').map(Number);
  let [endH, endM] = endTime.split(':').map(Number);

  let start = new Date();
  start.setHours(startH, startM, 0, 0);

  let end = new Date();
  end.setHours(endH, endM, 0, 0);

  while (start < end) {
    const slotStart = new Date(start);
    start.setMinutes(start.getMinutes() + duration);
    const slotEnd = new Date(start);

    slots.push({
      from: slotStart.toTimeString().substring(0, 5),
      to: slotEnd.toTimeString().substring(0, 5),
    });
  }

  return slots;
}

export default generateTimeSlots;
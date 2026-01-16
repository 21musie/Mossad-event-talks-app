document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule');
  const searchInput = document.getElementById('search');

  let talks = [];
  const startTime = new Date();
  startTime.setHours(10, 0, 0, 0);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const generateSchedule = (filteredTalks) => {
    scheduleContainer.innerHTML = '';
    let currentTime = new Date(startTime);

    filteredTalks.forEach((talk, index) => {
      const talkStartTime = new Date(currentTime);
      const talkEndTime = new Date(currentTime.getTime() + talk.duration * 60000);

      const scheduleItem = document.createElement('div');
      scheduleItem.classList.add('schedule-item');

      scheduleItem.innerHTML = `
        <div class="time">${formatTime(talkStartTime)} - ${formatTime(talkEndTime)}</div>
        <div class="title">${talk.title}</div>
        <div class="speakers">${talk.speakers.join(', ')}</div>
        <div class="categories">
          ${talk.categories.map(cat => `<span class="category">${cat}</span>`).join('')}
        </div>
        <div class="description">${talk.description}</div>
      `;
      scheduleContainer.appendChild(scheduleItem);
      
      currentTime = new Date(talkEndTime.getTime() + 10 * 60000); // 10 minute break

      if (index === 2) { // Lunch break after 3rd talk
        const lunchStartTime = new Date(talkEndTime);
        const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60000);
        const lunchBreak = document.createElement('div');
        lunchBreak.classList.add('schedule-item', 'break');
        lunchBreak.innerHTML = `<div class="time">${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</div><div>Lunch Break</div>`;
        scheduleContainer.appendChild(lunchBreak);
        currentTime = new Date(lunchEndTime.getTime() + 10 * 60000); // 10 minute break after lunch
      }
    });
  };

  const filterTalks = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTalks = talks.filter(talk => 
      talk.categories.some(cat => cat.toLowerCase().includes(searchTerm))
    );
    generateSchedule(filteredTalks);
  };

  fetch('/api/talks')
    .then(response => response.json())
    .then(data => {
      talks = data;
      generateSchedule(talks);
      searchInput.addEventListener('input', filterTalks);
    })
    .catch(error => {
      console.error('Error fetching talks:', error);
      scheduleContainer.innerHTML = '<p>Error loading talks. Please try again later.</p>';
    });
});

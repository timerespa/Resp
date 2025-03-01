document.addEventListener('DOMContentLoaded', function () {
    const startDate = new Date("2025-02-06T08:06:00");
    const interval = (1 * 60 * 60 * 1000) + (2 * 60 * 1000) + (30 * 1000);

    let nextDate = calculateNextDate();
    let lastDate = calculateLastDate();

    function calculateNextDate() {
        const now = new Date();
        let next = new Date(startDate);
        while (next <= now) {
            next = new Date(next.getTime() + interval);
        }
        return next;
    }

    function calculateLastDate() {
        const now = new Date();
        let last = new Date(startDate);
        while (last.getTime() + interval <= now.getTime()) {
            last = new Date(last.getTime() + interval);
        }
        return last;
    }

    function getNextDates(count) {
        const dates = [];
        let next = new Date(nextDate.getTime() + interval);
        for (let i = 0; i < count; i++) {
            dates.push(new Date(next));
            next = new Date(next.getTime() + interval);
        }
        return dates;
    }

    function updateTimer() {
        const now = new Date();
        const diffToNext = nextDate - now;
        const diffFromLast = now - lastDate;

        if (diffToNext <= 0) {
            lastDate = nextDate;
            nextDate = calculateNextDate();
        }

        const hoursToNext = Math.floor(diffToNext / (1000 * 60 * 60));
        const minutesToNext = Math.floor((diffToNext % (1000 * 60 * 60)) / (1000 * 60));
        const secondsToNext = Math.floor((diffToNext % (1000 * 60)) / 1000);

        const timeToNextString = hoursToNext > 0
            ? `${hoursToNext} godzin, ${minutesToNext} minut ${secondsToNext} sekund`
            : `${minutesToNext} minut, ${secondsToNext} sekund`;

        const hoursFromLast = Math.floor(diffFromLast / (1000 * 60 * 60));
        const minutesFromLast = Math.floor((diffFromLast % (1000 * 60 * 60)) / (1000 * 60));
        const secondsFromLast = Math.floor((diffFromLast % (1000 * 60)) / 1000);

        const timeFromLastString = hoursFromLast > 0
            ? `${hoursFromLast} godzin, ${minutesFromLast} minut, ${secondsFromLast} sekund`
            : `${minutesFromLast} minut, ${secondsFromLast} sekund`;

        document.getElementById('next-date').textContent = nextDate.toLocaleTimeString('pl-PL');
        document.getElementById('timer').textContent = timeToNextString;
        document.getElementById('last-timer').textContent = timeFromLastString;

        // Refresh page
        if (hoursToNext <= 0 && minutesToNext <= 0 && secondsToNext <= 0) {
            location.reload(); // Odśwież stronę
        }
    }

    function toggleList() {
        const listContainer = document.getElementById('next-dates-list');
        if (listContainer.classList.contains('hidden')) {
            const nextDates = getNextDates(12);
            const list = document.createElement('ul');

            nextDates.forEach(date => {
                const listItem = document.createElement('li');
                listItem.textContent = date.toLocaleTimeString('pl-PL');
                list.appendChild(listItem);
            });

            listContainer.innerHTML = '';
            listContainer.appendChild(list);
            listContainer.classList.remove('hidden');
        } else {
            listContainer.classList.add('hidden');
        }
    }

    function updateImage() {
        const selectedOption = document.querySelector('input[name="image-options"]:checked');
        const imageFrame = document.getElementById('image-frame');

        if (selectedOption) {
            const imagePath = selectedOption.dataset.image;
            imageFrame.innerHTML = `<img src="${imagePath}" alt="Selected Image">`;
            imageFrame.style.display = 'block';
        } else {
            imageFrame.style.display = 'none';
        }
    }

    function init() {
        updateTimer();
        setInterval(updateTimer, 1000);

        const toggleButton = document.getElementById('toggle-button');
        toggleButton.addEventListener('click', toggleList);

        const radioButtons = document.querySelectorAll('input[name="image-options"]');
        let lastChecked = null;

        radioButtons.forEach(button => {
            button.addEventListener('click', function () {
                if (this === lastChecked) {
                    this.checked = false;
                    lastChecked = null;
                } else {
                    lastChecked = this;
                }
                updateImage();
            });
        });

        const imageFrame = document.getElementById('image-frame');
        imageFrame.style.display = 'none';
    }

    init();
});

const homePage = document.getElementById('home-page-container');
const todoPage = document.getElementById('todo-page-container');
const moodPage = document.getElementById('mood-page-container');
const hoursPage = document.getElementById('hours-page-container');
const historyPage = document.getElementById('history-page-container');
const historyContainer = document.getElementById('history-content-container');
const inputListContainer = document.getElementById('input-list-container');
const hoursPageButton = document.getElementById('hours-page-button');
const startButton = document.getElementById('start-button');
const hoursSlider = document.getElementById('hours-slider');
const hoursDisplay = document.getElementById('hours-display');

inputListContainer.addEventListener('keydown', (e) => {
    const inputs = Array.from(inputListContainer.querySelectorAll('.input-box'));
    const currentInput = e.target;
    const currentIndex = inputs.indexOf(currentInput);

    if (e.key === 'Enter') {
        const value = currentInput.value.trim();
        
        if (value !== '') {
            e.preventDefault();

            const newInput = document.createElement('input');
            newInput.type = 'text';
            newInput.classList.add('input-box');
            inputListContainer.appendChild(newInput);
            newInput.focus();
        }
    }

    else if (e.key === 'Backspace') {
        if (currentInput.value === '' && currentIndex > 0) {
            e.preventDefault();
            inputListContainer.removeChild(currentInput);
            inputs[currentIndex - 1].focus();
        }
    }

    checkButtonVissibility();
});

inputListContainer.addEventListener('input', () => {
    checkButtonVissibility();
});

function checkButtonVissibility() {
    console.log("checking...");
    const inputs = Array.from(inputListContainer.querySelectorAll('.input-box'));
    const hasContent = inputs.some(input => input.value.trim().length > 0);

    if (hasContent) startButton.classList.remove('hidden');
    else startButton.classList.add('hidden');
}

startButton.addEventListener('click', () => {
    const inputs = Array.from(inputListContainer.querySelectorAll('.input-box'));
    const todayTasks = inputs
        .map(input => input.value.trim())
        .filter(value => value !== '');

    localStorage.setItem("todayTasks", JSON.stringify(todayTasks));
    console.log("saved", todayTasks);

    openTodoPage();
});

function openTodoPage() {
    homePage.classList.add('hidden');
    todoPage.classList.remove('hidden');

    setTimeout(openMoodPage, 3000);
}

function openMoodPage() {
    todoPage.classList.add('hidden');
    moodPage.classList.remove('hidden');

    moodPageSelect()
}

function moodPageSelect() {
    const moodRadios = document.querySelectorAll('input[name="mood"]');

    moodRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const mood = radio.value;
            localStorage.setItem('todayMood', mood);
            console.log(mood);

            openHoursPage();
        });
    });
}

function openHoursPage() {
    moodPage.classList.add('hidden');
    hoursPage.classList.remove('hidden');
}

hoursSlider.addEventListener('input', (e) => {
    const hours = e.target.value;
    hoursDisplay.textContent = `${hours}h`;
});

hoursPageButton.addEventListener('click', () => {
    const hours = parseFloat(hoursSlider.value);
    localStorage.setItem('todayHours', hours);
    console.log(hours);
    
    saveToHistory();
});

function saveToHistory() {
    const todayTasks = JSON.parse(localStorage.getItem('todayTasks'));
    const mood = localStorage.getItem('todayMood');
    const hours = localStorage.getItem('todayHours');

    const todayEntry = {
        date: new Date().toISOString().split('T')[0],
        tasks: todayTasks,
        mood: mood,
        hours: hours
    };

    let history = JSON.parse(localStorage.getItem('history')) || [];

    history.unshift(todayEntry);

    localStorage.setItem('history', JSON.stringify(history));

    localStorage.removeItem('todayTasks');
    localStorage.removeItem('todayMood');
    localStorage.removeItem('todayHours');

    console.log('saved to history', todayEntry);

    openHistoryPage();
}

function openHistoryPage() {
    hoursPage.classList.add('hidden');
    historyPage.classList.remove('hidden');

    renderHistoryPage();
}

function renderHistoryPage() {
    const history = JSON.parse(localStorage.getItem('history')) || [];

    historyContainer.innerHTML = '';

    if (history.length === 0) {
        historyContainer.innerHTML = '<p>No history yet. Start tracking your wins!</p>';
        return;
    }

    const moodEmojis = {
        'awesome': '🔥',
        'normal': '😐',
        'low': '😓'
    };

    history.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('history-day');

        const date = new Date(day.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });

        const dayHeader = document.createElement('div');
        dayHeader.classList.add('history-header');
        dayHeader.textContent = `${formattedDate} - ${day.hours}h - ${moodEmojis[day.mood]} ${day.mood.charAt(0).toUpperCase() + day.mood.slice(1)}`;

        const tasksList = document.createElement('ul');
        tasksList.classList.add('history-tasks-container');

        day.tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('history-task-item');
            taskItem.textContent = task;
            tasksList.appendChild(taskItem);
        });

        dayDiv.appendChild(dayHeader);
        dayDiv.appendChild(tasksList);
        historyContainer.appendChild(dayDiv);
    });
}
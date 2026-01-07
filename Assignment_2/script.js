// DOM Elements
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const dateDisplay = document.getElementById('date-display');
const emptyState = document.getElementById('empty-state');
const filterBtns = document.querySelectorAll('.filter-btn');

// State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Initialize
function init() {
    updateDate();
    renderTasks();
}

// Update Date Display
function updateDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const today = new Date();
    dateDisplay.textContent = today.toLocaleDateString('en-US', options);
}

// Save to Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Add Task
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = input.value.trim();
    if (taskText) {
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        input.value = '';
        input.focus();
    }
});

// Render Tasks
function renderTasks() {
    todoList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
        if(tasks.length > 0 && currentFilter !== 'all') {
             emptyState.textContent = `No ${currentFilter} tasks`;
        } else if (tasks.length === 0) {
             emptyState.textContent = "No tasks found. Enjoy your day!";
        }
    } else {
        emptyState.style.display = 'none';
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', task.id);
            
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text" contenteditable="${!task.completed}">${task.text}</span>
                <div class="actions">
                    <button class="btn-icon btn-edit" title="Edit"><i class="fas fa-pen"></i></button>
                    <button class="btn-icon btn-delete" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            `;

            // Event Listeners for Item
            const checkbox = li.querySelector('.checkbox');
            checkbox.addEventListener('change', () => toggleTask(task.id));

            const deleteBtn = li.querySelector('.btn-delete');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            const editBtn = li.querySelector('.btn-edit');
            const taskSpan = li.querySelector('.task-text');
            
            // Edit Focus
            editBtn.addEventListener('click', () => {
               if(!task.completed) {
                   taskSpan.focus();
               }
            });

            // Save Edit on Blur or Enter
            taskSpan.addEventListener('blur', () => updateTaskText(task.id, taskSpan.textContent));
            taskSpan.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    taskSpan.blur();
                }
            });

            todoList.appendChild(li);
        });
    }
}

// Toggle Task Completion
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
}

// Delete Task
function deleteTask(id) {
    if(confirm('Are you sure you want to delete this task?')) {
        // Animation hook could go here
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
    }
}

// Update Task Text
function updateTaskText(id, newText) {
    const text = newText.trim();
    if(text) {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, text: text } : task
        );
    } else {
        // Revert or delete if empty? Let's delete if empty for better UX
        deleteTask(id);
    }
    saveTasks();
}

// Filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

// Run Init
init();

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const categoryInput = document.getElementById('categoryInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');

    addTaskButton.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskAction);
    document.querySelector('.filter-section').addEventListener('click', filterTasks);

    loadTasksFromStorage();

    function addTask() {
        const taskText = taskInput.value.trim();
        const category = categoryInput.value;
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;

        if (taskText === '') return;

        const li = document.createElement('li');
        li.dataset.category = category;
        li.dataset.dueDate = dueDate;
        li.dataset.priority = priority;
        li.classList.add(priority.toLowerCase());

        li.innerHTML = `
            <span>${taskText}</span>
            <span class="category">${category}</span>
            <span class="due-date">${dueDate}</span>
            <button>Edit</button>
            <button>Delete</button>
        `;

        taskList.appendChild(li);
        taskInput.value = '';
        dueDateInput.value = '';
        saveTasksToStorage();
    }

    function handleTaskAction(e) {
        if (e.target.textContent === 'Delete') {
            e.target.parentElement.remove();
            saveTasksToStorage();
        } else if (e.target.textContent === 'Edit') {
            editTask(e.target.parentElement);
        }
    }

    function editTask(taskItem) {
        const taskText = taskItem.querySelector('span').textContent;
        const category = taskItem.dataset.category;
        const dueDate = taskItem.dataset.dueDate;
        const priority = taskItem.dataset.priority;

        taskInput.value = taskText;
        categoryInput.value = category;
        dueDateInput.value = dueDate;
        priorityInput.value = priority.charAt(0).toUpperCase() + priority.slice(1);

        taskItem.remove();
        saveTasksToStorage();
    }

    function filterTasks(e) {
        if (e.target.tagName !== 'BUTTON') return;
        const filter = e.target.dataset.filter;
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach(task => {
            if (filter === 'all' || task.dataset.category === filter) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    }

    function saveTasksToStorage() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(taskItem => {
            tasks.push({
                text: taskItem.querySelector('span').textContent,
                category: taskItem.dataset.category,
                dueDate: taskItem.dataset.dueDate,
                priority: taskItem.dataset.priority
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasksFromStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks) {
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.dataset.category = task.category;
                li.dataset.dueDate = task.dueDate;
                li.dataset.priority = task.priority;
                li.classList.add(task.priority.toLowerCase());
                li.innerHTML = `
                    <span>${task.text}</span>
                    <span class="category">${task.category}</span>
                    <span class="due-date">${task.dueDate}</span>
                    <button>Edit</button>
                    <button>Delete</button>
                `;
                taskList.appendChild(li);
            });
        }
    }
});

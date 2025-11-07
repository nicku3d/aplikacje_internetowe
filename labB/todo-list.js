"use strict";

const NO_ERROR = 0;
const ERROR_NAME = 1;
const ERROR_DATE = 2;

const todoList = {
    isInit: false,
    tasks: [],
    filteredTasks: [],
    searchTerm: '',

    init: function() {
        if (!todoList.isInit) {
            todoList.draw();
            todoList.isInit = true;
            const search = document.getElementById('search');
            search.addEventListener('input', () => {
                const searchTerm = search.value.trim();
                todoList.search(searchTerm);
            });
        }
    },

    deleteTask: function (id) {
        this.tasks.splice(id, 1);
        this.draw();
    },

    addTask: function () {
        const taskName = document.getElementById('task');
        const deadline = document.getElementById('deadline');
        const errorNumber = this.validateAndGetErrorNumber(taskName.value, deadline.value);
        this.toggleError(errorNumber);
        if (errorNumber == NO_ERROR) {
            // if no error then task can be added
            this.tasks.push({name: taskName.value, deadline: deadline.value});
            //clear input
            document.getElementById('task').value = '';
            document.getElementById('deadline').value = '';
        }

        this.draw();
    },

    editTask: function (e, id) {
        const taskNode = document.getElementById('task' + id);
        taskNode.className = 'task editing';
        taskNode.innerText = '';

        const inputName = document.createElement('input');
        inputName.type='text';
        inputName.id='edit-name' + id;
        inputName.value = this.tasks[id].name;
        taskNode.append(inputName);

        const inputDeadline = document.createElement('input');
        inputDeadline.type='date';
        inputDeadline.id='edit-deadline' + id;
        inputDeadline.value = this.tasks[id].deadline;
        taskNode.append(inputDeadline);

        const saveEditButton = document.createElement('button');
        saveEditButton.innerText = 'zapisz';
        saveEditButton.onclick = function () {
            const name = document.getElementById('edit-name' + id);
            const deadline = document.getElementById('edit-deadline' + id);
            todoList.editTaskValues(id, name.value, deadline.value);
        };

        const cancelEditButton = document.createElement('button');
        cancelEditButton.innerText = 'anuluj'
        cancelEditButton.onclick = function () {
            todoList.draw();
        }

        taskNode.append(saveEditButton);
        taskNode.append(cancelEditButton);
    },

    toggleError(errorCode = 0) {
        const warningElement = document.getElementById('warning');
        switch (errorCode) {
            case ERROR_DATE:
                warningElement.innerText = 'Data musi być pusta albo w przyszłości.';
                warningElement.style.display = 'block';
                break;
            case ERROR_NAME:
                warningElement.innerText = 'Zadanie musi mić co najmniej 3 znaki i nie więcej niż 255 znaków.';
                warningElement.style.display = 'block';
                break;
            case NO_ERROR:
            default:
                warningElement.innerText = '';
                warningElement.style.display = 'none';
                break;
        }
    },

    validateAndGetErrorNumber(name, deadline) {
        if (name.length < 3 || name.length > 255) {
            return ERROR_NAME;
        }

        if (deadline) {
            const deadlineDate = new Date(deadline);
            const today = new Date();
            today.setHours(0,0,0,0);
            deadlineDate.setHours(0,0,0,0);

            return deadlineDate >= today ? NO_ERROR: ERROR_DATE;
        }

        return NO_ERROR;
    },

    editTaskValues: function(id, name, deadline) {
        const errorNumber = this.validateAndGetErrorNumber(name, deadline);
        this.toggleError(errorNumber);

        if (errorNumber == NO_ERROR) {
            const taskToEdit = this.tasks[id];
            taskToEdit.name = name;
            taskToEdit.deadline = deadline;
        }
        this.draw();
    },

    draw: function()
    {
        //synchronize with localstorage
        if (this.tasks.length == 0) {
            const localStorageTasks = localStorage.getItem('tasks');
            this.tasks = JSON.parse(localStorageTasks);
        } else {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }
        const element = document.getElementById('tasks');
        element.innerText = '';
        const tasks = this.searchTerm != '' ? this.filteredTasks : this.tasks;
        for (const [index, task] of tasks.entries()) {
            this.createTaskElement(element, index, task.name, task.deadline);
        }
    },

    createTaskElement: function(parent, id, name, deadline) {
        const task = document.createElement('div');
        task.className = 'task';
        task.id = 'task' + id;

        const valuesContainer = document.createElement('span');
        valuesContainer.className = 'values-container';

        const textElement = document.createElement('span');
        textElement.className = 'task-name';
        if (this.searchTerm != '') {
            textElement.innerHTML = name.replace(this.searchTerm, "<mark>" + this.searchTerm + "</mark>")
        } else {
            textElement.innerText = name;
        }
        valuesContainer.append(textElement);
        // task.ondblclick = function(e) {
        //     // if (e.target.matches('.task')) {
        //     //     todoList.editTask(e, id)
        //     // }
        // };
        // // task.onblur = function(e) {
        // //     task.innerText = '';
        // // };

        const deadlineElement = document.createElement('span');
        deadlineElement.className = 'deadline';
        deadlineElement.innerText = deadline;
        valuesContainer.append(deadlineElement);

        task.append(valuesContainer);

        const btnContainer = document.createElement('span');
        btnContainer.className = 'btn-container'

        const editButton = document.createElement('button');
        editButton.innerText = 'edytuj';
        editButton.onclick = function(e) { todoList.editTask(e, id) };
        btnContainer.append(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'usuń';
        deleteButton.onclick = function() { todoList.deleteTask(id) };
        btnContainer.append(deleteButton);

        task.append(btnContainer);

        parent.append(task);
    },

    search: function (searchTerm) {
        if (searchTerm.length < 2) {
            this.searchTerm = '';
            this.draw();
            return;
        }

        this.searchTerm = searchTerm;
        const filterFunction = function (task) {
            return task.name.includes(todoList.searchTerm);
        };
        this.filteredTasks = this.tasks.filter(filterFunction);
        this.draw();
    }
}

document.addEventListener('DOMContentLoaded', todoList.init);



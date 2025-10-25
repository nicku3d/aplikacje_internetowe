"use strict";

const todoList = {
    isInit: false,
    tasks: [],
    filteredTasks: [],
    searchTerm: '',

    init: function() {
        if (!todoList.isInit) {
            console.log('init...');
            todoList.draw();
            todoList.isInit = true;
        }
    },

    deleteTask: function (id) {
        console.log('DELETE ID:' + id);
        this.tasks.splice(id, 1);
        this.draw();
    },

    addTask: function () {
        const taskName = document.getElementById('task');
        const deadline = document.getElementById('deadline');
        //todo clear deadline input after add i guess?
        console.log('ADD:' + taskName.value + " " + deadline.value);
        this.tasks.push({name: taskName.value, deadline: deadline.value});
        this.draw();
    },

    editTask: function (e, id) {
        //todo kliknięcie na dowolną pozycję listy zmienia ją w pole edycji; kliknięcie poza pozycję listy zapisuje zmiany
        console.log('EDIT ID:' + id);
        const taskNode = e.target.parentNode;
        console.log(taskNode);
        taskNode.innerText = '';
        const inputName = document.createElement('input');
        inputName.type='text';
        inputName.id='edit-name';
        taskNode.append(inputName);

        const inputDeadline = document.createElement('input');
        inputDeadline.type='date';
        inputDeadline.id='edit-deadline';
        taskNode.append(inputDeadline);

        const saveEditButton = document.createElement('button');
        saveEditButton.text = 'zapisz edycje';
        //todo mozna dodac guzik anulujacy edycje - proste - po prostu robi draw()
        saveEditButton.onclick = function () {
            const name = document.getElementById('edit-name');
            const deadline = document.getElementById('edit-deadline');
            todoList.editTaskValues(id, name.value, deadline.value);
        };
        taskNode.append(saveEditButton);
    },

    isTaskDataValid(name, deadline) {
        //todo co zrobic jesli cos jest nie tak? jak wyswietlic komunikat
        if (name.length < 3 && name.length > 255) {
            return false;
        }

        if (deadline) {
            const deadlineDate = new Date(deadline);
            const today = new Date();
            today.setHours(0,0,0,0);
            deadlineDate.setHours(0,0,0,0);

            return deadlineDate >= today;
        }

        return true;
    },

    editTaskValues: function(id, name, deadline) {
        const taskToEdit = this.tasks[id];
        taskToEdit.name = name;
        taskToEdit.deadline = deadline;
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

        const textElement = document.createElement('span');
        textElement.className = 'task-name';
        if (this.searchTerm != '') {
            textElement.innerHTML = name.replace(this.searchTerm, "<mark>" + this.searchTerm + "</mark>")
        } else {
            textElement.innerText = name;
        }
        task.append(textElement);

        const deadlineElement = document.createElement('span');
        deadlineElement.className = 'deadline';
        deadlineElement.innerText = deadline;
        task.append(deadlineElement);

        const editButton = document.createElement('button');
        editButton.innerText = 'edit';
        editButton.onclick = function(e) { todoList.editTask(e, id) };
        task.append(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'delete';
        deleteButton.onclick = function() { todoList.deleteTask(id) };
        task.append(deleteButton);

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
        console.debug(this.filteredTasks);
        this.draw();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    todoList.init();
    //todo przeniesc wszystko po init do init xd
    const search = document.getElementById('search');
    search.addEventListener('input', () => {
        const searchTerm = search.value.trim();
        todoList.search(searchTerm);
    });
});



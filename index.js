let modalForm = document.getElementById('modal');
let addNewTask = document.getElementById('add_new_task');
let closeModal = document.getElementById('close_btn');
let textInput = document.getElementById('task_name');
let msg = document.getElementById('msg');
let dateInput = document.getElementById('task_date');
let select = document.getElementById('select');
let description = document.getElementById('task_description');
let tasks = document.getElementById('tasks_list');
let closeBtn = document.getElementById('close_modal');
let add = document.getElementById('add_task');
let filterStatusSelect = document.getElementById('select_task');

filterStatusSelect.addEventListener('change', () => {
    createTask();
});

let data = JSON.parse(localStorage.getItem("data")) || [];
let currentTaskIndex = null;

addNewTask.addEventListener("click", () => {
    modalForm.style.display = "flex";
});

closeModal.addEventListener("click", () => closeModalWindow());
closeBtn.addEventListener("click", () => closeModalWindow());

let closeModalWindow = () => {
    modalForm.style.display = "none";
}

window.addEventListener("click", (e) => {
    if (e.target == modalForm) {
        closeModalWindow();
    }
});

add.addEventListener("click", () => {
    if (textInput.value.trim() === "") {
        msg.innerHTML = "Заполните поле заголовка!";
    } else {
        msg.innerHTML = "";
        saveData();
        closeModalWindow();
    }
});

let saveData = () => {
    if (currentTaskIndex !== null) {
        data[currentTaskIndex] = {
            text: textInput.value.trim(),
            date: dateInput.value,
            status: select.value,
            description: description.value.trim(),
            completed: data[currentTaskIndex].completed
        };
        currentTaskIndex = null;
    } else {
        data.push({
            text: textInput.value.trim(),
            date: dateInput.value,
            status: select.value,
            description: description.value.trim(),
            completed: false
        });
    }
    localStorage.setItem("data", JSON.stringify(data));
    createTask();
    resetForm();
};

let createTask = () => {
    tasks.innerHTML = "";
    let filterValue = select.value;
    let filterStatusValue = filterStatusSelect.value;

    let filteredData = data.filter(task => {
        if (filterStatusValue === 'Срочное') {
            return task.status === 'Срочное';
        } else if (filterStatusValue === 'Не срочное') {
            return task.status === 'Не срочное';
        }
        return true;
    });

    const sortedData = filteredData.sort((a, b) => a.completed - b.completed);

    sortedData.forEach((task, index) => {
        tasks.innerHTML += `
        <div id="${index}" class="${task.completed ? 'completed' : ''}">
            <div class="task_content">
                <span class="task_title">${task.text}</span>
                <span class="small">${task.date}</span>
                <p>${task.status}</p>
                <p>${task.description}</p>
                <div class="br"></div>
            </div>
            <div class="options">
                <input type="checkbox" onchange="toggleTask(${data.indexOf(task)})" ${task.completed ? 'checked' : ''}>
                <i onClick="editTask(${data.indexOf(task)})" class="fas fa-edit" ${task.completed ? 'style="pointer-events: none; opacity: 0.5;"' : ''}></i>
                <i onClick="deleteTask(${data.indexOf(task)})" class="fas fa-trash-alt" ${task.completed ? 'style="pointer-events: none; opacity: 0.5;"' : ''}></i>
            </div>
        </div>`;
    });
};

let resetForm = () => {
    textInput.value = "";
    dateInput.value = "";
    select.value = "Срочное";
    description.value = "";
};

window.deleteTask = (index) => {
    data.splice(index, 1);
    localStorage.setItem("data", JSON.stringify(data));
    createTask();
};

window.editTask = (index) => {
    currentTaskIndex = index;
    let task = data[index];
    textInput.value = task.text;
    dateInput.value = task.date;
    select.value = task.status;
    description.value = task.description;
    modal.style.display = "flex";
};

window.toggleTask = (index) => {
    data[index].completed = !data[index].completed;
    localStorage.setItem("data", JSON.stringify(data));
    createTask();
};

createTask();
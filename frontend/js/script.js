/* =========================
   REGISTER
========================= */

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const name =
                document.getElementById("name").value;

            const email =
                document.getElementById("email").value;

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            try {

                const response = await fetch(
                    "http://localhost:5000/api/auth/register",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            name,
                            email,
                            password
                        })
                    }
                );

                const data =
                    await response.json();

                alert(data.message);

                if (response.ok) {
                    window.location.href =
                        "login.html";
                }

            } catch (error) {
                console.log(error);
            }

        }
    );
}

/* =========================
   LOGIN
========================= */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const email =
                document.getElementById("loginEmail").value;

            const password =
                document.getElementById("loginPassword").value;

            try {

                const response = await fetch(
                    "http://localhost:5000/api/auth/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );

                const data =
                    await response.json();

                alert(data.message);

                if (response.ok) {

                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user)
                    );

                    window.location.href =
                        "dashboard.html";
                }

            } catch (error) {
                console.log(error);
            }

        }
    );
}

/* =========================
   TASKS
========================= */

function addTask() {

    let taskInput =
        document.getElementById("taskInput");

    let taskValue =
        taskInput.value.trim();

    if (taskValue === "") {
        alert("Please enter a task");
        return;
    }

    let li =
        document.createElement("li");

    li.innerHTML = `
        ${taskValue}
        <button class="delete-btn">
            Delete
        </button>
    `;

    li.querySelector("button")
        .addEventListener(
            "click",
            function () {
                li.remove();
            }
        );

    document
        .getElementById("taskList")
        .appendChild(li);

    taskInput.value = "";
}

/* =========================
   DASHBOARD
========================= */

const API_URL =
    "http://localhost:5000/api/tasks";

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const user =
            JSON.parse(
                localStorage.getItem("user")
            );

        if (
            user &&
            document.getElementById("userName")
        ) {
            document.getElementById(
                "userName"
            ).textContent = user.name;
        }

        if (
            document.getElementById(
                "tasksContainer"
            )
        ) {
            loadTasks();
        }
    }
);

async function loadTasks() {

    try {

        const response =
            await fetch(API_URL);

        const tasks =
            await response.json();

        const container =
            document.getElementById(
                "tasksContainer"
            );

        container.innerHTML = "";

        tasks.forEach(task => {

            container.innerHTML += `
                <div class="task-card">

                    <div>
                        <h3>${task.title}</h3>
                        <p>${task.description || ""}</p>
                    </div>

                    <div class="task-actions">

                        <button
                        class="edit-btn"
                        onclick="editTask('${task._id}')">
                        Edit
                        </button>

                        <button
                        class="delete-btn"
                        onclick="deleteTask('${task._id}')">
                        Delete
                        </button>

                    </div>

                </div>
            `;
        });

    } catch (error) {

        console.log(error);

    }
}

async function createTask() {

    const title =
        prompt("Enter task title");

    if (!title) return;

    const description =
        prompt(
            "Enter description"
        );

    await fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type":
                "application/json"
        },

        body: JSON.stringify({
            title,
            description
        })
    });

    loadTasks();
}

async function deleteTask(id) {

    await fetch(
        `${API_URL}/${id}`,
        {
            method: "DELETE"
        }
    );

    loadTasks();
}

async function editTask(id) {

    const title =
        prompt(
            "Enter new title"
        );

    if (!title) return;

    await fetch(
        `${API_URL}/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                title
            })
        }
    );

    loadTasks();
}

function logoutUser() {

    localStorage.removeItem("user");

    window.location.href =
        "login.html";
}
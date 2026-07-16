const BASE_URL =
    "https://task-management-system-production-7c82.up.railway.app";

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
                    `${BASE_URL}/api/auth/register`,
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
                    `${BASE_URL}/api/auth/login`,
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

                    localStorage.setItem(
                        "token",
                        data.token
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
   DASHBOARD TASKS
========================= */

const API_URL =
    `${BASE_URL}/api/tasks`;

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

        if (!container) return;

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
        prompt("Enter description");

    try {

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

    } catch (error) {

        console.log(error);

    }
}

async function deleteTask(id) {

    try {

        await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        loadTasks();

    } catch (error) {

        console.log(error);

    }
}

async function editTask(id) {

    const title =
        prompt("Enter new title");

    if (!title) return;

    try {

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

    } catch (error) {

        console.log(error);

    }
}

function logoutUser() {

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href =
        "login.html";
}
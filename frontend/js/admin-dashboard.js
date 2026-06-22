const admin =
    JSON.parse(
        localStorage.getItem("admin")
    );

if (!admin) {
    window.location.href = "home.html";
}
document.getElementById(
    "adminName"
).textContent =
    "Welcome " + admin.username;

      function loadPage(page, btnElement) {
            document.getElementById("contentFrame").src = page;
            
            // Remove active classes from all menu buttons
            document.querySelectorAll('.menu-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Set active status on currently clicked button
            if(btnElement) {
                btnElement.classList.add('active');
            }
        }
        // Secure Logout Trigger
        function logout() {
            localStorage.clear();
            alert("Secure Logout Initiated: You have successfully terminated this session.");
            window.location.href = "index.html";
        }
/*async function loadStats() {

    try {

        const response =
            await fetch(
                "http://localhost:5250/api/admin/stats"
            );

        const data =
            await response.json();

        document.getElementById(
            "usersCount"
        ).textContent =
            data.totalUsers;

        document.getElementById(
            "attemptsCount"
        ).textContent =
            data.totalAttempts;

        document.getElementById(
            "highestScore"
        ).textContent =
            data.highestScore + "%";

        document.getElementById(
            "averageScore"
        ).textContent =
            data.averageScore + "%";

    } catch (error) {

        console.error(error);

    }

}

loadStats();

async function loadUsers() {

    try {

        const response = await fetch(
            "http://localhost:5250/api/admin/users"
        );

        const users = await response.json();

        const tbody =
            document.getElementById(
                "usersTableBody"
            );

        tbody.innerHTML = "";

        users.forEach(user => {

            tbody.innerHTML += `
                <tr>
                    <td>${user.uid}</td>
                    <td>${user.full_name}</td>
                    <td>${user.email}</td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);

    }

}

loadUsers(); 

document
    .getElementById("questionForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const questionData = {
            section:
                document.getElementById("section").value,

            question:
                document.getElementById("question").value,

            option1:
                document.getElementById("option1").value,

            option2:
                document.getElementById("option2").value,

            option3:
                document.getElementById("option3").value,

            option4:
                document.getElementById("option4").value,

            answer_index:
                document.getElementById("answer_index").value,
            category:
                document.getElementById("category").value,

            difficulty:
                document.getElementById("difficulty").value

        };
        console.log(questionData);
        const response = await fetch(
            "http://localhost:5250/api/admin/questions",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body:
                    JSON.stringify(questionData)
            }
        );

        const data = await response.json();

        alert(data.message);

    });
document
    .getElementById("searchUserBtn")
    .addEventListener(
        "click",
        searchUserAnalytics
    );

async function searchUserAnalytics() {

    const uid =
        document
            .getElementById("uidInput")
            .value
            .trim();

    if (!uid) {

        alert("Enter UID");

        return;
    }

    try {

        const response =
            await fetch(
                `http://localhost:5250/api/admin/user-analytics/${uid}`
            );

        const data =
            await response.json();

        if (!data.success) {

            alert(data.message);

            return;
        }
        let historyHTML = `
    <h4>Quiz History</h4>

    <table border="1" width="100%">
        <tr>
            <th>Date</th>
            <th>Score</th>
        </tr>
`;

        if (data.history && data.history.length > 0) {

            data.history.forEach(item => {

                historyHTML += `
        <tr>
            <td>${new Date(item.completed_at).toLocaleDateString()}</td>
            <td>${item.percentage}%</td>
        </tr>
        `;
            });

        } else {

            historyHTML += `
    <tr>
        <td colspan="2">No quiz history found</td>
    </tr>
    `;
        }

        historyHTML += "</table>";
        document
            .getElementById(
                "analyticsResult"
            ).innerHTML = `

        <div class="user-card">

            <h3>${data.name}</h3>

            <p>
                <strong>UID:</strong>
                ${data.uid}
            </p>

            <p>
                <strong>Email:</strong>
                ${data.email}
            </p>

            <hr>

            <p>
                <strong>Total Attempts:</strong>
                ${data.totalAttempts}
            </p>

            <p>
                <strong>Average Score:</strong>
                ${data.averageScore}%
            </p>

            <p>
                <strong>Highest Score:</strong>
                ${data.highestScore}%
            </p>

        </div>

    ${historyHTML}
        `;


    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}
*/
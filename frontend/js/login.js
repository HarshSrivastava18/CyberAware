document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const submitBtn = document.getElementById("loginBtn");
    try {
        const response = await fetch("https://cyberaware-vnpf.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        const data = await response.json();

        if (response.ok) {

            showToast("✅ Login Successful!");

            // Save user data
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("uid", data.user.uid);
            // Redirect to dashboard
            // Hide login popup
            authModal.classList.remove("active");

            // Update UI
            showLoggedInUser();


        } else {
            alert(data.message || "Invalid Email or Password");
        }

    } catch (error) {
        console.error(error);
        alert("Server Error");
    }
});


document.getElementById("signupForm").addEventListener("submit", async function (e) {

    e.preventDefault();

    const full_name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const submitBtn = document.getElementById("signupBtn");

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Registering...";

    try {

        const response = await fetch(
            "https://cyberaware-vnpf.onrender.com/api/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    full_name,
                    email,
                    password
                })
            }
        );

        const result = await response.json();

        console.log(result);
  if (response.ok) {

            showToast("✅ Register Successful! Login to continue "
            );
 
           
            authModal.classList.remove("active");

           
      
        } else {

            alert(result.message);

            submitBtn.disabled = false;
            submitBtn.innerText = "Create Account";
        }

    } catch (error) {

        console.error(error);

        alert("Cannot connect to server");

        submitBtn.disabled = false;
        submitBtn.innerText = "Create Account";
    }
});
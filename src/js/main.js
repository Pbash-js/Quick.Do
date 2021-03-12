document.getElementById("submit").addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    var xhr = new XMLHttpRequest();

    xhr.onprogress = () => {
      if (this.readyState == 4) {
        document.querySelector(".loading").classList.remove("loading-animated");
      } else {
        document.querySelector(".loading").classList.add("loading-animated");
      }
    };

    var timeout;

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        const authToken = response.auth_token;
        localStorage.setItem("authtoken", authToken);
        window.location = "tasks.html";
      } else if ((this.status = 404)) {
        localStorage.setItem("authtoken", null);
        console.log("not found");
        document.getElementById("title").innerHTML = "Invalid Credentials";
        var title = document.getElementById("title");
        title.innerHTML = "Invalid Credentials";
        var timeout = setTimeout(() => {
          title.innerHTML = "Login";
        }, 2000);
        document.querySelector(".loading").classList.remove("loading-animated");
      }
    };

    xhr.onerror = () => {
      document.querySelector(".loading").classList.remove("loading-animated");
      localStorage.setItem("authtoken", null);
    };
    const json = {
      email: email,
      password: password,
    };

    xhr.open("POST", "https://sm-prod2.any.do/login");

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(json));
  } catch (error) {
    console.error(error.message);
    document.getElementById("title").innerHTML = "fault";
  }
});

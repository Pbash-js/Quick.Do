var tasks = [];

const populateTasks = () => {
  document.getElementById("tasks").innerHTML = null;

  tasks.forEach((item) => {
    if (item.status == "CHECKED") {
      document.getElementById("tasks").innerHTML +=
        "<li class='checked'>" + item.title + "</li>";
    } else {
      document.getElementById("tasks").innerHTML +=
        "<li class='unchecked'>" + item.title + "</li>";
    }
  });
};

document.getElementById("logout").addEventListener("click", () => {
  localStorage.setItem("authtoken", null);
  window.location = "index.html";
});

document.getElementById("sort").addEventListener("click", () => {
  document.querySelector(".sortby").classList.toggle("sortbydisplayed");
});

document.getElementById("sort-name").addEventListener("click", () => {
  tasks.sort((a, b) => {
    let fa = a.title.toLowerCase(),
      fb = b.title.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
  populateTasks();
});

document.getElementById("sort-date").addEventListener("click", () => {
  tasks.sort((a, b) => b.creationDate - a.creationDate);
  populateTasks();
});

document.getElementById("sort-dueDate").addEventListener("click", () => {
  tasks.sort((a, b) => b.dueDate - a.dueDate);
  populateTasks();
});

window.onload = () => {
  document.querySelector(".loading").classList.add("loading-animated");

  var xhr = new XMLHttpRequest();

  xhr.onprogress = () => {
    if (this.readyState == 4) {
      document.querySelector(".loading").classList.remove("loading-animated");
    }
  };

  if (localStorage.getItem("authtoken") == null) window.open("index.html");
  xhr.onload = () => {
    JSON.parse(xhr.responseText).models.task.items.forEach((item) => {
      tasks.push(item);
    });
    document.querySelector(".loading").classList.remove("loading-animated");
    populateTasks();
  };

  xhr.onerror = () => {
    document.querySelector(".loading").classList.remove("loading-animated");
    localStorage.setItem("authtoken", null);
  };

  const syncBody = (includeDone, includeDeleted) => ({
    syncId: 2,
    models: {
      attachment: {
        items: [],
      },
      category: {
        items: [],
      },
      label: {
        items: [],
      },
      sharedMember: {
        items: [],
      },
      task: {
        items: [],
        config: {
          includeDone: `${includeDone}`,
          includeDeleted: `${includeDeleted}`,
        },
      },
      taskNotification: {
        items: [],
      },
      userNotification: {
        items: [],
      },
    },
  });

  xhr.open("POST", "https://sm-prod2.any.do/api/v2/me/sync?updatedSince=0");
  xhr.setRequestHeader("X-Anydo-Auth", localStorage.getItem("authtoken"));
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.send(JSON.stringify(syncBody(false, false)));
};

// sync(options) {
//     options = options || {};

//     const defaultOptions = {
//       includeDone: false,
//       includeDeleted: false,
//       updateSince: 0,
//       models: syncSample(false, false),
//     };

//     _.defaults(options, defaultOptions);

//     return this.loginPromise.then(() => {
//       return request
//         .post({
//           uri: `${API_URL}/api/v2/me/sync?updatedSince=${options.updateSince}`,
//           headers: {
//             "X-Anydo-Auth": this.authToken,
//             "Content-type": "application/json",
//           },
//           body: JSON.stringify({ models: options.models }),
//         })
//         .then((res) => JSON.parse(res));
//     });
//   }

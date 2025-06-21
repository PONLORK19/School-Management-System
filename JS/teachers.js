document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-bar input");
  const cardGrid = document.querySelector(".card-grid");
  const modal = document.getElementById("addTeacherModal");
  const openBtn = document.getElementById("openModal");
  const closeBtn = document.getElementById("closeModal");
  const addBtn = document.getElementById("addTeacherBtn");
  const deleteBtn = document.getElementById("deleteSelected");

  let teacherList = JSON.parse(localStorage.getItem("teachers")) || [];

  // Render Teacher Cards
  function renderTeachers(data) {
    cardGrid.innerHTML = "";
    data.forEach((teacher, index) => {
      const card = document.createElement("div");
      card.className = "teacher-card";
      card.innerHTML = `
        <input type="checkbox" class="select-teacher" data-index="${index}" />
        <div class="top-green"></div>
        <div class="teacher-photo-wrapper">
          <img class="teacher-photo" src="${
            teacher.image || "img/teacher1.png"
          }" alt="Teacher" />

        </div>
        <div class="teacher-name teacher-name-text">${teacher.name}</div>
        <div class="card-body">
          <p>🎓 Grade: ${teacher.grade}</p>
          <p>Age: ${teacher.age} years</p>
          <p>Education: ${teacher.education}</p>
          <p>Status: ${teacher.status}</p>
        </div>
      `;
      cardGrid.appendChild(card);
    });
  }

  renderTeachers(teacherList);

  // Search Logic
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = searchInput.value.toLowerCase();
      const filtered = teacherList.filter((t) =>
        t.name.toLowerCase().includes(query)
      );
      renderTeachers(filtered);
    });
  }

  // Modal Controls
  openBtn.onclick = () => (modal.style.display = "flex");
  closeBtn.onclick = () => (modal.style.display = "none");
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };

  // Add Teacher
  addBtn.onclick = () => {
    const name = document.getElementById("name").value.trim();
    const grade = document.getElementById("grade").value.trim();
    const age = document.getElementById("age").value.trim();
    const education = document.getElementById("education").value.trim();
    const status = document.getElementById("status").value.trim();
    const imageInput = document.getElementById("teacherImage");
    const file = imageInput.files[0];

    if (!name || !grade || !age || !education || !status) {
      alert("Please fill all fields!");
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newTeacher = {
          name,
          grade,
          age,
          education,
          status,
          image: reader.result, // Base64 encoded image
        };
        teacherList.push(newTeacher);
        localStorage.setItem("teachers", JSON.stringify(teacherList));
        renderTeachers(teacherList);
        modal.style.display = "none";
        document.querySelectorAll("#addTeacherModal input").forEach((el) => {
          el.value = "";
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a teacher image!");
    }
  };

  // Delete Selected Teachers
  deleteBtn.onclick = () => {
    const checkboxes = document.querySelectorAll(".select-teacher:checked");
    if (checkboxes.length === 0) {
      alert("No teachers selected to delete.");
      return;
    }
    const indexes = Array.from(checkboxes).map((cb) =>
      parseInt(cb.dataset.index)
    );
    indexes.sort((a, b) => b - a).forEach((i) => teacherList.splice(i, 1));
    localStorage.setItem("teachers", JSON.stringify(teacherList));
    renderTeachers(teacherList);
  };
});

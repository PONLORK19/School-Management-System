document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openModal");
  const closeBtn =
    document.getElementById("closeClassModal") ||
    document.getElementById("closeModal");
  const modal = document.getElementById("addClassModal");
  const form = document.getElementById("classForm");
  const classListContainer = document.getElementById("classList");
  const classCount = document.getElementById("classCount");
  const studentCheckboxList = document.getElementById("studentCheckboxList");
  const deleteBtn = document.getElementById("deleteBtn");

  const savedClasses = JSON.parse(localStorage.getItem("classes")) || [];
  const teacherList = JSON.parse(localStorage.getItem("teachers")) || [];

  let selectedClassName = null;
  let editingIndex = null;

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      editingIndex = null;
      populateStudentCheckboxes();
      form.reset();
      modal.style.display = "flex";
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      form.reset();
      editingIndex = null;
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
    if (e.target === document.getElementById("classDetailModal"))
      document.getElementById("classDetailModal").style.display = "none";
  });

  document.getElementById("closeDetailModal").addEventListener("click", () => {
    document.getElementById("classDetailModal").style.display = "none";
  });

  function updateClassCount() {
    classCount.textContent = savedClasses.length;
  }

  function renderClassCards() {
    classListContainer.innerHTML = "";

    savedClasses.forEach((cls, index) => {
      const teacher = teacherList.find((t) => t.name === cls.teacher);
      const teacherImage = teacher?.image || "img/default-teacher.png";

      const card = document.createElement("div");
      card.className = "custom-class-card";
      card.setAttribute("data-index", index);
      card.innerHTML = `
        <img src="img/school-academy-logo.png" class="school-logo" alt="Logo" />
        <div class="class-info-wrapper">
          <div class="class-info-text">
            <p><strong>Teacher:</strong> <span>${cls.teacher}</span></p>
            <p><strong>On-site:</strong> <span>${
              cls.location || "Phnom Penh"
            }</span></p>
            <p><strong>Class code:</strong> <span>${
              cls.classcode || "N/A"
            }</span></p>
            <p><strong>Time:</strong> <span>${cls.startTime || "TBD"} - ${
        cls.endTime || "TBD"
      }</span></p>
            <p><strong>Students:</strong> <span>${
              cls.students?.length || 0
            }</span>
            &nbsp;&nbsp;&nbsp;&nbsp; <strong>Room:</strong> <span>${
              cls.room || "IJMO"
            }</span></p>
          </div>
          <img src="${teacherImage}" class="teacher-photo" alt="Teacher Photo" />
        </div>
      `;

      // ✅ Edit Class on Click
      card.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent click conflicts

        // Highlight selection
        document.querySelectorAll(".custom-class-card").forEach((el) => {
          el.classList.remove("selected-class");
        });
        card.classList.add("selected-class");

        selectedClassName = cls.classcode; // Store for deletion

        // If you want to open modal for editing when double clicked
        if (e.detail === 2) {
          editingIndex = index;
          modal.style.display = "flex";

          document.getElementById("classcode").value = cls.classcode || "";
          document.getElementById("teacherName").value = cls.teacher || "";
          document.getElementById("studentCount").value = cls.limit || "";
          document.getElementById("startTime").value = cls.startTime || "";
          document.getElementById("endTime").value = cls.endTime || "";
          document.getElementById("classroomType").value = cls.type || "";
          document.getElementById("roomName").value = cls.room || "";

          populateStudentCheckboxes(() => {
            const checkboxes = document.querySelectorAll(
              "#studentCheckboxList input[type=checkbox]"
            );
            checkboxes.forEach((cb) => {
              if (cls.students.includes(cb.value)) cb.checked = true;
            });
          });
        }
      });

      classListContainer.appendChild(card);
    });
  }

  function populateStudentCheckboxes(callback) {
    studentCheckboxList.innerHTML = "";
    const storedStudents = JSON.parse(localStorage.getItem("students")) || [];

    if (storedStudents.length === 0) {
      studentCheckboxList.innerHTML =
        "<p style='color:gray'>No students available</p>";
      return;
    }

    storedStudents.forEach((student) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <label>
          <input type="checkbox" value="${student.name}" />
          ${student.name} (${student.grade})
        </label>
      `;
      studentCheckboxList.appendChild(div);
    });

    if (callback) callback();
  }

  deleteBtn.addEventListener("click", () => {
    if (!selectedClassName) {
      alert("Please select a class to delete.");
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete "${selectedClassName}"?`
    );
    if (!confirmed) return;

    const index = savedClasses.findIndex(
      (cls) => cls.classcode === selectedClassName
    );
    if (index !== -1) {
      savedClasses.splice(index, 1);
      localStorage.setItem("classes", JSON.stringify(savedClasses));
      renderClassCards();
      updateClassCount();
      selectedClassName = null;
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const newClass = {
      classcode: document.getElementById("classcode").value,
      teacher: document.getElementById("teacherName").value,
      limit: document.getElementById("studentCount").value,
      startTime: document.getElementById("startTime").value,
      endTime: document.getElementById("endTime").value,
      type: document.getElementById("classroomType").value,
      room: document.getElementById("roomName").value,
      students: [
        ...document.querySelectorAll("#studentCheckboxList input:checked"),
      ].map((cb) => cb.value),
    };

    if (editingIndex !== null) {
      savedClasses[editingIndex] = newClass;
      editingIndex = null;
    } else {
      savedClasses.push(newClass);
    }

    localStorage.setItem("classes", JSON.stringify(savedClasses));
    renderClassCards();
    updateClassCount();
    modal.style.display = "none";
    form.reset();
  });

  const teacherSelect = document.getElementById("teacherName");
  if (teacherSelect) {
    teacherList.forEach((teacher) => {
      const option = document.createElement("option");
      option.value = teacher.name;
      option.textContent = teacher.name;
      teacherSelect.appendChild(option);
    });
  }

  // Initial render
  renderClassCards();
  updateClassCount();
});

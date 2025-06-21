document.addEventListener("DOMContentLoaded", () => {
  // Elements for students
  const studentForm = document.getElementById("studentForm");
  const studentTable = document.getElementById("studentTableBody");
  const addBtn = document.getElementById("addBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const studentModal = document.getElementById("addModal");
  const closeStudentModal = document.getElementById("closeModal");
  const studentCount = document.getElementById("studentCount");
  const searchInput = document.getElementById("studentSearch");

  // Elements for classes
  const classForm = document.getElementById("classForm");
  const classModal = document.getElementById("addClassModal");
  const openClassModal = document.getElementById("openModal");
  const closeClassModal =
    document.getElementById("closeClassModal") ||
    document.getElementById("closeModal");
  const classList = document.getElementById("classList");
  const classCount = document.getElementById("classCount");
  const studentCheckboxList = document.getElementById("studentCheckboxList");

  let students = [];
  let classes = [];

  // Utility: Save and Load
  function saveStudentsToStorage() {
    localStorage.setItem("students", JSON.stringify(students));
    studentCount.textContent = students.length;
  }

  function saveClassesToStorage() {
    localStorage.setItem("classes", JSON.stringify(classes));
    classCount.textContent = classes.length;
  }

  function loadStudentsFromStorage() {
    const stored = localStorage.getItem("students");
    if (stored) {
      students = JSON.parse(stored);
      students.forEach(renderStudent);
    }
    studentCount.textContent = students.length;
  }

  function loadClassesFromStorage() {
    const stored = localStorage.getItem("classes");
    if (stored) {
      classes = JSON.parse(stored);
      classes.forEach(renderClassCard);
    }
    classCount.textContent = classes.length;
  }

  // Render student row
  function renderStudent({ name, gender, grade, school, status }) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="student-check" /></td>
      <td>${name}</td>
      <td>${gender}</td>
      <td>${grade}</td>
      <td>${school}</td>
      <td><span class="status-active">${status}</span></td>
      <td>⋮</td>
    `;
    studentTable.appendChild(row);
  }

  // Render class card
  function renderClassCard(cls) {
    const studentsStr = Array.isArray(cls.students)
      ? cls.students.join(", ")
      : "None";
    const card = document.createElement("div");
    card.className = "class-card";
    card.innerHTML = `
      <div class="class-title">${cls.name}</div>
      <div class="class-info">
        Teacher: ${cls.teacher}<br/>
        Room Type: ${cls.type}<br/>
        Student Limit: ${cls.limit}<br/>
        Students: ${studentsStr}
      </div>
    `;
    classList.appendChild(card);
  }

  // Populate student checkboxes
  function populateStudentCheckboxes() {
    studentCheckboxList.innerHTML = "";
    students.forEach((student) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <label>
          <input type="checkbox" value="${student.name}" />
          ${student.name} (${student.grade})
        </label>
      `;
      studentCheckboxList.appendChild(div);
    });
  }

  // Open/close modals
  addBtn && (addBtn.onclick = () => (studentModal.style.display = "flex"));
  closeStudentModal &&
    (closeStudentModal.onclick = () => (studentModal.style.display = "none"));

  openClassModal &&
    (openClassModal.onclick = () => {
      populateStudentCheckboxes();
      classModal.style.display = "flex";
    });

  closeClassModal &&
    (closeClassModal.onclick = () => {
      classModal.style.display = "none";
      classForm.reset();
    });

  // Form submit - student
  studentForm &&
    (studentForm.onsubmit = (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const gender = document.getElementById("gender").value;
      const grade = document.getElementById("grade").value;
      const school = document.getElementById("school").value;

      const student = { name, gender, grade, school, status: "Active" };
      students.push(student);
      saveStudentsToStorage();
      renderStudent(student);

      studentForm.reset();
      studentModal.style.display = "none";
    });

  // Form submit - class
  classForm &&
    (classForm.onsubmit = (e) => {
      e.preventDefault();

      const name = document.getElementById("className").value;
      const teacher = document.getElementById("teacherName").value;
      const limit = document.getElementById("studentCount").value;
      const type = document.getElementById("classroomType").value;
      const selected = [
        ...document.querySelectorAll("#studentCheckboxList input:checked"),
      ].map((cb) => cb.value);

      const newClass = { name, teacher, limit, type, students: selected };
      classes.push(newClass);
      saveClassesToStorage();
      renderClassCard(newClass);

      classModal.style.display = "none";
      classForm.reset();
    });

  // Delete students
  deleteBtn &&
    (deleteBtn.onclick = () => {
      const selected = document.querySelectorAll(".student-check:checked");
      if (selected.length === 0) {
        alert("Please select at least one student to delete.");
        return;
      }

      selected.forEach((checkbox) => {
        const row = checkbox.closest("tr");
        const name = row.children[1].textContent;
        students = students.filter((s) => s.name !== name);
        row.remove();
      });

      saveStudentsToStorage();
    });

  // Search students
  searchInput &&
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const rows = studentTable.querySelectorAll("tr");
      rows.forEach((row) => {
        const name = row.children[1].textContent.toLowerCase();
        row.style.display = name.includes(query) ? "" : "none";
      });
    });

  // Load data
  loadStudentsFromStorage();
  loadClassesFromStorage();

  // Optional: click outside modal to close
  window.addEventListener("click", (e) => {
    if (e.target === studentModal) studentModal.style.display = "none";
    if (e.target === classModal) classModal.style.display = "none";
  });
});

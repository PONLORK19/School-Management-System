document.addEventListener("DOMContentLoaded", function () {
  const teachers = JSON.parse(localStorage.getItem("teachers")) || [];
  const students = JSON.parse(localStorage.getItem("students")) || [];
  const classes = JSON.parse(localStorage.getItem("classes")) || [];

  const studentCount = document.getElementById("studentCount");
  const teacherCount = document.getElementById("teacherCount");
  const classCount = document.getElementById("classCount");

  if (studentCount) studentCount.textContent = students.length;
  if (teacherCount) teacherCount.textContent = teachers.length;
  if (classCount) classCount.textContent = classes.length;

  // Get gender counts
  const boys = students.filter((s) => s.gender === "M").length;
  const girls = students.filter((s) => s.gender === "F").length;

  // Update chart
  new Chart(document.getElementById("genderChart"), {
    type: "doughnut",
    data: {
      labels: ["Boys", "Girls"],
      datasets: [
        {
          data: [boys, girls],
          backgroundColor: ["#6a6af4", "#f4c542"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "70%",
      plugins: { legend: { display: false } },
    },
  });

  // Update count text
  const boyText = document.getElementById("boyCount");
  const girlText = document.getElementById("girlCount");
  const totalText = document.getElementById("studentCount");

  if (boyText) boyText.textContent = `🔵 ${boys} (boys)`;
  if (girlText) girlText.textContent = `🟡 ${girls} (girls)`;
  if (totalText) totalText.textContent = students.length;

  // ⬇️ Calendar Logic
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const monthName = today.toLocaleString("default", { month: "long" });

  const calendarHeader = document.getElementById("calendarHeader");
  const calendarBody = document.getElementById("calendarBody");

  if (calendarHeader && calendarBody) {
    calendarHeader.innerHTML = `📅 ${monthName} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calendarBody.innerHTML = "";

    let date = 1;
    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        const cell = document.createElement("td");
        if (i === 0 && j < firstDay) {
          cell.innerHTML = "";
        } else if (date > daysInMonth) {
          cell.innerHTML = "";
        } else {
          if (date === today.getDate()) {
            cell.innerHTML = `<strong style="color:red">${date}</strong>`;
          } else {
            cell.textContent = date;
          }
          date++;
        }
        row.appendChild(cell);
      }

      calendarBody.appendChild(row);
      if (date > daysInMonth) break;
    }
  }
});

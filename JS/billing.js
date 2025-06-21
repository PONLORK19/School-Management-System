document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openPaymentModal");
  const closeBtn = document.getElementById("closePaymentModal");
  const modal = document.getElementById("paymentModal");
  const form = document.getElementById("paymentForm");
  const tableBody = document.getElementById("billingTableBody");

  openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("teacherName").value;
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;
    const total = document.getElementById("totalAmount").value;
    const status = document.getElementById("status").value;

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${name}</td>
            <td>${start}</td>
            <td>${end}</td>
            <td>$${total}</td>
            <td><span class="status-label ${status}">${
      status.charAt(0).toUpperCase() + status.slice(1)
    }</span></td>
          `;
    tableBody.appendChild(row);

    form.reset();
    modal.style.display = "none";
  });
});

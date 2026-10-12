"use strict";

// ---------- STORAGE ----------
const STORAGE_KEY = "edumanage_portal_v1";

function loadData() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      students: Array.isArray(data.students) ? data.students : [],
      teachers: Array.isArray(data.teachers) ? data.teachers : [],
      attendance: Array.isArray(data.attendance) ? data.attendance : [],
      payments: Array.isArray(data.payments) ? data.payments : [],
      results: Array.isArray(data.results) ? data.results : []
    };
  } catch {
    return { students: [], teachers: [], attendance: [], payments: [], results: [] };
  }
}

let db = loadData();

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    notify("Could not save data. Check browser storage space.");
    return false;
  }
  return true;
}

// Escape user-entered text before putting it into HTML.
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function money(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2
  });
}

function today() {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function notify(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function emptyRow(columns, message = "No records found") {
  return `<tr><td colspan="${columns}" class="empty">${esc(message)}</td></tr>`;
}

function getStudent(admission) {
  return db.students.find(s => s.admission === admission);
}

function paidAmount(admission) {
  return db.payments
    .filter(p => p.admission === admission)
    .reduce((sum, p) => sum + Number(p.amount), 0);
}

function pendingAmount(student) {
  return Math.max(0, Number(student.fee) - paidAmount(student.admission));
}

// ---------- NAVIGATION ----------
const titles = {
  dashboard: "Dashboard",
  students: "Student Management",
  teachers: "Teacher Management",
  attendance: "Attendance Management",
  fees: "Fee Management",
  results: "Examination Results"
};

function showPage(pageId) {
  if (!titles[pageId]) return;

  document.querySelectorAll(".page").forEach(page => {
    page.classList.toggle("active", page.id === pageId);
  });

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageId);
  });

  document.getElementById("pageTitle").textContent = titles[pageId];
  document.getElementById("sidebar").classList.remove("open");

  if (pageId === "attendance") renderAttendance();
  if (pageId === "fees") renderFees();
  if (pageId === "results") renderResults();
}

document.querySelectorAll(".nav-btn").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

document.querySelectorAll("[data-goto]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.goto));
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

document.getElementById("today").textContent =
  new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

document.getElementById("year").textContent = new Date().getFullYear();

// ---------- DASHBOARD ----------
function renderDashboard() {
  document.getElementById("totalStudents").textContent = db.students.length;
  document.getElementById("totalTeachers").textContent = db.teachers.length;

  const presentToday = db.attendance.filter(a =>
    a.date === today() && a.status === "Present"
  ).length;

  document.getElementById("totalPresent").textContent = presentToday;

  const pending = db.students.reduce(
    (sum, s) => sum + pendingAmount(s), 0
  );
  document.getElementById("totalPending").textContent = money(pending);

  const recent = [...db.students].slice(-5).reverse();
  document.getElementById("recentStudents").innerHTML = recent.length
    ? recent.map(s => `<tr>
        <td>${esc(s.admission)}</td>
        <td>${esc(s.name)}</td>
        <td>${esc(s.className)}</td>
        <td>${esc(s.phone)}</td>
      </tr>`).join("")
    : emptyRow(4, "Register your first student to get started.");
}

// ---------- STUDENTS ----------
document.getElementById("studentForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const values = Object.fromEntries(new FormData(form));
  const admission = values.admission.trim();

  if (db.students.some(s =>
    s.admission.toLowerCase() === admission.toLowerCase()
  )) {
    notify("This admission number already exists.");
    return;
  }

  const fee = Number(values.fee);
  if (!Number.isFinite(fee) || fee < 0) {
    notify("Enter a valid annual fee.");
    return;
  }

  db.students.push({
    admission,
    name: values.name.trim(),
    className: values.className,
    phone: values.phone.trim(),
    gender: values.gender,
    fee
  });

  if (!saveData()) {
    db.students.pop();
    return;
  }

  form.reset();
  renderAll();
  notify("Student registered successfully.");
});

function renderStudents(query = "") {
  const search = query.trim().toLowerCase();
  const students = db.students.filter(s =>
    [s.admission, s.name, s.className, s.phone, s.gender]
      .some(value => String(value).toLowerCase().includes(search))
  );

  document.getElementById("studentTable").innerHTML = students.length
    ? students.map(s => `<tr>
        <td>${esc(s.admission)}</td>
        <td>${esc(s.name)}</td>
        <td>${esc(s.className)}</td>
        <td>${esc(s.phone)}</td>
        <td>${esc(s.gender)}</td>
        <td>${money(s.fee)}</td>
        <td><button class="action-btn" data-delete-student="${esc(s.admission)}">
          Delete
        </button></td>
      </tr>`).join("")
    : emptyRow(7, "No matching students.");
}

document.getElementById("studentSearch").addEventListener("input", event => {
  renderStudents(event.target.value);
});

document.getElementById("studentTable").addEventListener("click", event => {
  const button = event.target.closest("[data-delete-student]");
  if (!button) return;

  const admission = button.dataset.deleteStudent;
  const student = getStudent(admission);
  if (!student) return;

  if (!confirm(`Delete ${student.name} and all associated records?`)) return;

  const snapshot = db;
  db = {
    ...db,
    students: db.students.filter(s => s.admission !== admission),
    attendance: db.attendance.filter(a => a.admission !== admission),
    payments: db.payments.filter(p => p.admission !== admission),
    results: db.results.filter(r => r.admission !== admission)
  };

  if (!saveData()) {
    db = snapshot;
    return;
  }

  renderAll();
  notify("Student and associated records deleted.");
});

// ---------- TEACHERS ----------
document.getElementById("teacherForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const values = Object.fromEntries(new FormData(form));
  const teacherId = values.teacherId.trim();

  if (db.teachers.some(t =>
    t.teacherId.toLowerCase() === teacherId.toLowerCase()
  )) {
    notify("This teacher ID already exists.");
    return;
  }

  db.teachers.push({
    teacherId,
    name: values.name.trim(),
    subject: values.subject.trim(),
    phone: values.phone.trim()
  });

  if (!saveData()) {
    db.teachers.pop();
    return;
  }

  form.reset();
  renderAll();
  notify("Teacher registered successfully.");
});

function renderTeachers() {
  document.getElementById("teacherTable").innerHTML = db.teachers.length
    ? db.teachers.map(t => `<tr>
        <td>${esc(t.teacherId)}</td>
        <td>${esc(t.name)}</td>
        <td>${esc(t.subject)}</td>
        <td>${esc(t.phone)}</td>
        <td><button class="action-btn" data-delete-teacher="${esc(t.teacherId)}">
          Delete
        </button></td>
      </tr>`).join("")
    : emptyRow(5, "No teachers registered yet.");
}

document.getElementById("teacherTable").addEventListener("click", event => {
  const button = event.target.closest("[data-delete-teacher]");
  if (!button) return;

  const id = button.dataset.deleteTeacher;
  if (!confirm("Delete this teacher record?")) return;

  const old = db.teachers;
  db.teachers = db.teachers.filter(t => t.teacherId !== id);

  if (!saveData()) {
    db.teachers = old;
    return;
  }

  renderAll();
  notify("Teacher record deleted.");
});

// ---------- STUDENT DROPDOWNS ----------
function renderStudentOptions() {
  ["feeStudent", "resultStudent"].forEach(id => {
    const select = document.getElementById(id);
    const previous = select.value;

    select.innerHTML = '<option value="">Select student</option>' +
      db.students.map(s =>
        `<option value="${esc(s.admission)}">${esc(s.admission)} — ${esc(s.name)}</option>`
      ).join("");

    if (db.students.some(s => s.admission === previous)) {
      select.value = previous;
    }
  });
}

// ---------- ATTENDANCE ----------
const attendanceDate = document.getElementById("attendanceDate");
attendanceDate.value = today();

function renderAttendance() {
  const date = attendanceDate.value || today();
  const records = db.students.map(s => {
    const record = db.attendance.find(a =>
      a.admission === s.admission && a.date === date
    );
    return { student: s, status: record?.status || "Present" };
  });

  document.getElementById("attendanceTable").innerHTML = records.length
    ? records.map(({ student: s, status }) => `<tr>
        <td>${esc(s.admission)}</td>
        <td>${esc(s.name)}</td>
        <td>${esc(s.className)}</td>
        <td><select data-attendance="${esc(s.admission)}" aria-label="Attendance for ${esc(s.name)}">
          <option ${status === "Present" ? "selected" : ""}>Present</option>
          <option ${status === "Absent" ? "selected" : ""}>Absent</option>
          <option ${status === "Late" ? "selected" : ""}>Late</option>
        </select></td>
      </tr>`).join("")
    : emptyRow(4, "Register students before marking attendance.");
}

attendanceDate.addEventListener("change", renderAttendance);
document.getElementById("loadAttendance").addEventListener("click", renderAttendance);

document.getElementById("attendanceForm").addEventListener("submit", event => {
  event.preventDefault();

  const date = attendanceDate.value;
  if (!date) {
    notify("Select an attendance date.");
    return;
  }

  const updates = [...document.querySelectorAll("[data-attendance]")].map(el => ({
    admission: el.dataset.attendance,
    date,
    status: el.value
  }));

  const previous = db.attendance;
  db.attendance = db.attendance.filter(a => a.date !== date).concat(updates);

  if (!saveData()) {
    db.attendance = previous;
    return;
  }

  renderAll();
  notify("Attendance saved successfully.");
});

// ---------- FEE MANAGEMENT ----------
const feeDate = document.querySelector('#feeForm [name="date"]');
feeDate.value = today();

document.getElementById("feeForm").addEventListener("submit", event => {
  event.preventDefault();

  const form = event.currentTarget;
  const values = Object.fromEntries(new FormData(form));
  const student = getStudent(values.admission);
  const amount = Number(values.amount);

  if (!student) {
    notify("Select a valid student.");
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    notify("Enter a valid payment amount.");
    return;
  }

  if (amount > pendingAmount(student) + 0.000001) {
    notify("Payment exceeds the student's pending fee.");
    return;
  }

  db.payments.push({
    id: crypto.randomUUID(),
    admission: student.admission,
    amount,
    date: values.date,
    mode: values.mode
  });

  if (!saveData()) {
    db.payments.pop();
    return;
  }

  form.reset();
  feeDate.value = today();
  renderAll();
  notify("Fee payment recorded successfully.");
});

function renderFees() {
  document.getElementById("feeTable").innerHTML = db.students.length
    ? db.students.map(s => {
        const paid = paidAmount(s.admission);
        const pending = pendingAmount(s);
        const fullyPaid = pending <= 0.000001;

        return `<tr>
          <td>${esc(s.admission)}</td>
          <td>${esc(s.name)}</td>
          <td>${money(s.fee)}</td>
          <td>${money(paid)}</td>
          <td>${money(pending)}</td>
          <td><span class="pill ${fullyPaid ? "paid" : "pending"}">
            ${fullyPaid ? "Paid" : "Pending"}
          </span></td>
        </tr>`;
      }).join("")
    : emptyRow(6, "No students available.");

  const payments = [...db.payments].reverse();
  document.getElementById("paymentTable").innerHTML = payments.length
    ? payments.map(p => {
        const student = getStudent(p.admission);
        return `<tr>
          <td>${esc(p.date)}</td>
          <td>${esc(student?.name || p.admission)}</td>
          <td>${money(p.amount)}</td>
          <td>${esc(p.mode)}</td>
        </tr>`;
      }).join("")
    : emptyRow(4, "No payments recorded.");
}

// ---------- EXAMINATION RESULTS ----------
document.getElementById("resultForm").addEventListener("submit", event => {
  event.preventDefault();

  const form = event.currentTarget;
  const values = Object.fromEntries(new FormData(form));
  const maximum = Number(values.maximum);
  const marks = Number(values.marks);

  if (!getStudent(values.admission)) {
    notify("Select a valid student.");
    return;
  }

  if (!Number.isFinite(maximum) || maximum <= 0 ||
      !Number.isFinite(marks) || marks < 0 || marks > maximum) {
    notify("Marks must be between zero and maximum marks.");
    return;
  }

  const result = {
    id: crypto.randomUUID(),
    admission: values.admission,
    exam: values.exam,
    subject: values.subject.trim(),
    maximum,
    marks,
    percentage: marks / maximum * 100
  };

  db.results.push(result);

  if (!saveData()) {
    db.results.pop();
    return;
  }

  form.reset();
  renderResults();
  notify("Examination result saved.");
});

function gradeFor(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  if (percentage >= 33) return "E";
  return "F";
}

function renderResults() {
  document.getElementById("resultTable").innerHTML = db.results.length
    ? [...db.results].reverse().map(r => {
        const student = getStudent(r.admission);
        const grade = gradeFor(r.percentage);

        return `<tr>
          <td>${esc(student?.name || r.admission)}</td>
          <td>${esc(r.exam)}</td>
          <td>${esc(r.subject)}</td>
          <td>${r.marks} / ${r.maximum}</td>
          <td>${r.percentage.toFixed(2)}%</td>
          <td><span class="pill ${grade === "F" ? "fail" : "pass"}">${grade}</span></td>
          <td><button class="action-btn" data-delete-result="${esc(r.id)}">
            Delete
          </button></td>
        </tr>`;
      }).join("")
    : emptyRow(7, "No examination results entered.");
}

document.getElementById("resultTable").addEventListener("click", event => {
  const button = event.target.closest("[data-delete-result]");
  if (!button) return;

  const id = button.dataset.deleteResult;
  if (!confirm("Delete this examination result?")) return;

  const previous = db.results;
  db.results = db.results.filter(r => r.id !== id);

  if (!saveData()) {
    db.results = previous;
    return;
  }

  renderResults();
  notify("Examination result deleted.");
});

// ---------- REFRESH ALL VIEWS ----------
function renderAll() {
  renderDashboard();
  renderStudents(document.getElementById("studentSearch").value);
  renderTeachers();
  renderStudentOptions();
  renderAttendance();
  renderFees();
  renderResults();
}

renderAll();

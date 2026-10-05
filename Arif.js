// ========================================
// Student Management System
// ========================================


// Get HTML Elements
const studentForm = document.getElementById("studentForm");

const studentId = document.getElementById("studentId");
const studentName = document.getElementById("studentName");
const fatherName = document.getElementById("fatherName");
const gender = document.getElementById("gender");
const className = document.getElementById("className");
const section = document.getElementById("section");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const dob = document.getElementById("dob");
const address = document.getElementById("address");

const editIndex = document.getElementById("editIndex");

const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

const searchInput = document.getElementById("searchInput");
const classFilter = document.getElementById("classFilter");

const studentTableBody = document.getElementById("studentTableBody");
const emptyMessage = document.getElementById("emptyMessage");


// Dashboard Elements
const totalStudents = document.getElementById("totalStudents");
const maleStudents = document.getElementById("maleStudents");
const femaleStudents = document.getElementById("femaleStudents");
const totalClasses = document.getElementById("totalClasses");


// ========================================
// Get Students From Local Storage
// ========================================

let students = JSON.parse(localStorage.getItem("students")) || [];


// ========================================
// Save Students To Local Storage
// ========================================

function saveStudents() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


// ========================================
// Display Students
// ========================================

function displayStudents() {

    studentTableBody.innerHTML = "";

    const searchText =
        searchInput.value.toLowerCase();

    const selectedClass =
        classFilter.value;


    const filteredStudents = students.filter(student => {

        const matchesSearch =
            student.studentId.toLowerCase().includes(searchText) ||
            student.name.toLowerCase().includes(searchText) ||
            student.fatherName.toLowerCase().includes(searchText) ||
            student.phone.includes(searchText);

        const matchesClass =
            selectedClass === "All" ||
            student.className === selectedClass;

        return matchesSearch && matchesClass;
    });


    if (filteredStudents.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    filteredStudents.forEach((student) => {

        const originalIndex =
            students.indexOf(student);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${originalIndex + 1}</td>

            <td>${student.studentId}</td>

            <td>${student.name}</td>

            <td>${student.fatherName}</td>

            <td>${student.gender}</td>

            <td>${student.className}</td>

            <td>${student.section}</td>

            <td>${student.phone}</td>

            <td>${student.email}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editStudent(${originalIndex})"
                >
                    Modify
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(${originalIndex})"
                >
                    Delete
                </button>

            </td>
        `;


        studentTableBody.appendChild(row);

    });


    updateDashboard();
}


// ========================================
// Add / Update Student
// ========================================

studentForm.addEventListener("submit", function(event) {

    event.preventDefault();


    // Validate Phone
    if (!/^[0-9]{10}$/.test(phone.value)) {

        alert("Please enter a valid 10-digit phone number.");

        return;
    }


    const student = {

        studentId: studentId.value.trim(),

        name: studentName.value.trim(),

        fatherName: fatherName.value.trim(),

        gender: gender.value,

        className: className.value,

        section: section.value,

        phone: phone.value.trim(),

        email: email.value.trim(),

        dob: dob.value,

        address: address.value.trim()

    };


    // Check Duplicate Student ID
    const duplicate =
        students.some((item, index) => {

            return item.studentId === student.studentId &&
                   index != editIndex.value;

        });


    if (duplicate) {

        alert("Student ID already exists.");

        return;
    }


    // Update Existing Student
    if (editIndex.value !== "") {

        students[Number(editIndex.value)] = student;

        alert("Student updated successfully.");

        submitBtn.innerHTML = "➕ Add Student";

        editIndex.value = "";

    }

    // Add New Student
    else {

        students.push(student);

        alert("Student added successfully.");

    }


    saveStudents();

    studentForm.reset();

    displayStudents();

});


// ========================================
// Edit Student
// ========================================

function editStudent(index) {

    const student = students[index];


    studentId.value = student.studentId;

    studentName.value = student.name;

    fatherName.value = student.fatherName;

    gender.value = student.gender;

    className.value = student.className;

    section.value = student.section;

    phone.value = student.phone;

    email.value = student.email;

    dob.value = student.dob;

    address.value = student.address;


    editIndex.value = index;

    submitBtn.innerHTML = "✏️ Update Student";


    // Scroll to form
    document.querySelector(".form-section")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ========================================
// Delete Student
// ========================================

function deleteStudent(index) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmation) {

        return;

    }


    students.splice(index, 1);

    saveStudents();

    displayStudents();

}


// ========================================
// Reset Form
// ========================================

resetBtn.addEventListener("click", function() {

    studentForm.reset();

    editIndex.value = "";

    submitBtn.innerHTML = "➕ Add Student";

});


// ========================================
// Search Student
// ========================================

searchInput.addEventListener(
    "input",
    displayStudents
);


// ========================================
// Filter By Class
// ========================================

classFilter.addEventListener(
    "change",
    displayStudents
);


// ========================================
// Dashboard Statistics
// ========================================

function updateDashboard() {

    totalStudents.textContent =
        students.length;


    const maleCount =
        students.filter(
            student => student.gender === "Male"
        ).length;


    const femaleCount =
        students.filter(
            student => student.gender === "Female"
        ).length;


    maleStudents.textContent =
        maleCount;


    femaleStudents.textContent =
        femaleCount;


    const classes =
        new Set(
            students.map(
                student => student.className
            )
        );


    totalClasses.textContent =
        classes.size;

}


// ========================================
// Initial Display
// ========================================

displayStudents();

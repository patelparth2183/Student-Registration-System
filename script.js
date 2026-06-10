// Element Selection
const submitBtn = document.querySelector('#submitBtn');
const resetBtn = document.querySelector('#resetBtn');
const form = document.querySelector('#srsForm');
const tableBody = document.querySelector('#tableBody');
const tableContainer = document.querySelector('#tableContainer');
const recordCount = document.querySelector('#record');
const emptyState = document.querySelector('#emptyState');

const studentName = document.querySelector('#studentName');
const studentId = document.querySelector('#studentId');
const studentEmail = document.querySelector('#email');
const studentContact = document.querySelector('#contact');

const nameError = document.querySelector('#nameError');
const idError = document.querySelector('#idError');
const emailError = document.querySelector('#emailError');
const contactError = document.querySelector('#contactError');

// Array that hold students record
let students = [];
let editIndex = -1;

// Form submit event
form.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) { return; }

    const student = {
        name: studentName.value.trim(),
        id: studentId.value.trim(),
        email: email.value.trim(),
        contact: contact.value.trim()
    };

    if (editIndex === -1) {
        students.push(student);
    } else {
        students[editIndex] = student;
        editIndex = -1;
        submitBtn.textContent = "✚ Add Student";
    }

    saveStudents();
    renderStudents();
    form.reset();
}

// Form validation
function validateForm() {

    let isValid = true;

    nameError.textContent = "";
    idError.textContent = "";
    emailError.textContent = "";
    contactError.textContent = "";

    const nameRegex = /^[A-Za-z ]+$/;
    const idRegex = /^[0-9]+$/;
    const contactRegex = /^[0-9]{10,}$/;

    if (!nameRegex.test(studentName.value.trim())) {
        nameError.textContent = "Name must contain letters only";
        isValid = false;
    }

    if (!idRegex.test(studentId.value.trim())) {
        idError.textContent = "ID must contain numbers only";
        isValid = false;
    }

    if (!email.checkValidity()) {
        emailError.textContent = "Enter a valid email";
        isValid = false;
    }

    if (!contactRegex.test(contact.value.trim())) {
        contactError.textContent = "Minimum 10 digits required";
        isValid = false;
    }

    return isValid;
}

// Save data to local storage
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Load data from local storage when page is refreshed
function loadStudents() {
    const savedStudents = localStorage.getItem("students");

    if (savedStudents) {
        students = JSON.parse(savedStudents);
    }

    renderStudents();
}

loadStudents();

// Render students in table
function renderStudents() {

    tableBody.innerHTML = "";

    students.forEach((student, index) => {
        tableBody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td>
                    <button class="edit-btn" onclick="editStudent(${index})">
                        ✏️ Edit
                    </button>
                    <button class="delete-btn" onclick="deleteStudent(${index})">
                        🗑️ Delete
                    </button>
                </td>
            </tr>
        `;
    });

    updateUI();
}

// Update Record Count & Empty State
function updateUI() {

    recordCount.textContent = `${students.length} Records`;

    if (students.length === 0) {
        emptyState.style.display = "block";
        document.getElementById("studentTable").style.display = "none";
    } else {
        emptyState.style.display = "none";
        document.getElementById("studentTable").style.display = "table";
    }

    toggleScrollbar();
}

// Delete student
function deleteStudent(index) {

    const confirmed = confirm("Delete this student?");

    if (!confirmed) return;

    students.splice(index, 1);

    saveStudents();
    renderStudents();
}

// Edit Student
function clearErrors() {
    nameError.textContent = "";
    idError.textContent = "";
    emailError.textContent = "";
    contactError.textContent = "";
}

function editStudent(index) {

    clearErrors();

    const student = students[index];

    studentName.value = student.name;
    studentId.value = student.id;
    email.value = student.email;
    contact.value = student.contact;

    editIndex = index;

    submitBtn.textContent = "✓ Update Student";
}

// Dynamic scrollbar
function toggleScrollbar() {

    const tableContainer =
        document.getElementById("tableContainer");

    if (students.length > 5) {
        tableContainer.style.maxHeight = "422px";
        tableContainer.style.overflowY = "auto";

    } else {
        tableContainer.style.overflowY = "visible";
    }
}
const cl = console.log;

const form = document.getElementById("form");
const stdList = document.getElementById("stdContainer");
const fnameControl = document.getElementById("fname");
const lnameControl = document.getElementById("lname");
const contactControl = document.getElementById("contact");
const emailControl = document.getElementById("email");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

// Database

let jsonArr = localStorage.getItem("studentArr");

let studentArr = jsonArr ? JSON.parse(jsonArr) : [];

// Functions

function showOnUI(arr) {
  let result = "";

  arr.forEach((ele, i) => {
    result += `
                                <tr id="${ele.id}">
                                    <td>${i + 1}</td>
                                    <td>${ele.fname} ${ele.lname}</td>
                                    <td>${ele.gender}</td>
                                    <td>${ele.contact}</td>
                                    <td>${ele.email}</td>
                                    <td class="d-flex justify-content-between">
                                        <i onclick = "editStd(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                        <i onclick = "removeStd(this)" class="fa-regular fa-trash-can fa-2x text-danger"></i>
                                    </td>
                                </tr>`;
  });

  stdList.innerHTML = result;
}

showOnUI(studentArr);

// Creating Tr

function createTr(newStudent) {
  let tr = document.createElement("tr");

  tr.id = newStudent.id;

  tr.innerHTML = `
                                    <td>${studentArr.length}</td>
                                    <td>${newStudent.fname} ${newStudent.lname}</td>
                                    <td>${newStudent.gender}</td>
                                    <td>${newStudent.contact}</td>
                                    <td>${newStudent.email}</td>
                                    <td class="d-flex justify-content-between">
                                        <i onclick = "editStd(this)" class="fa-solid fa-pen-to-square fa-2x text-primary"></i>
                                        <i onclick = "removeStd(this)" class="fa-regular fa-trash-can fa-2x text-danger"></i>
                                    </td>`;
  stdList.append(tr);
}

// Edit student

function editStd(ele) {
  let editId = ele.closest("tr").id;

  let editObj = studentArr.find((ele) => ele.id === editId);

  if (!editObj) return;

  fnameControl.value = editObj.fname;
  lnameControl.value = editObj.lname;
  document.querySelector(
    `input[name="gender"][value="${editObj.gender}"]`,
  ).checked = true;
  contactControl.value = editObj.contact;
  emailControl.value = editObj.email;

  submitBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
  updateBtn.setAttribute("data-edit-id", editId);
}

// Updating student

function onUpdateClick(event) {
  let updateId = event.target.dataset.editId;

  let updatedObj = {
    id: updateId,
    fname: fnameControl.value.trim(),
    lname: lnameControl.value.trim(),
    gender: document.querySelector(`input[name="gender"]:checked`).value,
    contact: contactControl.value.trim(),
    email: emailControl.value.trim(),
  };

  let getIndex = studentArr.findIndex((ele) => ele.id === updateId);
  if (getIndex === -1) return;
  updateBtn.removeAttribute("data-edit-id");

  studentArr[getIndex] = updatedObj;
  localStorage.setItem("studentArr", JSON.stringify(studentArr));

  let td = [...document.getElementById(updateId).children];

  td[1].innerText = `${updatedObj.fname} ${updatedObj.lname}`;
  td[2].innerText = updatedObj.gender;
  td[3].innerText = updatedObj.contact;
  td[4].innerText = updatedObj.email;

  Swal.fire({
    title: "Updated!",
    text: "Student updated successfully.",
    icon: "success",
    timer: 2000,
  });

  updateBtn.classList.add("d-none");
  submitBtn.classList.remove("d-none");

  form.reset();
}

// Remove student

function removeStd(ele) {
  let removeId = ele.closest("tr").id;
  let getConfirmed = confirm("Are you sure, You want to delete this Student?");

  if (getConfirmed) {
    let getIndex = studentArr.findIndex((ele) => ele.id === removeId);

    if (getIndex === -1) return;

    studentArr.splice(getIndex, 1);
    localStorage.setItem("studentArr", JSON.stringify(studentArr));

    ele.closest("tr").remove();

    let srno = [
      ...document.querySelectorAll("#stdContainer tr td:first-child"),
    ];

    srno.forEach((ele, i) => (ele.innerText = i + 1));

    Swal.fire({
      title: "Deleted!",
      text: "Student deleted successfully.",
      icon: "success",
      timer: 2000,
    });
  }
}

function onStdAdd(event) {
  event.preventDefault();

  let newStudent = {
    id: crypto.randomUUID(),
    fname: fnameControl.value.trim(),
    lname: lnameControl.value.trim(),
    gender: document.querySelector(`input[name="gender"]:checked`).value,
    contact: contactControl.value.trim(),
    email: emailControl.value.trim(),
  };

  studentArr.push(newStudent);
  localStorage.setItem("studentArr", JSON.stringify(studentArr));

  Swal.fire({
    title: "Student Added!",
    text: "Student has been added successfully.",
    icon: "success",
    timer: 2000,
  });

  createTr(newStudent);
  form.reset();
}

form.addEventListener("submit", onStdAdd);
updateBtn.addEventListener("click", onUpdateClick);

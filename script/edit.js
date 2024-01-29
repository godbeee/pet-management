"use strict";
// các element dùng để thao tác
const inputID = document.getElementById("input-id");
const inputName = document.getElementById("input-name");
const inputAge = document.getElementById("input-age");
const inputType = document.getElementById("input-type");
const inputWeight = document.getElementById("input-weight");
const inputLength = document.getElementById("input-length");
const inputColor = document.getElementById("input-color-1");
const inputBreed = document.getElementById("input-breed");
const inputVaccinated = document.getElementById("input-vaccinated");
const inputDewormed = document.getElementById("input-dewormed");
const inputSterilized = document.getElementById("input-sterilized");
const nav = document.getElementById("sidebar");
const tbody = document.getElementById("tbody");
const container = document.getElementById("container-form");
const btnEditPet = document.getElementById("submit-btn");

//dữ liệu breeds array và petList array
let breeds =
  getFromStorage("breeds") === null ? [] : JSON.parse(getFromStorage("breeds"));
let petList =
  getFromStorage("pets") === null ? [] : JSON.parse(getFromStorage("pets"));
if (petList.length > 0) {
  renderPetTable(petList);
}

//xử lí button edit khi click
btnEditPet.addEventListener("click", function () {
  //collect data and return new obj
  const petData = collectData();

  //check data is valid ?
  const isValid = validate(petData);

  // data is valid
  if (isValid) {
    const petEdit = petList.find((pet) => pet.id === petData.id);
    if (petEdit) {
      petEdit.name = petData.name;
      petEdit.age = petData.age;
      petEdit.type = petData.type;
      petEdit.weight = petData.weight;
      petEdit.length = petData.length;
      petEdit.color = petData.color;
      petEdit.breed = petData.breed;
      petEdit.vaccinated = petData.vaccinated;
      petEdit.dewormed = petData.dewormed;
      petEdit.sterilized = petData.sterilized;
    }

    //lưu petList vào local storage
    saveToStorage("pets", JSON.stringify(petList));
    //ẩn form
    container.classList.add("hide");
    //reset form
    clearInputs();
    //render lại pet table sau khi edit
    renderPetTable(petList);
  }
});

//hàm collect data
function collectData() {
  return {
    id: inputID.value,
    name: inputName.value,
    age: inputAge.value,
    type: inputType.value,
    weight: inputWeight.value,
    length: inputLength.value,
    color: inputColor.value,
    breed: inputBreed.value,
    vaccinated: inputVaccinated.checked,
    dewormed: inputDewormed.checked,
    sterilized: inputSterilized.checked,
  };
}

//hàm validate
function validate(obj) {
  //validate name
  if (obj.name === "") {
    alert("name not be empty!");
    return false;
  } else {
    const term = /^[A-Za-z ]+$/;
    if (!obj.name.match(term)) {
      alert("name contain number!");
      return false;
    }
  }
  //validate age
  if (obj.age === "") {
    alert("age not be empty!");
    return false;
  } else if (+obj.age < 1 || +obj.age > 15) {
    alert("Age must be between 1 and 15!");
    return false;
  }
  //vaalidate type
  if (obj.type === "") {
    alert("type not be empty!");
    return false;
  }
  //validate weight
  if (obj.weight === "") {
    alert("weight not be empty!");
    return false;
  } else if (+obj.weight < 1 || +obj.weight > 15) {
    alert("weight must be between 1 and 15!");
    return false;
  }
  //validate length
  if (obj.length === "") {
    alert("length not be empty!");
    return false;
  } else if (+obj.length < 1 || +obj.length > 100) {
    alert("length must be between 1 and 100!");
    return false;
  }
  //validate breed
  if (obj.breed === "") {
    alert("breed not be empty!");
    return false;
  }
  return true;
}

//hàm render pets table
function renderPetTable(arr) {
  tbody.innerHTML = "";
  if (arr.length > 0) {
    for (let item of arr) {
      //format date
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const date = new Date();
      const dateFormat = date.toLocaleDateString("vi-VN", options);
      /////////////////
      const row = document.createElement("tr");
      row.innerHTML = `
                              <th scope="row">${item.id}</th>
                              <td>${item.name}</td>
                              <td>${item.age}</td>
                              <td>${item.type}</td>
                              <td>${item.weight} kg</td>
                              <td>${item.length} cm</td>
                              <td>${item.breed}</td>
                              <td><i class="bi bi-square-fill" style="color: ${
                                item.color
                              }"></i></td>
                              <td><i class="bi bi-${
                                item.vaccinated ? "check" : "x"
                              }-circle-fill"></i></td>
                              <td><i class="bi bi-${
                                item.dewormed ? "check" : "x"
                              }-circle-fill"></i></td>
                              <td><i class="bi bi-${
                                item.sterilized ? "check" : "x"
                              }-circle-fill"></i></td>
                              
                              <td>${dateFormat}</td>
                              <td>
                                  <button onclick="startEditPet('${
                                    item.id
                                  }')" type="button" class="btn btn-warning">Edit</button>
                              </td>
                          `;
      tbody.appendChild(row);
    }
  }
}

//hàm reset form
function clearInputs() {
  inputID.value = "";
  inputName.value = "";
  inputAge.value = "";
  inputType.value = "";
  inputWeight.value = "";
  inputLength.value = "";
  inputBreed.value = "";
  inputVaccinated.checked = false;
  inputDewormed.checked = false;
  inputSterilized.checked = false;
  inputColor.value = "#000000";
}

//hàm dùng để hiển thị form và show dữ liệu lên form
function startEditPet(id) {
  container.classList.remove("hide");
  const petEdit = petList.find((pet) => pet.id === id);
  if (petEdit) {
    console.log(petEdit);
    inputID.value = petEdit.id;
    inputName.value = petEdit.name;
    inputAge.value = petEdit.age;
    inputType.value = petEdit.type;
    const typeArr = breeds.filter((breed) => breed.type === petEdit.type);
    renderBreed(typeArr);
    inputBreed.value = petEdit.breed;
    inputWeight.value = petEdit.weight;
    inputLength.value = petEdit.length;
    inputColor.value = petEdit.color;
    inputVaccinated.checked = petEdit.vaccinated;
    inputDewormed.checked = petEdit.dewormed;
    inputSterilized.checked = petEdit.sterilized;
  }
}

//hàm dùng để filter breed theo type
inputType.addEventListener("change", function () {
  if (breeds.length > 0) {
    if (this.value === "dog") {
      const dogBreeds = breeds.filter((breed) => breed.type === "dog");
      renderBreed(dogBreeds);
    } else if (this.value === "cat") {
      const catBreeds = breeds.filter((breed) => breed.type === "cat");
      renderBreed(catBreeds);
    } else {
      renderBreed([]);
    }
  }
});

//hàm render breed
function renderBreed(arr) {
  inputBreed.innerHTML = "";
  if (arr.length > 0) {
    for (let item of arr) {
      const option = document.createElement("option");
      option.value = item.breed.toLowerCase();
      option.textContent = item.breed;
      inputBreed.appendChild(option);
    }
  } else {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Select breed";
    inputBreed.appendChild(option);
  }
}

//animation navigation
nav.addEventListener("click", function () {
  this.classList.toggle("active");
});

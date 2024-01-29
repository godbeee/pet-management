"use strict";
"use strict";

//các input được gán cho các biến để dễ xử lí
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
const tbody = document.getElementById("tbody");
const nav = document.getElementById("sidebar");

//button xử lý sự kiện
const btnAddPet = document.getElementById("submit-btn");
const btnShowHealthyPet = document.getElementById("healthy-btn");
// const btnBMI = document.getElementById("bmi-btn");

//event handle toggle vertical navigation
nav.addEventListener("click", function () {
  this.classList.toggle("active");
});
//datas include breeds array and pet list array
let breeds =
  getFromStorage("breeds") === null ? [] : JSON.parse(getFromStorage("breeds"));
let petList =
  getFromStorage("pets") === null ? [] : JSON.parse(getFromStorage("pets"));
//render table pets first time
if (petList.length > 0) {
  renderPetTable(petList);
}

//array include healthy pets
let petHealthyList = [];
let healthyCheck = false;

//handle button add pet
btnAddPet.addEventListener("click", function () {
  //collect data and return new obj
  const petData = collectData();

  //check data is valid ?
  const isValid = validate(petData);

  // data is valid
  if (isValid) {
    // push data vào mảng
    petList.push(petData);
    //clear form trống
    clearInputs();
    //render table pets
    renderPetTable(petList);
    //lưu danh sách pets vào local storage
    saveToStorage("pets", JSON.stringify(petList));
  }
});

//hàm dùng để trả về 1 obj chứa dữ liệu ở các input
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
    date: new Date(),
    bmi: undefined,
  };
}

// hàm dùng để validate dữ liệu từ các inputs
function validate(obj) {
  //validate id
  if (obj.id === "") {
    alert("id not be empty!");
    return false;
  } else {
    const ids = petList.map((pet) => pet.id);
    if (ids.includes(obj.id)) {
      alert("ID must be unique!");
      return false;
    }
  }
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
  //validate type
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
  //vaalidate breed
  if (obj.breed === "") {
    alert("breed not be empty!");
    return false;
  }
  return true;
}

//hàm reset form sau khi submit
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

//hàm dùng để render table pets
function renderPetTable(arr) {
  tbody.innerHTML = "";
  if (arr.length > 0) {
    for (let item of arr) {
      //format date
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const date = new Date(item.date);
      const dateFormat = date.toLocaleString("vi-VN", options);
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
                                <button onclick="deletePetById('${
                                  item.id
                                }')" type="button" class="btn btn-danger">Delete</button>
                            </td>
                        `;
      tbody.appendChild(row);
    }
  }
}
//hàm xoá pet trên table dựa vào id
function deletePetById(id) {
  if (confirm("Are you sure?")) {
    if (!healthyCheck) {
      petList = petList.filter((pet) => pet.id !== id);
      if (petList.length > 0) {
        renderPetTable(petList);
        saveToStorage("pets", JSON.stringify(petList));
      } else {
        tbody.innerHTML = "";
        localStorage.removeItem("pets");
      }
    } else {
      let petMark;
      petHealthyList = petHealthyList.filter((pet) => {
        if (pet.id === id) {
          petMark = pet;
        }
        return pet.id !== id;
      });
      if (petHealthyList.length > 0) {
        renderPetTable(petHealthyList);
      } else {
        tbody.innerHTML = "";
      }
      if (petMark) {
        petList.splice(petList.indexOf(petMark), 1);
        saveToStorage("pets", JSON.stringify(petList));
      }
    }
  }
}

//dùng để show các healthy pets
btnShowHealthyPet.addEventListener("click", function () {
  healthyCheck = !healthyCheck;
  if (healthyCheck) {
    this.textContent = "Show All Pets";
    petHealthyList = petList.filter(
      (pet) => pet.vaccinated && pet.dewormed && pet.sterilized
    );
    if (petHealthyList.length > 0) {
      renderPetTable(petHealthyList);
    } else {
      tbody.innerHTML = "";
    }
  } else {
    this.textContent = "Show Healthy Pets";
    if (petList.length > 0) {
      renderPetTable(petList);
    } else {
      tbody.innerHTML = "";
    }
  }
});

//dùng để switch breed dựa trên type khi type thay đổi giá trị
inputType.addEventListener("change", function () {
  console.log("change");
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

//hàm dùng để render breed
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

// btnBMI.addEventListener("click", function () {
//   if (!healthyCheck) {
//     if (petList.length > 0) {
//       for (let pet of petList) {
//         if (pet.type === "dog") {
//           pet.bmi = (pet.weight * 703) / pet.length ** 2;
//         } else if (pet.type === "cat") {
//           pet.bmi = (pet.weight * 886) / pet.length ** 2;
//         }
//       }
//       renderPetTable(petList);
//     }
//   } else {
//     if (petHealthyList.length > 0) {
//       for (let pet of petHealthyList) {
//         if (pet.type === "dog") {
//           pet.bmi = (pet.weight * 703) / pet.length ** 2;
//         } else if (pet.type === "cat") {
//           pet.bmi = (pet.weight * 886) / pet.length ** 2;
//         }
//       }
//       renderPetTable(petHealthyList);
//     }
//   }
// });

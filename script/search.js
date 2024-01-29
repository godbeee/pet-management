"use strict";
//các elements dùng để thao tác
const nav = document.getElementById("sidebar");
const inputID = document.getElementById("input-id");
const inputName = document.getElementById("input-name");
const inputType = document.getElementById("input-type");
const inputBreed = document.getElementById("input-breed");
const inputVaccinated = document.getElementById("input-vaccinated");
const inputDewormed = document.getElementById("input-dewormed");
const inputSterilized = document.getElementById("input-sterilized");
const btnSearch = document.getElementById("find-btn");
const tbody = document.getElementById("tbody");

//dữ liệu gồm breeds array và petList array
let breeds =
  getFromStorage("breeds") === null ? [] : JSON.parse(getFromStorage("breeds"));
let petList =
  getFromStorage("pets") === null ? [] : JSON.parse(getFromStorage("pets"));

//hàm collect data từ input, return obj có chứa data
function collectData() {
  return {
    id: inputID.value,
    name: inputName.value,
    type: inputType.value,
    breed: inputBreed.value,
    vaccinated: inputVaccinated.checked,
    dewormed: inputDewormed.checked,
    sterilized: inputSterilized.checked,
  };
}

//hàm return về array có chứa các yêu cầu search, ví dụ search theo id và type
// return ["id", "type"]
function getSearchTerm() {
  const terms = [];
  if (inputID.value !== "") {
    terms.push("id");
  }
  if (inputName.value !== "") {
    terms.push("name");
  }
  if (inputType.value !== "") {
    terms.push("type");
  }
  if (inputBreed.value !== "") {
    terms.push("breed");
  }
  if (inputVaccinated.checked) {
    terms.push("vaccinated");
  }
  if (inputDewormed.checked) {
    terms.push("dewormed");
  }
  if (inputSterilized.checked) {
    terms.push("sterilized");
  }
  return terms;
}

//xử lí search khi click button search
btnSearch.addEventListener("click", function () {
  const arr = getSearchTerm();

  if (arr.length > 0) {
    const petData = collectData();

    let result;
    // duyệt các key trong yêu cầu search: vd: id, type
    for (let item of arr) {
      if (result) {
        //chạy tiếp theo result
        result = result.filter((pet) => {
          if (item === "name") {
            return pet.name.toLowerCase().includes(petData.name.toLowerCase());
          }
          //check các key có giá trị bằng nhau không
          return pet[item] === petData[item];
        });
      } else {
        //chạy lần đầu theo petList
        result = petList.filter((pet) => {
          if (item === "name") {
            return pet.name.toLowerCase().includes(petData.name.toLowerCase());
          }
          return pet[item] === petData[item];
        });
      }
    }
    if (result.length > 0) {
      renderPetTable(result);
    } else {
      tbody.innerHTML = "";
    }
  } else {
    tbody.innerHTML = "";
  }
});

//hàm hiển thị danh sách pets
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
                              
                          `;
      tbody.appendChild(row);
    }
  }
}

// inputType.addEventListener("change", function () {
//   console.log("change");
//   if (breeds.length > 0) {
//     if (this.value === "dog") {
//       const dogBreeds = breeds.filter((breed) => breed.type === "dog");
//       renderBreed(dogBreeds);
//     } else if (this.value === "cat") {
//       const catBreeds = breeds.filter((breed) => breed.type === "cat");
//       renderBreed(catBreeds);
//     }
//   }
// });

const dogBreeds = breeds.filter((breed) => breed.type === "dog");
const catBreeds = breeds.filter((breed) => breed.type === "cat");
renderBreed([...dogBreeds, ...catBreeds]);

//hàm hiển thị danh sách breeds
function renderBreed(arr) {
  inputBreed.innerHTML = "<option value=''>Select Breed</option>";
  if (arr.length > 0) {
    for (let item of arr) {
      const option = document.createElement("option");
      option.value = item.breed.toLowerCase();
      option.textContent = item.breed;
      inputBreed.appendChild(option);
    }
  }
}

//animation
nav.addEventListener("click", function () {
  this.classList.toggle("active");
});

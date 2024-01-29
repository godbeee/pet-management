"use strict";
// các element dùng để thao tác
const nav = document.getElementById("sidebar");
const tbody = document.getElementById("tbody");
const inputBreed = document.getElementById("input-breed");
const inputType = document.getElementById("input-type");

const btnAddBreed = document.getElementById("submit-btn");

//parse dữ liệu lần đầu, nếu có thì parse, nếu không thì là []
let breeds =
  getFromStorage("breeds") === null ? [] : JSON.parse(getFromStorage("breeds"));
if (breeds.length > 0) {
  //
  renderBreedsTable(breeds);
}

//xử lí add breed
btnAddBreed.addEventListener("click", function () {
  const breedObj = collectData();
  const isValid = validate(breedObj);
  if (isValid) {
    //
    breeds.push(breedObj);
    renderBreedsTable(breeds);
    clearInputs();
    saveToStorage("breeds", JSON.stringify(breeds));
  }
});

//collect data and assign it to obj and return it
function collectData() {
  let id = 1;
  if (breeds.length > 0) {
    const ids = breeds.map((breed) => Number(breed.id));
    const maxId = Math.max(...ids);
    id = maxId + 1;
  }
  return {
    id: id,
    breed: inputBreed.value,
    type: inputType.value,
  };
}

//hàm dùng để validate
function validate(obj) {
  if (obj.breed === "") {
    alert("breed not be empty!");
    return false;
  }
  // else {
  //   const term = /^[A-Za-z ]+$/;
  //   if (!obj.breed.match(term)) {
  //     alert("breed contain number!");
  //     return false;
  //   }
  // }
  if (obj.type === "") {
    alert("type not be empty!");
    return false;
  }
  return true;
}
//hàm dùng để render breed
function renderBreedsTable(arr) {
  tbody.innerHTML = "";
  if (arr.length > 0) {
    for (let item of arr) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                                <td>${item.id}</td>
                                <td>${item.breed}</td>
                                <td>${item.type}</td>
                                <td>
                                    <button onclick="deleteBreedById('${item.id}')" type="button" class="btn btn-danger">Delete</button>
                                </td>
                            `;
      tbody.appendChild(tr);
    }
  }
}

//hàm reset form
function clearInputs() {
  inputBreed.value = "";
  inputType.value = "";
}

//hàm xoá breed
function deleteBreedById(id) {
  if (confirm("Are you sure?")) {
    breeds = breeds.filter((breed) => breed.id !== Number(id));
    if (breeds.length > 0) {
      saveToStorage("breeds", JSON.stringify(breeds));
      renderBreedsTable(breeds);
    } else {
      localStorage.removeItem("breeds");
      tbody.innerHTML = "";
    }
  }
}

//xử lí animation
nav.addEventListener("click", function () {
  this.classList.toggle("active");
});

const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");

//export data
exportBtn.addEventListener("click", function () {
  let pets = getFromStorage("pets") || [];
  if (pets.length > 0) {
    pets = JSON.parse(pets) || [];
    var blob = new Blob([JSON.stringify(pets)], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "data.json");
  }
});

//import data
importBtn.addEventListener("click", function () {
  var file = document.getElementById("input-file").files[0];
  if (file) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (ev) {
      // console.log(ev.target.result);
      const arr = JSON.parse(ev.target.result) || [];
      saveToStorage("pets", JSON.stringify(arr));
      document.getElementById("input-file").value = null;
      document.getElementById("test").style.display = "block";
    };
    reader.onerror = function (evt) {
      console.log("error reading file");
      document.getElementById("test").style.display = "block";
      document.getElementById("test").textContent = "Error reading file!!!";
    };
  } else {
    alert("vui long chon file");
  }
});

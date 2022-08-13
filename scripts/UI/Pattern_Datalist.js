import PATTERNS from "../Pattern/Pattern_list.js"


let datalist = document.getElementById("patterns_list")
for(var key in PATTERNS) {
    var command = PATTERNS[key]["command"];
    let option = document.createElement("option")
    option.innerText = command
    datalist.appendChild(option)
  }


export default datalist
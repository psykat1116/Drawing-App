let reset = document.getElementById("reset");
let save = document.getElementById("save");
let brushSize = document.getElementById("size");
let toolBtns = document.querySelectorAll(".tool");
let fillColor = document.getElementById("fill");
let colors = document.querySelectorAll(".color #option");
let colorPicker = document.getElementById("custom-color");
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

//Declareing All the Variables

let isDrawing = false,
  prevmouseX,
  prevmouseY,
  snapShot,
  brushWidth = 5,
  selectedTool = "brush",
  selectedColor = "#000";

// To get a white backgorund in the time of download

const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

//Set canvas size in time of loading

window.addEventListener("load", () => {
  //setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

//Drawing function of circle

const drawCircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(
    Math.pow(prevmouseX - e.offsetX, 2) + Math.pow(prevmouseY - e.offsetY, 2)
  );
  ctx.arc(prevmouseX, prevmouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

//Drwaing function of rectangle

const drawRect = (e) => {
  if (!fillColor.checked) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevmouseX - e.offsetX,
      prevmouseY - e.offsetY
    );
  }
  return ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevmouseX - e.offsetX,
    prevmouseY - e.offsetY
  );
};

//Drawing function of triangle

const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevmouseX, prevmouseY); //move triangle to the mouse pointer
  ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
  ctx.lineTo(prevmouseX * 2 - e.offsetX, e.offsetY); //Creating Bottom line of the triangle
  ctx.closePath(); //Closing path of the triangle so the third line draw automatically
  ctx.stroke();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

//Main drawing function

const drawing = (e) => {
  if (!isDrawing) {
    return;
  }
  ctx.putImageData(snapShot, 0, 0);
  //if the selected tool is eraser then set strokestyle to white
  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx.lineTo(e.offsetX, e.offsetY); // Creating line according to the mouse pointer
    ctx.stroke(); // drawing/filling line with color
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else {
    drawTriangle(e);
  }
};

// Changing acive class to show which item is selected

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".tool.active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.getAttribute("char");
    // console.log(btn.getAttribute("char"));
  });
});

//Changing Brush Size Function

brushSize.onchange = () => {
  brushWidth = brushSize.value;
};

//Change Brush colors funtion

colors.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

//Color Picking Functions

colorPicker.addEventListener("change", () => {
  //Passing picked color value from color picker to last color btn background
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

//Clear the drawing board

reset.onclick = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
};

document.querySelector(".fill-color").onclick = () => {
  fillColor.click();
};

//Saving the canvas image

save.onclick = () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
};

//Main Drawing function in time of clicking mouse

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  prevmouseX = e.offsetX;
  prevmouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
});
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

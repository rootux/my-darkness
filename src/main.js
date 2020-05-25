  
  const speed = 0; //100 // time delay of print out
  let index = 0; // start printing array at this posision
  const scrollAtLines = 20; // start scrolling up at this many lines
  const lineSpeed = 0; //500

  let textPost = 0;
  let content = '';
  let currentRow = 0;
   
  const destination = document.getElementById("typedtext");
  
  function typewriter(text, onNextStep)
  {
   let iArrLength = text[currentRow].length; // the length of the text array
   content =  ' ';
   currentRow = Math.max(0, index - scrollAtLines);
   
   while ( currentRow < index ) {
    content += text[currentRow++] + '<br />';
   }
   destination.innerHTML = content + text[index].substring(0, textPost) + "_";
   if ( textPost++ >= iArrLength ) {
    textPost = 0;
    index++;
    if ( index != text.length ) {
     iArrLength = text[index].length;
     setTimeout(() => {typewriter(text, onNextStep)}, lineSpeed);
    }else {
      onNextStep();
    }
   } else {
    setTimeout(() => {typewriter(text, onNextStep)}, speed);
   }
  }
  
(function () {
  const text = new Array(
    "Welcome brave soul to the big Cave simulation 🕳️⛰️", 
    "What is your name?",
    ""
    );
  typewriter(text, onNextStep);
})();

let currentState = 0;
let name;
const state = [
  () => { addInputElement("Name?", (enteredName) => {
    name = enteredName;
    onNextStep();
  }) },  
  () => {
    const text = new Array(`Hello ${name}`,
    "Are you ready to see your shadows and enter into the cave?")
    typewriter(text, onNextStep);
  },

  () => {
    console.log("DONE");
  }
];

function onNextStep() {
  index = 0;
  currentRow = 0;
  textPost = 0;
  content = '';
  return state[currentState++]();
}

function addInputElement(placeholder, onEnter) {
  const inputElement = document.createElement("input");
  inputElement.setAttribute("type", "text");
  inputElement.setAttribute("placeholder", placeholder);

  const formElement = document.createElement("form");
  formElement.onsubmit = event => {
    event.preventDefault();
    onEnter(inputElement.value);
  };
  
  formElement.appendChild(inputElement);

  const buttonElement = document.createElement("input");
  buttonElement.value = "Start";
  buttonElement.setAttribute("type", "submit");
  formElement.appendChild(buttonElement);
  destination.appendChild(formElement);

  inputElement.focus();
}

const speed = 30; // Time delay of print out
let index = 0; // start printing array at this posision
const scrollAtLines = 20; // Start scrolling up at this many lines
const lineSpeed = 500;
let currentState = 0; // Change this when debugging states

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
  if(text[index] == undefined) {
    return onNextStep();
  }
  destination.innerHTML = content + text[index].substring(0, textPost) + "_";
  if ( textPost++ >= iArrLength ) {
  textPost = 0;
  index++;
  if ( index != text.length ) {
    if(!text[index]) {
      setTimeout(() => {typewriter(text, onNextStep)}, lineSpeed);
      return;
    }
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

let name;
let lightParts;
let similarLightParts;

const state = [
() => {
  addInputElement("Name?", "Start", (enteredName) => {
  name = enteredName;
  onNextStep();
}) },

() => {
  const text = new Array(`Hello ${name}`,
  "Are you ready to see your shadows and enter into the cave?");
  typewriter(text, onNextStep);
},

() => {
  addButtonElement("YES", onNextStep);
},

() => {
  const text = new Array("What are shadows?",
  "A shadow is a part of our personality that is Repressed",
  "Those are parts that we are afraid to meet and to acknowledge",
  "",
  "It's scary to understand that this is part of us.",
  "So we throw them outside and fight with them outside of us.",
  "",
  "How will your good friend define you?",
  `For example - ${name} is Beautiful. ${name} is charming ${name} is strong`);
  typewriter(text, onNextStep);
},

() => {
  addInputElement("Beautiful charming strong", "Next", (enteredLightParts) => {
    lightParts = enteredLightParts.split(/[\s,]+/);
    onNextStep();
  });
},

async () => {
  const antonyms = await API.getAntonyms(lightParts);
  if(antonyms.length == 0 || !antonyms[0]) {
    typewriter(new Array("I could not find any shadows. Let's try again."), () => {
      currentState -= 2;
      onNextStep();
    });
    return;
  }
  antonyms.unshift("Here are your shadows:");
  typewriter(antonyms, onNextStep);
},

async () => {
  addButtonElement("Next", onNextStep);
},

async () => {
  similarLightParts = await API.getSimilars(lightParts);
  if(similarLightParts.length > 0 && similarLightParts[0]) {
    typewriter(new Array("Here are more of your light:", ...similarLightParts), onNextStep);
    return;
  } else {
    currentState++;
  };
},

async () => {
  const antonyms = await API.getAntonyms(similarLightParts);
  if(antonyms.length == 0 || !antonyms[0]) {
    onNextStep();
    return;
  }
  typewriter(new Array("Here are more of your shadows:", ...antonyms), onNextStep);
},

() => {
  addButtonElement("I want to learn more", onNextStep);
},

() => {
  typewriter(new Array("There is always something deep to learn from the shadow.",
  "",
  "If you want to learn more join us on our journey",
  "<a href='https://www.facebook.com/rootux'>Message Gal on Facebook</a>",
  "Thank you"), () => {console.log("Done")});
},
];

function onNextStep() {
  index = 0;
  currentRow = 0;
  textPost = 0;
  content = '';
  return state[currentState++]();
}

function addInputElement(placeholder, buttonText, onEnter) {
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
  buttonElement.value = buttonText;
  buttonElement.setAttribute("type", "submit");
  formElement.appendChild(buttonElement);
  destination.appendChild(formElement);

  inputElement.focus();
}

function addButtonElement(text, onEnter) {
  const formElement = document.createElement("form");
  formElement.onsubmit = event => {
    event.preventDefault();
    onEnter();
  };

  const buttonElement = document.createElement("input");
  buttonElement.value = text;
  buttonElement.setAttribute("type", "submit");
  formElement.appendChild(buttonElement);
  destination.appendChild(formElement);
}
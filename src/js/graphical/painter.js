export default function generateRandomBG(night) {
  let cont = document.getElementById("container");
  cont.style.backgroundColor = generateRandomBGColor("", false, .85, night);
}
function randomStringFromArray(array) {
  let randomNumber = Math.floor(Math.random()*array.length);
  return array[randomNumber];
}
function randomFloatFromIndexToOne(index, span) {
  let result = span*(Math.random()*(1-index)+index);
  return result;
}
function randomFloatFromZeroToIndex(index, span) {
  let result = span*Math.random()*(1-index);
  return result;
}
export function generateRandomBGColor(color, gradient, cursorIndex, night) {
  let randomizer = night ? randomFloatFromZeroToIndex : randomFloatFromIndexToOne;
  let bg = color ? color : "rgb("+randomizer(cursorIndex,255)+","+randomizer(cursorIndex,255)+","+randomizer(cursorIndex,255)+")";
  if (gradient){
    let gradientDirections = ['to bottom','to top','to left','to right','to top right','to top left','to bottom right','to bottom left'];
    bg = "linear-gradient("+randomStringFromArray(gradientDirections)+", "+bg+" 10%, #ffffff 100%)";
  }
  return bg;
}

export default function mapPanelControls(){
  let componentMap = [
    {id:"dragme",event:"mousedown",f:grabPanel},
    {id:"dragme",event:"mouseenter",f:hoverPanel},
    {id:"dragme",event:"mouseleave",f:dropPanel}
  ];
  componentMap.forEach((item) => {
      const comp = document.getElementById(item.id);
      comp.addEventListener(item.event,item.f);
  });
  var dm = document.getElementById('dragme');
  dm.addEventListener('dragstart',drag_start,false);
  document.body.addEventListener('dragover',drag_over,false);
  document.body.addEventListener('drop',drop,false);
}
function drag_start(event) {
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
}
function drag_over(event) {
    event.preventDefault();
    return false;
}
function drop(event) {
    var offset = event.dataTransfer.getData("text/plain").split(',');
    var dm = document.getElementById('dragme');
    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    event.preventDefault();
    return false;
}
function grabPanel() {
  setCursor("grabbing");
} function hoverPanel() {
  setCursor("grab");
} function dropPanel() {
  setCursor("default");
} function setCursor(cursor) {
  document.body.style.cursor = cursor;
}

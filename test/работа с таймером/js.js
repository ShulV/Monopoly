//установка времени для обратного отсчёта
var startTime = new Date().getTime();
var timerId;
var timeout = 10;
const timerText=document.getElementById("timer-text");
function startTimer() {
  startTime = new Date();
  timerId  = setInterval(timer, 1000);
}

function timer() {
  let curTime = new Date().getTime();
  let remainingTime = Math.floor((curTime - startTime)/1000);
  remainingTime = timeout - remainingTime;
  timerText.textContent = remainingTime + " с";
  
  if (remainingTime == 0) {
    clearInterval(timerId);
    alert("Вы проиграли!")
  }
}

//обновляем таймер каждую секунду


// setTimeout(() => {
//   console.log();
// }, 2000);

let timerId;
let outerResolve;

function deleteTimer(){
  console.log("таймер остановлен");
  clearTimeout(timerId);
  outerResolve();
}


function sleep(ms) {
  return new Promise(resolve => {
    outerResolve = resolve;
    timerId = setTimeout(resolve, ms);
  });
}
 
async function func() {
  console.log("до sleep");
  await sleep(10000);
  console.log("после sleep");
}
 
func();
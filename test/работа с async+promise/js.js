function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
 
async function delayedGreeting() {
  console.log("до sleep");
  await sleep(2000);
  console.log("после sleep");
}
 
delayedGreeting();


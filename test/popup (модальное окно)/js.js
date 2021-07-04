function openPopup(){
  let popup = document.getElementById("popup")
  console.log(popup);
  popup.style.display = "block";
}

function closePopup(){
  let popup = document.getElementById("popup")
  console.log(popup);
  popup.style.display = "none";
}

function buyField(){
  alert("Если деньги были, поле купили, деньги забрали");
  closePopup();
}

function putUpForAuction(){
  alert("Выставили на аукцион");
  closePopup();
}
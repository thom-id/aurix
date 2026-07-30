// ===============================
// SHOP ROLE - BlazeTopia
// ===============================

// Accordion
function toggleRole(element){

const content = element.nextElementSibling;
const allContents = document.querySelectorAll(".role-content");
const allArrows = document.querySelectorAll(".arrow");

// Tutup semua card
allContents.forEach(item=>{
if(item !== content){
item.classList.remove("active");
}
});

allArrows.forEach(arrow=>{
if(arrow !== element.querySelector(".arrow")){
arrow.innerHTML = "▼";
}
});

// Toggle card yang dipilih
content.classList.toggle("active");

const arrow = element.querySelector(".arrow");

if(content.classList.contains("active")){
arrow.innerHTML = "▲";
}else{
arrow.innerHTML = "▼";
}

}

// ===============================
// POPUP
// ===============================

const popup = document.getElementById("purchasePopup");
const roleName = document.getElementById("roleName");
const rolePrice = document.getElementById("rolePrice");

// Buka popup
function openPurchase(role, price){

roleName.value = role;
rolePrice.value = "Rp. " + Number(price).toLocaleString("id-ID");

popup.style.display = "flex";

}

// Tutup popup
function closePopup(){

popup.style.display = "none";

}

// Klik area luar popup
window.onclick = function(e){

if(e.target == popup){

closePopup();

}

}

// ESC untuk tutup popup
document.addEventListener("keydown",function(e){

if(e.key === "Escape"){

closePopup();

}

});

// ===============================
// COMPLETE PURCHASE
// ===============================

function completePurchase(){

const growid = document.getElementById("growid").value.trim();
const discord = document.getElementById("discord").value.trim();

const checkbox = document.querySelector(".check input");

if(growid === ""){

alert("Please enter your GrowID.");

return;

}

if(discord === ""){

alert("Please enter your Discord Username.");

return;

}

if(!checkbox.checked){

alert("Please confirm that you have completed the payment.");

return;

}

// Nanti bisa diganti Discord Webhook / Firebase

alert(
"Purchase Submitted!\n\n" +
"Role : " + roleName.value +
"\nPrice : " + rolePrice.value +
"\nGrowID : " + growid +
"\nDiscord : " + discord
);

// Reset form

document.getElementById("growid").value = "";
document.getElementById("discord").value = "";
checkbox.checked = false;

closePopup();

}

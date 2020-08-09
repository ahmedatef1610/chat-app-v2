const socket = io();
let myId = document.getElementById("myId").value;
const btn = document.getElementById("friendRequestsDropdown");
const dropdown = document.querySelector(".dropdown");
/************************************************************/
socket.on("connect", () => {
  socket.emit("joinNotificationsRoom", myId);
  socket.emit("goOnline", myId);
});
/***************/
socket.on("newFriendRequest", (data) => {
  const friendRequests = document.getElementById("friendRequests");

  const span = friendRequests.querySelector("span");
  if (span) {
    span.remove();
  }

  friendRequests.innerHTML += `
    <a class="dropdown-item" href="/profile/${data.id}">
        ${data.name}
    </a>`;

    if(document.querySelector(".dropdown .numberRequests")){
       let num = +document.querySelector(".dropdown .numberRequests").textContent;
       document.querySelector(".dropdown .numberRequests").textContent = ++num;
    }else{
        dropdown.insertAdjacentHTML("beforeend", `<div class="numberRequests text-white bg-warning">1</div>`);
    }
});

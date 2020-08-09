socket.emit("getOnlineFriends", myId);

socket.on("onlineFriends", (friends) => {

  let div = document.getElementById("onlineFriends");

  if (friends.length === 0) {
    div.innerHTML = `<p class="alert alert-danger">No online friends</p>`;
  } else {
    let html = `<div class="row">`;
    for (let friend of friends) {
      html += `     
        <div class="col col-12 col-md-6 col-lg-4">
            <div class="card" style="height: 100%;">
                <img src="/${friend.image}" class="card-img-top" alt="${friend.name}">
                <div class="card-body d-flex flex-column justify-content-end">
                    <h3 class="card-title">
                        <a class="" href="/profile/${friend.id}">${friend.name}</a>
                    </h3>
                    <a href="/chat/${friend.chatId}" class="btn btn-primary">Chat</a>
                </div>
            </div>
        </div>`;
    }
    html += "</div>";
    div.innerHTML = html;
  }
});

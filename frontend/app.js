const socket = io("ws://127.0.0.1:4000");

const appendVotingToList = (id, topic) => {
  const li = document.createElement("li");
  const spanDetail = document.createElement("span");
  const spanResult = document.createElement("span");
  spanDetail.innerHTML = "ID: " + id + " | Topic: " + topic;
  spanResult.id = "v-v-" + id;
  li.id = "v-" + id;
  li.appendChild(spanDetail);
  li.appendChild(spanResult);
  document.getElementById("voting_list").appendChild(li);
};

const manipulateVotingResult = (result) => {
  document.getElementById(
    "v-v-" + result.id
  ).innerHTML = ` -- Yes: ${result.yes} No: ${result.no} Nah: ${result.nah}`;
};

// Connection
socket.on("connection", (msg) => {
  const v = JSON.parse(msg);
  v.forEach((voting) => {
    appendVotingToList(voting.id, voting.topic);
    manipulateVotingResult(voting);
  });
});

// Create Voting
document.getElementById("i_create_voting").addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit(
    "create_voting",
    JSON.stringify({
      id: document.getElementById("i_id").value,
      topic: document.getElementById("i_topic").value,
    })
  );
  document.getElementById("i_id").value = "";
  document.getElementById("i_topic").value = "";
});

socket.on("create_voting", (msg) => {
  const v = JSON.parse(msg);
  if (v.errors) {
    alert(v.errors.join(", "));
    return;
  }

  appendVotingToList(v.id, v.topic);
});

// Vote
document.getElementById("s_vote").addEventListener("submit", (e) => {
  e.preventDefault();
  const select = document.getElementById("s_option");
  socket.emit(
    "vote",
    JSON.stringify({
      id: document.getElementById("s_id").value,
      vote: select.options[select.selectedIndex].value,
    })
  );
  document.getElementById("i_id").value = "";
  document.getElementById("i_topic").value = "";
});

socket.on("vote", (msg) => {
  const v = JSON.parse(msg);
  if (v.errors) {
    alert(v.errors.join(", "));
    return;
  }
  manipulateVotingResult(v);
});

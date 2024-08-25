"use strict";

const PresentFinder = {
  selector: {
    input: ".input-present",
    searchBtn: ".btn-preset",
    searchResultList: ".js-search-result-list",
  },
};

PresentFinder.init = () => {
  PresentFinder.getSearchTerm();
  PresentFinder.searchTrigger();
};

PresentFinder.getJSONData = () => {
  const data = fetch("/presents.json")
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log("error:", error));
  return data;
};

PresentFinder.getSearchTerm = () => {
  let { selector } = PresentFinder;
  const input = document.querySelector(selector.input);
  const searchTerm = input.value.toLowerCase();
  return searchTerm;
};

PresentFinder.createMemberElement = (member, resultLove, resultLike, image) => {
  const searchResultList = document.querySelector(
    PresentFinder.selector.searchResultList
  );
  const memberBox = document.createElement("div");
  memberBox.classList.add("member-box");
  let html = `<h2 class="js-member-name">${member}</h2><div class="member-image"><img src="${image}" alt="${member}"/></div><div class="presents">`;
  if (resultLike.length > 0 && resultLove.length === 0) {
    memberBox.innerHTML =
      html +
      `<h3>Likes</h3><div class="presents-content">${resultLike}</div></div>`;
  }
  if (resultLove.length > 0 && resultLike.length === 0) {
    memberBox.innerHTML =
      html +
      `<h3>Loves</h3><div class="presents-content">${resultLove}</div></div>`;
    console.log(html);
  }
  if (resultLove.length > 0 && resultLike.length > 0) {
    memberBox.innerHTML =
      html +
      `<h3>Loves</h3><div class="presents-content">${resultLove}</div><h3>Likes</h3><div class="presents-content">${resultLike}</div></div>`;
  }
  searchResultList.append(memberBox);
};

PresentFinder.searchTrigger = (e) => {
  let { selector } = PresentFinder;
  const searchBtn = document.querySelector(selector.searchBtn);
  const input = document.querySelector(selector.input);
  let searchTerm = "";
  let data = PresentFinder.getJSONData();
  const output = (obj, member, image) => {
    const { love, like } = obj;
    let resultLove = love.filter((el) =>
      el.toLowerCase().includes(searchTerm.toLowerCase())
    );
    let resultLike = like.filter((el) =>
      el.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (resultLove.length === 0 && resultLike.length === 0) return;
    if (resultLove.length > 0 || resultLike.length > 0) {
      PresentFinder.createMemberElement(member, resultLove, resultLike, image);
    }
  };

  const getResults = (e) => {
    e.preventDefault();
    const searchResultList = document.querySelector(selector.searchResultList);
    searchResultList.innerHTML = "";
    searchTerm = PresentFinder.getSearchTerm();
    data.then((clanMemberPresents) => {
      for (const [member, obj] of Object.entries(clanMemberPresents)) {
        const image = obj.image;
        output(obj.presents, member, image);
      }
    });
  };

  searchBtn.addEventListener("click", (e) => {
    getResults(e);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") getResults(e);
  });
};

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  // call on next available tick
  PresentFinder.init();
} else {
  document.addEventListener("DOMContentLoaded", PresentFinder.init);
}

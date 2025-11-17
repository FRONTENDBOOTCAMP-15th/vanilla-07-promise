
interface Writer {
  name: string;
  img: string;
  link: string;
}

const writers: Writer[] = [
  { name: "그레이스", img: "../../../assets/images/mybox-icons/grace.svg", link: "/writerhome.html" },
  { name: "베이스", img: "../../../assets/images/mybox-icons/base.svg", link: "/writerhome.html" },
  { name: "톰요크", img: "../../../assets/images/mybox-icons/tomyork.svg", link: "/writerhome.html" },
  { name: "그레이스", img: "../../../assets/images/mybox-icons/grace.svg", link: "/writerhome.html" },
];

const list = document.querySelector(".fav-writers__list") as HTMLUListElement;

list.innerHTML = "";

writers.forEach((writer) => {
  const li = document.createElement("li");
  li.className = "fav-writers__item";

  li.innerHTML = `
    <img src="${writer.img}" alt="${writer.name}" />
    <p>${writer.name}</p>
  `;

  li.addEventListener("click", () => {
    window.location.href = writer.link;
  });

  list.appendChild(li);
});

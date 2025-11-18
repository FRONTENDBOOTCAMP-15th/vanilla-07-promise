import type { FavWriter } from "../../types/mybox-type/mybox-type";
import { getAxios } from "../utils/axios";

// 관심 작가

async function getWriterData(){
  const axios = getAxios();
  try{
    const {data} = await axios.get('/bookmarks/user', {
      headers:{
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjksInR5cGUiOiJzZWxsZXIiLCJuYW1lIjoiQUnrn6wg7J207LGE66y4IiwiZW1haWwiOiJ3M0BnbWFpbC5jb20iLCJpbWFnZSI6Imh0dHBzOi8vcmVzLmNsb3VkaW5hcnkuY29tL2RkZWRzbHF2di9pbWFnZS91cGxvYWQvdjE3NjI4NDcwMTkvZmViYzE1LXZhbmlsbGEwNy1lY2FkLzNrZlRaY2RnMWkud2VicCIsImxvZ2luVHlwZSI6Imtha2FvIiwiaWF0IjoxNzYzNDY0MDI4LCJleHAiOjE3NjM1NTA0MjgsImlzcyI6IkZFQkMifQ.uHbg9U4qVTOh1MpwTr6D1Qi1pP-hCKCMf9SXXjtRAAg"
      }
      });
    console.log(data);
    return data;
  }catch(err){
    console.log(err);
  }
}

function renderWriters(writers: FavWriter[]){
  const result = writers.map(writer => {
    return `
    <li class="fav-writers__item">
      <a href="../writerhome/writerhome.html">
        <img src="${writer.user.image}" alt="${writer.user.name}" />
        <p>${writer.user.name}</p>
      </a>
    </li>
    `;
  });

  const list = document.querySelector('.fav-writers__list');
  if(list){
    list.innerHTML = result.join('');
  }
}

function renderEmtyFavWriter() {
  const list = document.querySelector('.fav-writers__list');
  if(list) {
    list.innerHTML = `<li class="fav-writers__noItem"><p>등록된 관심 작가가 없습니다.<p></li>`;
  }
}

const writerData = await getWriterData();

if (!writerData?.ok || !Array.isArray(writerData.item) || writerData.item.length === 0) {
  renderEmtyFavWriter();
}else {
  renderWriters(writerData.item);
}

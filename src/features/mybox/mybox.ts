import type { FavWriter } from "../../types/mybox-type/mybox-type";
import { getAxios } from "../utils/axios";

// 관심 작가

async function getWriterData(){
  const axios = getAxios();
  try{
    const {data} = await axios.get('/bookmarks/user', {
      headers:{
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjIsInR5cGUiOiJzZWxsZXIiLCJuYW1lIjoiQUIiLCJlbWFpbCI6IncxQG1hcmtldC5jb20iLCJpbWFnZSI6Imh0dHBzOi8vcmVzLmNsb3VkaW5hcnkuY29tL2RkZWRzbHF2di9pbWFnZS91cGxvYWQvdjE3NjI4NDcwMTkvZmViYzE1LXZhbmlsbGEwNy1lY2FkL2NTNDlkYWRMbEYud2VicCIsImxvZ2luVHlwZSI6ImVtYWlsIiwiaWF0IjoxNzYzMzY5MDkyLCJleHAiOjE3NjM0NTU0OTIsImlzcyI6IkZFQkMifQ.3qgPPptY1iWbKBaJWW6xJgtYdsznftQtKOt0PzWzztk"
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

const writerData = await getWriterData();
if(writerData?.ok){
  renderWriters(writerData.item);
}


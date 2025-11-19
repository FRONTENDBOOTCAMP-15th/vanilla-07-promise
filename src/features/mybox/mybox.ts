import { TEMP_TOKEN } from "../../common/token";
import type { FavPost, FavWriter } from "../../types/mybox-type/mybox-type";
import { getAxios } from "../utils/axios";



// 관심 작가

async function getWriterData(){
  const axios = getAxios();
  try{
    const {data} = await axios.get('/bookmarks/user', {
      headers:{
        Authorization: `Bearer ${TEMP_TOKEN}`,
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

// 관심 글

async function getPostData(){
  const axios = getAxios();
  try{
    const {data} = await axios.get('/bookmarks/post', {
      headers:{
        Authorization: `Bearer ${TEMP_TOKEN}`,
      }
      });
    console.log(data);
    return data;
  }catch(err){
    console.log(err);
  }
}

function renderPosts(posts: FavPost[]){
  const result = posts.map(post => {
    const noImg = post.post.image && post.post.image.startsWith("http")
      ? post.post.image
      : "/assets/images/mybox-icons/no-img.svg";

    return `
      <li class="fav-books__item">
        <a href="../detail/detail.html">
          <img src="${noImg}" alt="${post.post.title}" />
            <p class="fav-books__booktitle">${post.post.title}</p>
            <p class="fav-books__name"><img src="/assets/images/mybox-icons/by.svg" alt="" />${post.post.user.name}</p>
        </a>
      </li>
    `;
  });

  const list = document.querySelector('.fav-books__list');
  if(list){
    list.innerHTML = result.join('');
  }

}

function renderEmtyFavBooks() {
  const list = document.querySelector('.fav-books__list');
  if(list) {
    list.innerHTML = `<li class="fav-books__noItem"><p>등록된 관심 글이 없습니다.<p></li>`;
  }
}

const postData = await getPostData();

if (!postData?.ok || !Array.isArray(postData.item) || postData.item.length === 0) {
  renderEmtyFavBooks();
}else {
  renderPosts(postData.item);
}
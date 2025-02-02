export { createrRowInteraction, pullSongFromBd, updateRowList, closeContentMenu };

const musicListContainer = document.getElementById("music_list_container");
const contentMenuFlex = document.getElementById("content_menu_flex_id");
const defaultButton = document.getElementById("default_button");
const songVolumeRange = document.getElementById("song_Volume");
const tuneMenuImg = document.querySelector(".tune_menu_img");
const sfxVolumeRange = document.getElementById("sfx_Volume");
const stopButton = document.getElementById("stop_button");
const closeButton = document.querySelector(".close_zone");
const leftSide = document.querySelector('.left_side');
const tuneMenu = document.querySelector(".tune_menu");
let rowList = document.querySelectorAll(".row");
let biger600 = null;


const rowclick = new Audio("/sfx/row_clickSFX.wav");
const hoverSFX = new Audio("/sfx/hoverSFX.wav");

rowclick.volume = 0.5;
hoverSFX.volume = 0.5;
let currentAudio = null;
let currentAudioVolume = 50;

let curentBannerPath = "#";
let curentSongName = "#";
let curentSongAuthor = "#";
let curentSongLyrics = "#";
var test = 0;



function createrRowInteraction(){
  rowList.forEach((row, index) => {
    row.addEventListener("click", () => {
      rowList.forEach((row) => row.setAttribute("aria-selected", "false"));
      row.setAttribute("aria-selected", "true");
  
      let currentSongPath = row.getAttribute("data-path");

      curentBannerPath = row.getAttribute("banner-path");
      curentSongName = row.querySelector("#song_name")?.textContent.trim(); 
      curentSongAuthor = row.querySelector("#song_author")?.textContent.trim();
      curentSongLyrics = row.getAttribute("lyrics-path"); // хотя тут

      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
  
      currentAudio = new Audio(currentSongPath);
      currentAudio.volume = currentAudioVolume / 100;
      currentAudio.loop = true;
      currentAudio.play();
   
      rowclickPlay();            
      createContentMenu();        
      deletePastContentMenu();    
    }); 
  
    row.addEventListener("mouseenter", () => {
      hoverSFXPlay();
    });

    row.style.animationDelay = `${index * 0.03}s`;
  });
};

function updateRowList(){
  rowList = document.querySelectorAll("#music_list_container .row");
};


//Блок SfX
function rowclickPlay() {
  rowclick.currentTime = 0;
  rowclick.play();
}

function hoverSFXPlay() {
  hoverSFX.currentTime = 0;
  hoverSFX.play();
}

sfxVolumeRange.addEventListener("input", () => {
  const sfxValue = sfxVolumeRange.value / 100;
  hoverSFX.volume = sfxValue;
  rowclick.volume = sfxValue;
});

//Меню регулировки звука
tuneMenuImg.addEventListener("click", () => {
  tuneMenu.classList.toggle("active");
  tuneMenuImg.classList.toggle("active");
  rowclickPlay();
});

closeButton.addEventListener("click", () => {
  tuneMenu.classList.remove("active");
  rowclickPlay();
});

defaultButton.addEventListener("click", () => {
  hoverSFX.volume = 0.5; 
  rowclick.volume = 0.5; 
  if (currentAudio) { 
    currentAudio.volume = 0.5;
    currentAudioVolume = 50;
  }
  songVolumeRange.value = 50;
  sfxVolumeRange.value = 50;
});

stopButton.addEventListener("click", () => {
  if(currentAudio){
    currentAudio.pause();
    currentAudio.currntTime = 0;
  }
});

songVolumeRange.addEventListener("input", () => {
  currentAudioVolume = songVolumeRange.value;
  if (currentAudio) {
    currentAudio.volume = currentAudioVolume / 100;
  }
});


// Создание и удаления лишних контетн менюшек
function createContentMenu() {
  let htmlPattern = `
  <div class="content_menu_animation" id="content_menu_animation_id">
    <div class="content_menu_frame_red">
      <div class="content_menu_frame_gray">
        <div class="content_flex">
          <div class="content_menu_top_bar">
            <img class="music_banner" src="${curentBannerPath}" alt="#">
          </div>
          <div class="content_info_bar_flex">
            <div class="content_song_name">${curentSongName}</div>
            <div class="deco_gap"></div>
            <div class="content_song_author">${curentSongAuthor}</div>
          </div>
          <div class="song_lyrics">${curentSongLyrics}</div>
        </div>
      </div>
    </div>
  </div>
  `;
  
  if (contentMenuFlex.childElementCount < 5) {
    
    if (window.innerWidth <= 600){
      leftSide.insertAdjacentHTML("beforeend", htmlPattern);
      addEventonBaner();
      biger600 = false;
    } else{
      contentMenuFlex.insertAdjacentHTML("beforeend", htmlPattern);
      addEventonBaner();
      biger600 = true;
    }

  } else {
    console.log("лимит, сука");
  }
}

function addEventonBaner(){
  const musicBanners = document.querySelectorAll(".music_banner");
  musicBanners.forEach(banner => {
    banner.addEventListener("click", () => {closeContentMenu()});
  });
}

function closeContentMenu() {

  if(biger600 === true){
    contentMenuFlex.querySelectorAll('.content_menu_animation').forEach(el => {
      el.style.animationName = 'slide-down';
      el.remove;
    });
  } else {
    leftSide.querySelectorAll('.content_menu_animation').forEach(el => {
      el.style.animationName = 'slide-down';
      el.remove;
    });
  }

  if (currentAudio.volume) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
}

function deletePastContentMenu() {
  if (contentMenuFlex.childElementCount > 3) {
    setTimeout(() => contentMenuFlex.firstElementChild.remove(), 400);
  }
}

async function pullSongFromBd(searchResault){
  const requestedSong = await fetch('http://185.253.7.121:3000/AraGanYa/songs', {
    method: "POST",
    body: JSON.stringify({ searchResault }),
    headers: {"Content-Type": "application/json"},
  });
  const data = await requestedSong.json();
  
  let rowLСontainer  = document.getElementById('music_list_container');
  rowLСontainer.innerHTML = data;

  updateRowList(); 
  createrRowInteraction();
};





















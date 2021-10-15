const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const listAnimation = [
  "animate__bounceInRight",
  "animate__bounceInLeft",
  "animate__backInUp",
  "animate__backInRight",
  "animate__backInLeft",
  "animate__backInLeft",
  "animate__heartBeat",
  "animate__wobble",
  "animate__swing",
];

const animation = $$("figure");
animation.forEach((e) => {
  e.classList.add("animate__animated");
  e.classList.add(`${listAnimation[Math.floor(Math.random() * listAnimation.length)]}`);
  e.classList.add("animate__delay-2s");
  e.classList.add("animate__slow");
  // e.classList.add("animate__repeat-2");
});

const PLAYER_STORAGE_KEY = "TA_player";

const header = $("header h2");
const cdThump = $(".cd-thumb");
const audio = $("#audio");
const btnPlay = $(".control .btn-toggle-play");
const player = $(".player");
const cd = $(".cd");
const progress = $("#progress");
const next = $(".btn.btn-next");
const prev = $(".btn.btn-prev");
const random = $(".btn.btn-random");
const repeat = $(".btn.btn-repeat");
const playlist = $(".playlist");
const timechange = $(".timeChange");
const timeTotal = $(".timeTotal");
const app = {
  currentTotalTime: 0,
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Nếu Ngày Ấy",
      singer: "Justin Beiber",
      path: "./audio/Nếu Ngày Ấy.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },
    {
      name: "Baby",
      singer: "Justin Beiber",
      path: "./audio/Baby - Justin Bieber_ Ludacris.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },

    {
      name: "Love Yoursel",
      singer: "Justin Beiber",
      path: "./audio/LoveYourself-JustinBieber-5319409.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },
    {
      name: "Peaches",
      singer: "Tùng Núi MTP",
      path: "./audio/Peaches-JustinBieberDanielCaesarGiveon-6977394.mp3",
      image: "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
    },

    {
      name: "Như Ngày Hôm Qua",
      singer: "Tùng Núi MTP",
      path: "./audio/NhuNgayHomQuaUpgrade-SonTungMTP-4282962.mp3",
      image: "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${index === this.currentIndex ? "active" : ""}" data-index =${index}>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
            </div>
            <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>`;
    });
    playlist.innerHTML = htmls.join("");
  },
  defaultProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  handleEvent: function () {
    //xu ly keo scroll
    document.onscroll = function () {
      // console.log(document.documentElement.scrollTop)

      const scrollTop = document.documentElement.scrollTop;
      const newcdWidth = cdWidth - scrollTop > 0 ? cdWidth - scrollTop : 0;

      cd.style.width = newcdWidth + "px";
      cd.style.opacity = newcdWidth / cdWidth;
    };
    // progress.value = 0
    //xu ly btn Play
    var _this = this;
    btnPlay.onclick = () => {
      if (_this.isPlaying === false) {
        btnPlay.innerHTML = `<i class="fa fa-pause icon-pause"></i>`;

        _this.isPlaying = true;
        audio.play();
      } else {
        btnPlay.innerHTML = `<i class="fa fa-play icon-play"></i>`;

        _this.isPlaying = false;
        audio.pause();
      }
    };
    //khi song dduoc play
    audio.onplay = () => {
      player.classList.add("playing");
      _this.isPlaying = true;
      // timeTotal.innerText = 0
    };
    audio.onpause = () => {
      player.classList.remove("playing");
      _this.isPlaying = false;
    };
    //lay thoi gian dang chay
    audio.onloadedmetadata = function () {
      timeTotal.innerText = Math.round((audio.duration / 60) * 100) / 100;
      progress.value = 0;
      timechange.innerText = "0.00";
    };
    audio.ontimeupdate = () => {
      // console.log(audio);
      //xu ly totalTIme
      progress.value = (audio.currentTime / audio.duration) * 100;
      timechange.innerText = `${String(Math.round((audio.currentTime / 60) * 100) / 100)}0`.slice(0, 4);
    };
    //xu ly khi tua song
    progress.onchange = (event) => {
      audio.currentTime = (audio.duration * event.target.value) / 100;
      // console.log((audio.duration * event.target.value)/100)
    };

    // xu ly tbn next
    next.onclick = (e) => {
      if (_this.isRandom) {
        _this.loadRandom();
      } else {
        _this.currentIndex++;
        if (_this.currentIndex >= _this.songs.length) {
          _this.currentIndex = 0;
        }
        _this.loadFirstMusic();
      }
      audio.play();
      _this.render();
      // keo thanh scroll theo active
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    };
    //nut prev
    prev.onclick = (e) => {
      if (_this.isRandom) {
        _this.loadRandom();
      } else {
        _this.currentIndex--;
        if (_this.currentIndex < 0) {
          _this.currentIndex = _this.songs.length - 1;
        }
        _this.loadFirstMusic();
      }
      audio.play();
      _this.render();
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    };

    //xu ly khi audio on end
    audio.onended = function () {
      // cach 1
      // if(_this.isRandom){
      //     _this.loadRandom()
      // }
      // else{
      //     _this.currentIndex ++
      //     if(_this.currentIndex >= _this.songs.length){
      //         _this.currentIndex = 0;
      //     }
      //     _this.loadFirstMusic()
      // }
      // audio.play()

      // cach 2
      if (_this.isRepeat) {
        audio.play();
      } else {
        next.click(); //giong nhu btn nex tu kick hoat
      }
    };
  },
  loadFirstMusic: function () {
    header.innerText = this.currentSong.name;
    audio.src = this.currentSong.path;
  },
  loadRandom: function () {
    var nextRandom;
    do {
      nextRandom = Math.floor(Math.random() * this.songs.length);
    } while (nextRandom === this.currentIndex);
    this.currentIndex = nextRandom;
    this.loadFirstMusic();
  },
  loadRepeat: function () {},
  start: function () {
    //dinh nghia cac thuoc tinh cho Object. get currentSong
    this.defaultProperties();
    //xu ly event
    this.handleEvent();
    //load bai hat dau tien
    this.loadFirstMusic();
    //render bai hat
    this.render();
    //hien thi btn
  },
};
app.start();

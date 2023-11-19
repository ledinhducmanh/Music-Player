/**
 * 1. render song
 * 2. scroll top
 * 3. play pause and seek
 * 4. CD rotate
 * 5. next / perv
 * 6. random
 * 7. next/ repeat when ended
 * 8. active song
 * 9. scroll active song into view
 * 10. play song when click
 */
// ============================================

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// const PLAYER_STORAGE_KEY = 'Music Player'

const nameCurrentSong = $('header h2')
const cdPlayer = $('.cd-thumb')

const audio = $('.audio')
const player = $('.player')
const togglePlayBtn = $('.btn-toggle')

const progress = $('#progress')
const timeLeft = $('.time-left')
const timeRight = $('.time-right')

const volumeControl = $('#volumeProgressBar');
const volumeBtn = $('.btn-volume');

const backwardSong = $('.btn-backward')
const forwardSong = $('.btn-forward')

const randomSong = $('.btn-random')
const repeatSong = $('.btn-repeat')

const playList = $('.play-list')

const appPlayer = {
    currentIndex: 0,
    isPlay: false,
    isRandom: false,
    isRepeat: false,
    // config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY) || {}), 
    // setConfig(key , value) {
    //     this.config[key] = value
    //     localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    // },
    songs: [
        {
            name: 'Tình Cờ Yêu Em',
            singer: 'Kuun Đức Nam ft Linh Thộn',
            path: "./assets/music/TinhCoYeuEm.mp3",
            img: "./assets/img/TinhCoYeuEm.jpg"
        },
        {
            name: 'Tình Yêu Chậm Trễ',
            singer: 'MONSTAR · GREY D',
            path: "./assets/music/TinhYeuChamTre.weba",
            img: "./assets/img/TinhYeuChamTre.jpg"
        },
        {
            name: 'Bao tiền một mớ bình yên',
            singer: '14 Casper, Bon Nghiêm',
            path: "./assets/music/BaoTienMotMoBinhYen.mp3",
            img: "./assets/img/BaoTienMotMoBinhYen.jpg"
        },
        {
            name: 'Tháng năm',
            singer: 'Soobin Hoàng Sơn',
            path: "./assets/music/ThangNam.mp3",
            img: "./assets/img/ThangNam.png"
        },
        {
            name: 'Sinh ra đã là thứ đối lập nhau',
            singer: 'Emcee L (Da  LAB) ft. Badbies',
            path: "./assets/music/SinhRaDaLaThuDoiLapNhau.mp3",
            img: "./assets/img/SinhRaDaLaThuDoiLapNhau.png"
        },
        {
            name: 'Nàng thơ',
            singer: 'Hoàng Dũng',
            path: "./assets/music/NangTho.mp3",
            img: "./assets/img/NangTho.png"
        },
        {
            name: 'Chờ đợi có đáng sợ',
            singer: 'Andiez',
            path: "./assets/music/ChoDoiCoDangSo.mp3",
            img: "./assets/img/ChoDoiCoDangSo.png"
        },
        {
            name: 'Đường tôi chở em về',
            singer: 'buitruonglinh',
            path: "./assets/music/DuongToiChoEmVe.mp3",
            img: "./assets/img/DuongToiChoEmVe.png"
        },
        {
            name: 'Như anh đã thấy em',
            singer: 'PhucXp',
            path: "./assets/music/NhuAnhDaThayEm.mp3",
            img: "./assets/img/NhuAnhDaThayEm.jpg"
        },
        
    ],
    render() {
        const html = this.songs.map((song , index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'activeSong' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.img}');"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                        <div class="option-menu" onclick="console.log('This song need to remove')">
                            <p>Delete Song</p>
                        </div>
                    </div>
                </div>
            `
        }) // html lúc này đang là 1 mảng

        playList.innerHTML = html.join('')
    },
    defindProperties() {
        //                  Biến appPlayer | Tên key | Giá trị sẽ đưa ra khi được gọi: appPlayer.currentSong return (*)
        //                      |         |               |
        //                      V         V               V
        Object.defineProperty(this , 'currentSong', {
            get() {
                return this.songs[this.currentIndex] // (*)
            }
        })
    },
    handleEvent() {
        // Xử Lý Scroll top CD

        const _this = this

        const cdWidth = cdPlayer.offsetWidth
        const cdHeight = cdPlayer.offsetHeight
        document.onscroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            const newCdHeight = cdHeight - scrollTop

            Object.assign(cdPlayer.style, {
                height: newCdHeight > 0 ?  newCdHeight + 'px': 0,
                width: newCdWidth > 0 ? newCdWidth + 'px': 0,
                opacity: newCdWidth / cdWidth
            })

        }

        // Xử lý Play/ Pause 
        togglePlayBtn.onclick = () => {
            if(_this.isPlay) {
                audio.pause()
            } else {
                audio.play()
            }
            
        }
        
        // Khi Song được Play 
        progress.value = 0; // Trả thanh progress lại từ đầu
        
        audio.onplay = () => {
            _this.isPlay = true
            player.classList.add('playing')
            cdPlayer.style.animation = `rotating 10s linear infinite` // CD Rotate
        }
        // Khi Song được Pause 
        audio.onpause = () => {
            _this.isPlay = false
            player.classList.remove('playing')
            cdPlayer.style.animationPlayState = 'paused'; // Pause Animation
        }
        
        // Thiết lập độ dài của audio
        audio.onloadedmetadata = () => progress.max = audio.duration 
        
        // onloadedmetadata: Nó được kích hoạt khi metadata của audio đã được tải lên.
        // Metadata của audio bao gồm thông tin như độ dài, kích thước, kiểu định dạng 
        // và các thông số khác liên quan đến nội dung audio.

        progress.onchange = () => audio.currentTime = progress.value
        // Khi giá trị của thanh trượt thay đổi (người dùng thay đổi vị trí), 
        // sự kiện onchange sẽ được kích hoạt. Khi điều này xảy ra, thời gian hiện tại của audio 
        // (audio.currentTime) sẽ được thiết lập bằng giá trị hiện tại của thanh trượt (progress.value). 
        // update range input when currentTime updates
       
        audio.ontimeupdate = () => progress.value = audio.currentTime
        // Sự kiện ontimeupdate được kích hoạt khi thời gian hiện tại của audio thay đổi trong quá trình phát.
        // Khi điều này xảy ra, giá trị của thanh trượt (progress.value) được cập nhật để biết thời gian hiện tại của audio.
        
        // Volume
        
        

        // Next song
        forwardSong.onclick = () => {
            if(_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.nextSong();
            }
            _this.loadCurentSong();
            _this.playSong();
            _this.render()
            _this.scrollToActiveSong()
        };

        // Previous song
        backwardSong.onclick = () => {
            if(_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.prevSong();
            }
            _this.loadCurentSong();
            _this.playSong();
            _this.render()
            _this.scrollToActiveSong()

        };

        // Random song 
        randomSong.onclick = () => {
            _this.isRandom = !_this.isRandom
            // _this.setConfig('isRandom' , _this.isRandom)
            randomSong.classList.toggle('active' , _this.isRandom)
            _this.playSong()
            _this.render()
            _this.scrollToActiveSong()
        }
        
        // Xử lý khi Audio kết thúc 
        // Next Audio 

        audio.onended = () => {
            // if(_this.isRandom) {
            //     _this.playRandomSong()
            // }
            // else {      // Như vậy sẽ lặp code với nút forwardSong 
            //     _this.nextSong();
            // }
            // _this.loadCurentSong();
            // _this.playSong(); 
            if (this.isRepeat) {
                this.playSong();
            } else {
                forwardSong.onclick();
            }
        };

        // Repeat
        repeatSong.onclick = () => {
            _this.isRepeat = !_this.isRepeat
            // _this.setConfig('isRepeat' , _this.isRepeat)
            repeatSong.classList.toggle('active' , _this.isRepeat)
            audio.onended = () => {
                if(_this.isRepeat) {
                    _this.playSong()
                }
            }
        }
        // Play song when click

        // Nghe click vào playList
        playList.onclick = (e) => {
            const songNode = e.target.closest('.song:not(.activeSong)');
            const optionBtn = e.target.closest('.option-menu');
            if (songNode || optionBtn) {  // Trừ click vào bài hát đang phát và option
                // Xử lý click vào song
                const indexSongNode = songNode ? Number(songNode.getAttribute('data-index')) : null;
                if (indexSongNode !== null) {
                    songNode.onclick = () => {
                        _this.currentIndex = indexSongNode;
                        _this.loadCurentSong();
                        _this.playSong();
                        _this.render();
                    };
                }
                // Xử lý click vào Option
                if (optionBtn) {
                    const indexSongNode = songNode ? Number(songNode.getAttribute('data-index')) : null;
                    if (indexSongNode !== null) {
                        _this.removeSong(indexSongNode);
                    }
                }
            }
        };
        

        // Volume change
        // Add these lines at the beginning of the handleEvent method
        
        // Add volume control event handling
        volumeBtn.onclick = () => {
            audio.muted = !audio.muted;
            volumeBtn.classList.toggle('muted', audio.muted);
        };

        volumeControl.oninput = () => {
            audio.volume = volumeControl.value;
        };

        // Update the volume progress bar when the volume changes
        audio.onvolumechange = () => {
            volumeControl.value = audio.volume;
            volumeBtn.classList.toggle('muted', audio.muted);
        };

        // Time
        audio.ontimeupdate = () => {
            progress.value = audio.currentTime;
            timeLeft.innerText = _this.formatTime(audio.currentTime);
            timeRight.innerText = _this.formatTime(audio.duration);
        };

    },
    removeSong(index) {
        this.songs.splice(index, 1);
        if (this.currentIndex === index) {
            // If the removed song is the current song, move to the next song
            this.nextSong();
            this.loadCurentSong();
            this.playSong();
        } else if (this.currentIndex > index) {
            // If the removed song is before the current song, adjust the current index
            this.currentIndex--;
        }
        this.render();
    },
    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },
    scrollToActiveSong() {
        setTimeout(() => {
            const currentSongElement = $('.song.activeSong')
            currentSongElement.scrollIntoView({
                behavior: 'smooth', // cuộn mượt
                block: 'center',   // cuộn đến phía gần nhất của container
                inline: 'nearest'   // cuộn đến phía gần nhất của container
            });
        }, 300) 
        
    },
    playRandomSong() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length);
        } while (randomIndex === this.currentIndex);
    
        this.currentIndex = randomIndex;
        this.loadCurentSong();
    },    
    nextSong() {
        this.currentIndex = (this.currentIndex + 1) % this.songs.length; // Chia lấy dư 
        // VD: CurrentIndex = 3 => 4 / 4 dư 0 gán lại vào current Index
    },
    
    prevSong() {
        this.currentIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length;
        // VD: CurrentIndex = 0 => (-1 + 4) / 4 dư 3 gán lại vào current Index

    },
    playSong() {
        if (audio.readyState === 4) { // Kiểm tra xem audio đã load xong chưa (readyState = 4 là đã load xong)
            audio.play();
        } else {
            // Nếu chưa load xong, thì chờ sự kiện 'canplay' trước khi play
            audio.addEventListener('canplay', () => {
                audio.play();
            });
        }
    },
    loadCurentSong() {
        nameCurrentSong.innerHTML = this.currentSong.name
        cdPlayer.style.backgroundImage = `url(${this.currentSong.img})`
        audio.src = this.currentSong.path
    },
    // loadConfig() {
    //     this.isRandom = this.config.isRandom
    //     this.isRepeat = this.config.isRepeat
    // },
    start() {
        // Định nghĩa thuộc tính cho OBJ
        this.defindProperties()

        // this.loadConfig()
        // Xử lý DOM Event
        this.handleEvent()
        // Tải thông tin bài hát đầu tiên vào UI khi chạy appPlayer
        this.loadCurentSong()
        
        // Render Playlist
        this.render()
    }

}
appPlayer.start()

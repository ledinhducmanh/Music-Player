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

const nameCurrentSong = $('header h2')
const cdPlayer = $('.cd-thumb')

const audio = $('.audio')
const player = $('.player')
const togglePlayBtn = $('.btn-toggle')

const progress = $('.progress')

const backwardSong = $('.btn-backward')
const forwardSong = $('.btn-forward')

const randomSong = $('.btn-random')
const repeatSong = $('.btn-repeat')


const appPlayer = {
    currentIndex: 0,
    isPlay: false,
    isRandom: false,
    songs: [
        {
            name: 'Hit Me Up',
            singer: 'Binz',
            path: "./assets/music/HitMeUp.mp3",
            img: "./assets/img/HitMeUp.jpg"
        },
        {
            name: 'Chìm Sâu',
            singer: 'MCK ft Trung Trần',
            path: "./assets/music/ChimSau.mp3",
            img: "./assets/img/ChimSau.jpg"
        },
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

    ],
    render() {
        const html = this.songs.map((song) => {
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url('${song.img}');"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        }) // html lúc này đang là 1 mảng

        const playList = $('.play-list')
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
        };

        // Random song 
        randomSong.onclick = () => {
            _this.isRandom = !_this.isRandom
            randomSong.classList.toggle('active' , _this.isRandom)
            _this.playRandomSong()
        }
    
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
        audio.play();
    },
    loadCurentSong() {

        nameCurrentSong.innerHTML = this.currentSong.name
        cdPlayer.style.backgroundImage = `url(${this.currentSong.img})`
        audio.src = this.currentSong.path

        
        
    },
    start() {
        // Định nghĩa thuộc tính cho OBJ
        this.defindProperties()

        // Xử lý DOM Event
        this.handleEvent()
        // Tải thông tin bài hát đầu tiên vào UI khi chạy appPlayer
        this.loadCurentSong()
        
        // Render Playlist
        this.render()
    }

}
appPlayer.start()

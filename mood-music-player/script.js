// Songs (MP3 files)
const songs = {
    happy: [
        { name: "Sapphire", src: "assets/songs/song3.mp3" }
    ],
    sad: [
        { name: "Ik Yaad Purani", src: "assets/songs/song1.mp3" }
    ],
    angry: [
        { name: "Bulleya", src: "assets/songs/song2.mp3" }
    ]
};

// Global State
let currentMoodSongs = [];
let currentIndex = 0;
let audio = new Audio();

// Favorites (load + cleanup)
let favorites = JSON.parse(localStorage.getItem("favSongs")) || [];

// Remove duplicates and unwanted songs
favorites = favorites
    .filter((song, index, self) =>
        index === self.findIndex(s => s.src === song.src)
    )
    .filter(song => song.name !== "Let Her Go (Lyrics)");

// Mood Select
function selectMood(mood) {
    const songList = document.getElementById("songList");

    currentMoodSongs = songs[mood];
    currentIndex = 0;

    changeBackground(mood);

    let html = `<h3>${mood.toUpperCase()} Songs 🎵</h3>`;

    currentMoodSongs.forEach((song, index) => {
        html += `
            <div class="song-card">
                <p>${song.name}</p>
                <button onclick="playSong(${index})">▶ Play</button>
                <button onclick="addToFavorites('${song.name}', '${song.src}')">❤️</button>
            </div>
        `;
    });

    html += `
        <h4 id="nowPlaying"></h4>

        <input type="range" id="progressBar" value="0" min="0" max="100" oninput="seekSong(this.value)">
        <p id="timeDisplay">0:00 / 0:00</p>

        <button onclick="pauseSong()">⏸ Pause</button>
        <button onclick="nextSong()">⏭ Next</button>

        <h3>⭐ Favorite Songs</h3>
        <div id="favList"></div>
    `;

    songList.innerHTML = html;

    loadFavorites();
}

// Play Song
function playSong(index) {
    const nowPlaying = document.getElementById("nowPlaying");

    currentIndex = index;
    const song = currentMoodSongs[currentIndex];

    nowPlaying.innerText = `Now Playing: ${song.name} 🎧`;

    audio.src = song.src;
    audio.play();
}

// Pause
function pauseSong() {
    audio.pause();
}

// Next Song
function nextSong() {
    currentIndex++;

    if (currentIndex >= currentMoodSongs.length) {
        currentIndex = 0;
    }

    playSong(currentIndex);
}

// Auto Next
audio.addEventListener("ended", () => {
    nextSong();
});

// Background Change
function changeBackground(mood) {
    const body = document.body;

    if (mood === "happy") {
        body.style.background = "linear-gradient(to right, #0198ac, #012016 )";
    } 
    else if (mood === "sad") {
        body.style.background = "linear-gradient(to right, #4b6cb7, #182848)";
    } 
    else {
        body.style.background = "linear-gradient(to right, #325c5e, #2f3100)";
    }
}

// Add to Favorites
function addToFavorites(name, src) {
    const exists = favorites.some(song => song.src === src);

    if (!exists) {
        favorites.push({ name, src });
        localStorage.setItem("favSongs", JSON.stringify(favorites));
        loadFavorites();
        alert("Added ❤️");
    } else {
        alert("Already added 😄");
    }
}

// Load Favorites
function loadFavorites() {
    const favList = document.getElementById("favList");

    if (!favList) return;

    let html = "";

    favorites.forEach(song => {
        html += `
            <div class="song-card">
                <p>${song.name}</p>
                <button onclick="playFav('${song.src}')">▶ Play</button>
                <button onclick="removeFav('${song.src}')">❌</button>
            </div>
        `;
    });

    favList.innerHTML = html;
}

// Play Favorite
function playFav(src) {
    audio.src = src;
    audio.play();
}

// Remove Favorite
function removeFav(src) {
    favorites = favorites.filter(song => song.src !== src);
    localStorage.setItem("favSongs", JSON.stringify(favorites));
    loadFavorites();
}

// Progress Bar
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        let progress = (audio.currentTime / audio.duration) * 100;

        const progressBar = document.getElementById("progressBar");
        const timeDisplay = document.getElementById("timeDisplay");

        if (progressBar) progressBar.value = progress;

        let current = formatTime(audio.currentTime);
        let total = formatTime(audio.duration);

        if (timeDisplay) {
            timeDisplay.innerText = `${current} / ${total}`;
        }
    }
});

// Seek
function seekSong(value) {
    if (audio.duration) {
        audio.currentTime = (value / 100) * audio.duration;
    }
}

// Format Time
function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    if (secs < 10) secs = "0" + secs;

    return `${mins}:${secs}`;
}
<template>
    <div class="music-container" :class="{ 'fade-out': fadeOut }">
        <div id="music-panel" :class="{ 'visible': isPanelVisible }">
            <div class="music-info">
                <svg style="width:1.5rem; height:1.5rem; color:#6B4F4F;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                </svg>
                <div>
                    <p class="song-title">{{ currentSong.title }}</p>
                    <p class="artist-name">{{ currentSong.artist }}</p>
                </div>
                <button 
                    class="music-control-btn flex-auto" 
                    @click="togglePlaylist"
                    :style="{ color: isPlaylistVisible ? '#A87C7C' : '#6B4F4F' }"
                >
                    <svg style="width:1.25rem; height:1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                    </svg>
                </button>
            </div>
            
            <div 
                class="progress-container" 
                ref="progressContainer"
                @click="setProgress"
            >
                <div class="progress-bar" :style="{ width: `${progressPercent}%` }"></div>
            </div>
            
            <div class="music-controls">
                <button 
                    class="music-control-btn" 
                    @click="toggleShuffle"
                    :style="{ color: isShuffling ? '#A87C7C' : '#6B4F4F' }"
                >
                    <svg style="width:1.25rem; height:1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m-12 10h12M8 12h12"></path>
                    </svg>
                </button>
                <button class="music-control-btn" @click="prevSong">
                    <svg style="width:1.25rem; height:1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <button id="music-control-btn" @click="toggleMusic">
                    <svg v-show="!isPlaying" style="width:1.5rem; height:1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <svg v-show="isPlaying" style="width:1.5rem; height:1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </button>
                <button class="music-control-btn" @click="nextSong">
                    <svg style="width:1.25rem; height:1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
                <button 
                    class="music-control-btn" 
                    @click="toggleLoop"
                    :style="{ color: isLooping ? '#A87C7C' : '#6B4F4F' }"
                >
                    <svg style="width:1.25rem; height:1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                </button>
            </div>
            
            <div class="music-playlist" v-show="isPlaylistVisible">
                <div 
                    v-for="(song, index) in songs" 
                    :key="index"
                    class="playlist-item"
                    :class="{ active: index === currentSongIndex }"
                    @click="selectSong(index)"
                >
                    {{ song.title }} - {{ song.artist }}
                </div>
            </div>
        </div>
        
        <button id="music-toggle" @click="togglePanel" title="Open/Close Music Panel">
            <svg style="width:1.5rem; height:1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
            </svg>
        </button>

        <!-- Hidden audio element -->
        <audio 
            ref="audio"
            @timeupdate="updateProgress"
            @ended="handleSongEnd"
        ></audio>
    </div>
</template>

<style scoped>
/* Music Player */
.music-container {
    position: fixed;
    bottom: 1.25rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    opacity: 1;
    transition: opacity 0.6s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.music-container.fade-out {
    opacity: 0.2;
    transform: translateX(-50%) translateY(50%);
}
#music-panel {
    background-color: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    transform: translateY(100%);
    transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
    opacity: 0;
    width: 280px;
}
#music-panel.visible { 
    transform: translateY(0);
    opacity: 1;
}
.music-info { 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    margin-bottom: 0.5rem;
}
.music-info p { margin: 0; }
.music-info .song-title { font-weight: bold; font-size: 0.875rem; color: #6B4F4F; }
.music-info .artist-name { font-size: 0.75rem; color: #666; }
.music-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.5rem;
}
.music-control-btn {
    background: none;
    border: none;
    color: #6B4F4F;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
}
.music-control-btn:hover {
    transform: scale(1.2);
}
.music-playlist {
    margin-top: 0.5rem;
    max-height: 120px;
    overflow-y: auto;
    border-top: 1px solid rgba(107, 79, 79, 0.2);
    padding-top: 0.5rem;
}
.playlist-item {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
    transition: background-color 0.2s ease;
}
.playlist-item:hover {
    background-color: rgba(107, 79, 79, 0.1);
}
.playlist-item.active {
    background-color: rgba(107, 79, 79, 0.2);
    font-weight: bold;
}
#music-toggle {
    width: 3.5rem; height: 3.5rem;
    background-color: #A87C7C;
    border-radius: 9999px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s ease, box-shadow 0.3s ease;
    z-index: 51;
    position: relative;
    overflow: hidden;
}
#music-toggle:hover { 
    background-color: #6B4F4F; 
    transform: scale(1.1);
}
#music-toggle:active {
    transform: scale(0.95);
}
/* Visual indication when panel is open */
#music-panel.visible + #music-toggle {
    box-shadow: 0 0 0 4px rgba(107, 79, 79, 0.3), 0 8px 16px rgba(0,0,0,0.15);
    background-color: #6B4F4F;
}
.progress-container {
    width: 100%;
    background: rgba(107, 79, 79, 0.1);
    height: 4px;
    border-radius: 2px;
    cursor: pointer;
}
.progress-bar {
    background: #A87C7C;
    height: 100%;
    border-radius: 2px;
    width: 0%;
    transition: width 0.1s linear;
}
</style>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue';

// Define reactive state
const audio = ref(null);
const progressContainer = ref(null);
const isPlaying = ref(false);
const userInteracted = ref(false);
const currentSongIndex = ref(0);
const isLooping = ref(false);
const isShuffling = ref(false);
const isPlaylistVisible = ref(false);
const isPanelVisible = ref(false);
const fadeOut = ref(false);
const progressPercent = ref(0);
let fadeTimeoutId = null;

// Import audio files - this is the recommended way in Vue/Vite to handle assets
import aThousandYears from '../assets/audios/a-thousand-years.mp3';
import aMillionDreams from '../assets/audios/a-million-dreams.mp3';
import everythingINeed from '../assets/audios/everything-i-need.mp3';
import howFarIWillGo from '../assets/audios/how-far-i-will-go.mp3';
import unconditionally from '../assets/audios/unconditionally.mp3';

// Define songs collection
const songs = reactive([
    { title: 'A Thousand Years', artist: 'Christina Perri', file: aThousandYears },
    { title: 'Everything I Need', artist: 'Skylar Grey', file: everythingINeed },
    { title: 'Unconditionally', artist: 'Katy Perry', file: unconditionally },
    { title: 'A Million Dreams', artist: 'The Greatest Showman Cast', file: aMillionDreams },
    { title: 'How Far I\'ll Go', artist: 'Auli\'i Cravalho', file: howFarIWillGo },
]);

// Computed property for current song
const currentSong = computed(() => songs[currentSongIndex.value]);

// Load song details
function loadSong(song) {
    if (audio.value) {
        audio.value.src = song.file;
        // Reset progress bar
        progressPercent.value = 0;
    }
}

// Play song
function playSong() {
    if (!audio.value) return;
    
    audio.value.play().catch(e => console.error("Audio play failed:", e));
    isPlaying.value = true;
    isPanelVisible.value = true;
}

// Pause song
function pauseSong() {
    if (!audio.value) return;
    
    audio.value.pause();
    isPlaying.value = false;
}

// Previous song
function prevSong() {
    if (isShuffling.value) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === currentSongIndex.value && songs.length > 1);
        currentSongIndex.value = newIndex;
    } else {
        currentSongIndex.value--;
        if (currentSongIndex.value < 0) {
            currentSongIndex.value = songs.length - 1;
        }
    }
    
    loadSong(currentSong.value);
    if (isPlaying.value) {
        playSong();
    }
}

// Next song
function nextSong() {
    if (isShuffling.value) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === currentSongIndex.value && songs.length > 1);
        currentSongIndex.value = newIndex;
    } else {
        currentSongIndex.value++;
        if (currentSongIndex.value > songs.length - 1) {
            currentSongIndex.value = 0;
        }
    }
    
    loadSong(currentSong.value);
    if (isPlaying.value) {
        playSong();
    }
}

// Toggle shuffle
function toggleShuffle() {
    isShuffling.value = !isShuffling.value;
}

// Toggle loop
function toggleLoop() {
    isLooping.value = !isLooping.value;
    if (audio.value) {
        audio.value.loop = isLooping.value;
    }
}

// Toggle playlist visibility
function togglePlaylist() {
    isPlaylistVisible.value = !isPlaylistVisible.value;
}

// Select song from playlist
function selectSong(index) {
    currentSongIndex.value = index;
    loadSong(currentSong.value);
    if (isPlaying.value) {
        playSong();
    }
}

// Update progress bar
function updateProgress(e) {
    if (!audio.value) return;
    
    const { duration, currentTime } = e.target;
    if (duration) {
        progressPercent.value = (currentTime / duration) * 100;
    }
}

// Set progress bar
function setProgress(e) {
    if (!audio.value || !progressContainer.value) return;
    
    const width = progressContainer.value.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.value.duration;
    
    if (duration) {
        audio.value.currentTime = (clickX / width) * duration;
    }
}

// Handle song end
function handleSongEnd() {
    if (!isLooping.value) {
        nextSong();
    }
}

// Show/hide music panel based on interaction
function showMusicPanel() {
    isPanelVisible.value = true;
    fadeOut.value = false;
    
    // Clear any existing timeout
    if (fadeTimeoutId) {
        clearTimeout(fadeTimeoutId);
    }
}

// Toggle music panel visibility
function togglePanel() {
    userInteracted.value = true;
    
    // Toggle panel visibility
    isPanelVisible.value = !isPanelVisible.value;
    fadeOut.value = false;
    
    // Clear any existing timeout
    if (fadeTimeoutId) {
        clearTimeout(fadeTimeoutId);
    }
}

// Toggle music play/pause
function toggleMusic() {
    userInteracted.value = true;
    
    if (isPlaying.value) {
        pauseSong();
    } else {
        playSong();
    }
}

// Initialize the music player
onMounted(() => {
    // Initialize with first song
    loadSong(currentSong.value);
    
    // Initially hide the panel
    isPanelVisible.value = false;
    
    // Add global click handler for first interaction
    const handleFirstInteraction = () => {
        userInteracted.value = true;
        document.body.removeEventListener('click', handleFirstInteraction);
    };
    
    document.body.addEventListener('click', handleFirstInteraction, { once: true });
});

// Clean up on component unmount
onBeforeUnmount(() => {
    if (fadeTimeoutId) {
        clearTimeout(fadeTimeoutId);
    }
    
    if (audio.value) {
        audio.value.pause();
        audio.value.src = '';
    }
});
</script>
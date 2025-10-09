<template>
    <section id="puzzle" :class="{'focus-locked': focusLocked}">
        <!-- Overlay to prevent interactions outside puzzle when locked -->
        <div v-if="focusLocked" class="focus-lock-overlay"></div>
        <h2 class="fancy-font animate-item">Solve this puzzle!</h2>
        <div class="puzzle-main-container">
            <div ref="piecesTray" class="puzzle-pieces-tray animate-item delay-2">
                <div 
                    v-for="piece in piecesInTray" 
                    :key="piece.id" 
                    class="puzzle-piece"
                    :style="getPieceStyle(piece)"
                    :data-piece-id="piece.id"
                    @mousedown.prevent="startDrag($event, piece)"
                    @touchstart.prevent="startDrag($event, piece)">
                </div>
            </div>
            
            <div class="puzzle-board-area animate-item delay-3">
                <div ref="puzzleBoardContainer" class="puzzle-board-container">
                    <div 
                        v-for="piece in dropZones" 
                        :key="'zone-' + piece.id"
                        class="drop-zone"
                        :class="{'highlighted': highlightedZone === piece.id}"
                        :style="getDropZoneStyle(piece)"
                        :data-slot-id="piece.id">
                    </div>
                    <div 
                        v-for="piece in piecesOnBoard" 
                        :key="'board-' + piece.id" 
                        class="puzzle-piece placed"
                        :style="getPlacedPieceStyle(piece)"
                        :data-piece-id="piece.id">
                    </div>
                </div>
                
                <div class="button-container">
                    <button v-if="isSolving" class="reset-button" @click="resetPuzzle">Reset</button>
                    <button v-if="!isSolving" class="solve-button" @click="startSolving">Let's go!</button>
                    <button v-if="isSolving" class="exit-button" @click="initCompletedPuzzle">Exit</button>
                </div>
                <p v-if="puzzleCompleted && isSolving" class="fancy-font puzzle-success-message">
                    Congratulations! Memory pieces together:3! 🎉
                </p>
            </div>
        </div>
        
        <!-- Floating piece when dragging -->
        <div 
            v-if="isDragging" 
            class="dragging-piece" 
            :style="draggingPieceStyle">
        </div>
    </section>
</template>

<style scoped>
/* Puzzle Section */
#puzzle {
    min-height: 90vh; /* Slightly less than full height to allow scrolling */
    width: 100%;
    padding: 5rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #EAD7BB;
    position: relative; /* Added for focus lock positioning */
    z-index: 1; /* Ensure the puzzle is above other content */
    transition: all 0.3s ease-out; /* Smooth transition when switching modes */
    touch-action: auto; /* Ensure touch actions work normally when not dragging */
}

/* Animation classes - Added will-change to improve performance */
.animate-item {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeUp 1s ease forwards;
    animation-play-state: paused; /* Animations will be explicitly controlled */
    will-change: transform, opacity;
}

.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }
.delay-3 { animation-delay: 0.6s; }
.delay-4 { animation-delay: 0.8s; }

@keyframes fadeUp {
    from { 
        opacity: 0; 
        transform: translateY(30px);
    }
    to { 
        opacity: 1; 
        transform: translateY(0);
    }
}
#puzzle h2 { font-size: 3rem; text-align: center; color: #6B4F4F; margin-bottom: 1rem; }
#puzzle p { text-align: center; color: #555; margin-bottom: 3rem; }
.puzzle-main-container {
    width: 100%;
    max-width: 1024px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
    justify-content: center;
}
@media (min-width: 1024px) {
    .puzzle-main-container { flex-direction: row; }
}
.puzzle-pieces-tray {
    position: relative;
    width: 380px;
    height: 380px;
    background-color: rgba(245, 239, 230, 0.5);
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
    border: 2px dashed #D6C0A4;
    min-height: 380px;
    overflow: hidden;
}

@media (max-width: 480px) {
    .puzzle-pieces-tray {
        width: 280px;
        height: 280px;
        min-height: 280px;
        padding: 0.75rem;
    }
    
    .puzzle-main-container {
        gap: 1rem;
    }
    
    #puzzle h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
    
    #puzzle {
        padding: 3rem 0.5rem;
    }
}

@media (min-width: 481px) and (max-width: 768px) {
    .puzzle-pieces-tray {
        width: 320px;
        height: 320px;
        min-height: 320px;
        padding: 0.75rem;
    }
}
.puzzle-board-area {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.puzzle-board-container {
    position: relative;
    width: 400px;
    height: 300px;
    background-color: rgba(255,255,255,0.5);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

@media (max-width: 480px) {
    .puzzle-board-container {
        width: 320px;
        height: 240px;
        overflow: hidden; /* Prevent overflow on small screens */
    }
}

@media (min-width: 481px) and (max-width: 768px) {
    .puzzle-board-container {
        width: 360px;
        height: 270px;
        overflow: hidden; /* Prevent overflow on tablet screens */
    }
}
.button-container {
    margin-top: 1.5rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.reset-button, .solve-button, .exit-button {
    background-color: #A87C7C;
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 9999px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: 600;
}

.reset-button:hover, .solve-button:hover, .exit-button:hover { 
    background-color: #6B4F4F; 
}

.solve-button {
    background-color: #5D8A66;
}

.solve-button:hover {
    background-color: #3A5D40;
}

.exit-button {
    background-color: #8A5D5D;
}

.exit-button:hover {
    background-color: #5D3A3A;
}

.puzzle-piece {
    position: absolute;
    cursor: grab;
    border: 2px solid #8B4513;
    border-radius: 4px;
    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
    background-image: url('../assets/images/og13_1.jpg');
    background-repeat: no-repeat;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
    z-index: 5;
    touch-action: none; /* Disable browser touch actions on pieces to allow custom handling */
    -webkit-touch-callout: none; /* Prevent iOS callout */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version */
    /* Background size is now set dynamically in the style attribute */
}

@media (max-width: 480px) {
    .puzzle-piece {
        /* Smaller border for mobile screens */
        border-width: 1px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
}

@media (min-width: 481px) and (max-width: 768px) {
    .puzzle-piece {
        /* Adjusted border for tablet screens */
        border-width: 1px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.25);
    }
}

.puzzle-piece.placed {
    border: 1px solid #4F7942;
    border-radius: 0;
    cursor: default;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    z-index: 10;
}

.dragging-piece {
    position: fixed;
    pointer-events: none;
    z-index: 10000;
    cursor: grabbing;
    border: 2px solid #8B4513;
    border-radius: 4px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
    background-image: url('../assets/images/og13_1.jpg');
    background-size: 400px 300px;
    background-repeat: no-repeat;
    opacity: 1 !important; /* Ensure opacity is always 1 */
    transform: none !important; /* Prevent unwanted transforms */
    transition: none !important; /* Disable transitions while dragging */
    touch-action: none !important; /* Ensure no touch actions happen on the dragging piece */
    will-change: left, top; /* Optimize for position changes */
}

.drop-zone {
    position: absolute;
    border: 2px dashed #A87C7C;
    border-radius: 4px;
    background-color: rgba(214, 192, 164, 0.3);
    transition: all 0.3s ease;
    z-index: 1;
}

.drop-zone.highlighted {
    background-color: rgba(168, 124, 124, 0.6);
    border-color: #6B4F4F;
    border-width: 3px;
}

.puzzle-success-message {
    font-size: 1.5rem;
    color: white;
    margin-top: 1rem;
    text-align: center;
    animation: fadeIn 0.5s ease-in;
}

.puzzle-hint-message {
    font-size: 1.5rem;
    color: #6B4F4F;
    margin-top: 1rem;
    text-align: center;
}

/* Focus lock styling */
#puzzle.focus-locked {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9998;
    overflow-y: auto;
    padding: 2rem 1rem;
    transition: all 0.6s ease-in-out;
    background-color: #EAD7BB; /* Ensure background is visible */
    touch-action: pan-y pinch-zoom; /* Only allow vertical scroll and zoom */
}

#puzzle:not(.focus-locked) {
    /* This ensures visibility when not in focus-locked mode */
    min-height: 90vh; /* Slightly less than full height to allow scrolling on mobile */
    will-change: transform; /* Prevent flickering during transitions */
    touch-action: pan-y; /* Allow vertical scrolling on touch devices */
}

.focus-lock-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.8s ease-in-out;
}

#puzzle.focus-locked .focus-lock-overlay {
    opacity: 1;
}

/* Solving state animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes scaleIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

.solving-fade-in {
    animation: fadeIn 0.8s ease-in-out forwards;
}

.solving-scale-in {
    animation: scaleIn 0.8s ease-in-out forwards;
}

.solving-transition-delay-1 { animation-delay: 0.1s; }
.solving-transition-delay-2 { animation-delay: 0.3s; }
.solving-transition-delay-3 { animation-delay: 0.5s; }
.solving-transition-delay-4 { animation-delay: 0.7s; }
</style>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';

// Helper function to get appropriate piece size based on viewport width
function getPieceSizeConfig() {
    // Default size for desktop
    let pieceSize = 100;
    let boardWidth = 400;
    let boardHeight = 300;
    
    // Check for mobile screens
    if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width <= 480) {
            pieceSize = 80; // base size
            // Use exact dimensions from CSS for smaller screens
            boardWidth = 320;  // Matches CSS width exactly
            boardHeight = 240; // Matches CSS height exactly
        } else if (width <= 768) {
            pieceSize = 90; // base size
            // Use exact dimensions from CSS for tablet screens
            boardWidth = 360;  // Matches CSS width exactly
            boardHeight = 270; // Matches CSS height exactly
        }
    }
    
    return { pieceSize, boardWidth, boardHeight };
}

// Define puzzle pieces based on responsive size - this needs to update on resize
const { pieceSize, boardWidth, boardHeight } = getPieceSizeConfig();

// Calculate how pieces should be arranged to fit the board size exactly
const cols = 4; // we want 4 pieces per row
const rows = 3; // 3 rows
const actualPieceWidth = boardWidth / cols;
const actualPieceHeight = boardHeight / rows;

const PIECES = [
    // Row 1 (top)
    { id: 1, width: actualPieceWidth, height: actualPieceHeight, boardX: 0, boardY: 0, bgX: 0, bgY: 0 },
    { id: 2, width: actualPieceWidth, height: actualPieceHeight, boardX: actualPieceWidth, boardY: 0, bgX: pieceSize, bgY: 0 },
    { id: 3, width: actualPieceWidth, height: actualPieceHeight, boardX: actualPieceWidth * 2, boardY: 0, bgX: pieceSize * 2, bgY: 0 },
    { id: 4, width: actualPieceWidth, height: actualPieceHeight, boardX: actualPieceWidth * 3, boardY: 0, bgX: pieceSize * 3, bgY: 0 },
    
    // Row 2 (middle)
    { id: 5, width: actualPieceWidth, height: actualPieceHeight, boardX: 0, boardY: actualPieceHeight, bgX: 0, bgY: pieceSize },
    { id: 6, width: actualPieceWidth, height: actualPieceHeight, boardX: actualPieceWidth, boardY: actualPieceHeight, bgX: pieceSize, bgY: pieceSize },
    { id: 7, width: actualPieceWidth, height: actualPieceHeight, boardX: actualPieceWidth * 2, boardY: actualPieceHeight, bgX: pieceSize * 2, bgY: pieceSize },
    { id: 8, width: actualPieceWidth, height: actualPieceHeight, boardX: actualPieceWidth * 3, boardY: actualPieceHeight, bgX: pieceSize * 3, bgY: pieceSize },
    
    // Row 3 (bottom)
    { id: 9, width: actualPieceWidth, height: actualPieceHeight, boardX: 0, boardY: actualPieceHeight * 2, bgX: 0, bgY: pieceSize * 2 },
    { id: 10, width: actualPieceWidth, height: actualPieceHeight, boardX: actualPieceWidth, boardY: actualPieceHeight * 2, bgX: pieceSize, bgY: pieceSize * 2 },
    { id: 11, width: actualPieceWidth, height: actualPieceHeight, boardX: actualPieceWidth * 2, boardY: actualPieceHeight * 2, bgX: pieceSize * 2, bgY: pieceSize * 2 },
    { id: 12, width: actualPieceWidth, height: actualPieceHeight, boardX: actualPieceWidth * 3, boardY: actualPieceHeight * 2, bgX: pieceSize * 3, bgY: pieceSize * 2 }
];

// Refs
const piecesTray = ref(null);
const puzzleBoardContainer = ref(null);

// Reactive state
const piecePositions = reactive(new Map());
const piecesInTray = ref([]);
const piecesOnBoard = ref([]);
const dropZones = ref([...PIECES]);
const isDragging = ref(false);
const draggedPiece = ref(null);
const dragOffsetX = ref(0);
const dragOffsetY = ref(0);
const draggingPieceStyle = ref({});
const highlightedZone = ref(null);
const puzzleCompleted = ref(true); // Start with puzzle completed
const isSolving = ref(false); // Track if user is actively solving the puzzle
const focusLocked = ref(false); // Track if focus is locked

// Setup initial state
onMounted(() => {
    // Initialize with completed puzzle
    initCompletedPuzzle();
    
    // Global touch event handler - only prevent default when actually dragging
    // This ensures normal scrolling works when not interacting with puzzle pieces
    document.addEventListener('touchmove', e => {
        // Only prevent default if actively dragging a piece
        if (isDragging.value && e.cancelable) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Prevent scrolling with keyboard when focus locked
    document.addEventListener('keydown', e => {
        if (focusLocked.value && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || 
            e.key === 'PageDown' || e.key === 'PageUp' || e.key === 'Space')) {
            e.preventDefault();
        }
    });
    
    // Add transition listener for focus-locked changes but don't force scroll
    const puzzleSection = document.getElementById('puzzle');
    if (puzzleSection) {
        puzzleSection.addEventListener('transitionend', (e) => {
            if (e.propertyName === 'transform' || e.propertyName === 'opacity') {
                // Don't force scrollIntoView as this causes mobile issues
            }
        });
    }
    
    // Start animations after mount
    setTimeout(() => {
        startAnimations();
    }, 100);
});

// Clean up all event listeners when component is unmounted
onBeforeUnmount(() => {
    document.removeEventListener('touchmove', e => {
        if (isDragging.value && e.cancelable) {
            e.preventDefault();
        }
    });
    document.removeEventListener('keydown', e => {
        if (focusLocked.value && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || 
            e.key === 'PageDown' || e.key === 'PageUp' || e.key === 'Space')) {
            e.preventDefault();
        }
    });
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', handleDragEnd);
    document.removeEventListener('touchcancel', handleDragEnd);
});

function startAnimations() {
    // Start animations when not dragging
    const animatedItems = document.querySelectorAll('.animate-item');
    animatedItems.forEach(item => {
        item.style.animationPlayState = 'running';
    });
}

// Computed to check if puzzle is complete
const isPuzzleComplete = computed(() => {
    return piecesOnBoard.value.length === PIECES.length;
});

// Styling functions
function getPieceStyle(piece) {
    const position = piecePositions.get(piece.id);
    // Adjust background position based on actual piece size vs original background image
    const { pieceSize } = getPieceSizeConfig();
    const bgScaleX = pieceSize / piece.width;  // Scale factor for background position
    const bgScaleY = pieceSize / piece.height; // Scale factor for background position
    
    return {
        width: `${piece.width}px`,
        height: `${piece.height}px`,
        left: position ? `${position.left}px` : '0px',
        top: position ? `${position.top}px` : '0px',
        transform: position ? `rotate(${position.rotation}deg) scale(${position.scale})` : 'rotate(0deg)',
        backgroundPosition: `-${piece.bgX * bgScaleX}px -${piece.bgY * bgScaleY}px`,
        backgroundSize: `${400 * bgScaleX}px ${300 * bgScaleY}px`,
        zIndex: position ? position.zIndex : 5,
    };
}

function getDropZoneStyle(piece) {
    return {
        left: `${piece.boardX}px`,
        top: `${piece.boardY}px`,
        width: `${piece.width}px`,
        height: `${piece.height}px`,
        display: isPieceOnBoard(piece.id) ? 'none' : 'block'
    };
}

function getPlacedPieceStyle(piece) {
    // Adjust background position based on actual piece size vs original background image
    const { pieceSize } = getPieceSizeConfig();
    const bgScaleX = pieceSize / piece.width;  // Scale factor for background position
    const bgScaleY = pieceSize / piece.height; // Scale factor for background position
    
    return {
        width: `${piece.width}px`,
        height: `${piece.height}px`,
        left: `${piece.boardX}px`,
        top: `${piece.boardY}px`,
        backgroundPosition: `-${piece.bgX * bgScaleX}px -${piece.bgY * bgScaleY}px`,
        backgroundSize: `${400 * bgScaleX}px ${300 * bgScaleY}px`
    };
}

// Helpers
function isPieceOnBoard(pieceId) {
    return piecesOnBoard.value.some(p => p.id === pieceId);
}

// Initialize with completed puzzle
function initCompletedPuzzle() {
    // First, restore normal scrolling
    document.body.style.overflow = '';
    
    // Set a small delay to ensure smooth transition
    setTimeout(() => {
        // Clear states
        piecePositions.clear();
        piecesInTray.value = [];
        piecesOnBoard.value = [...PIECES]; // All pieces on board
        puzzleCompleted.value = true;
        isSolving.value = false;
        
        // Important: Remove focus lock last, after states are updated
        focusLocked.value = false;
        
        // For mobile devices, ensure proper cleanup of any touch-related state
        document.removeEventListener('touchmove', handleDrag);
        document.removeEventListener('touchend', handleDragEnd);
        
        // Reset any lingering state that might affect scrolling
        isDragging.value = false;
        draggedPiece.value = null;
    }, 50);
}

// Start solving the puzzle
function startSolving() {
    // Set focus lock
    focusLocked.value = true;
    isSolving.value = true;
    puzzleCompleted.value = false;
    
    // Scroll to puzzle section and lock it
    const puzzleSection = document.getElementById('puzzle');
    if (puzzleSection) {
        puzzleSection.scrollIntoView({ behavior: 'smooth' });
        
        // Use a timeout to ensure the scrollIntoView completes before locking scroll
        setTimeout(() => {
            document.body.style.overflow = 'hidden';
        }, 300);
    }
    
    // Scramble and move pieces to tray
    resetPuzzle();
}

// Reset puzzle
function resetPuzzle() {
    // Clear states
    piecePositions.clear();
    if (isSolving.value) {
        piecesInTray.value = [...PIECES].sort(() => Math.random() - 0.5);
        piecesOnBoard.value = [];
        puzzleCompleted.value = false;
    } else {
        // If not in solving mode, reset to completed state
        initCompletedPuzzle();
    }
    
    // Position pieces in tray with random positions
    piecesInTray.value.forEach((piece, index) => {
        // Get the actual tray dimensions from the DOM element for accurate positioning
        const trayElement = piecesTray.value;
        const margin = 10; // Smaller margin for mobile
        let trayWidth, trayHeight;
        
        // Use actual tray dimensions if available, fall back to default
        if (trayElement) {
            const trayRect = trayElement.getBoundingClientRect();
            trayWidth = trayRect.width - margin * 2;
            trayHeight = trayRect.height - margin * 2;
        } else {
            // Responsive defaults
            if (window.innerWidth <= 480) {
                trayWidth = 260; // 280 - margins
                trayHeight = 260;
            } else if (window.innerWidth <= 768) {
                trayWidth = 300; // 320 - margins
                trayHeight = 300;
            } else {
                trayWidth = 360; // 380 - margins
                trayHeight = 360;
            }
        }
        
        // For mobile, arrange pieces in a more organized grid to prevent overlap
        if (window.innerWidth <= 768) {
            // Create a grid arrangement for small screens
            const cols = 3; // 3 columns for 12 pieces
            const rows = 4;
            const colSize = trayWidth / cols;
            const rowSize = trayHeight / rows;
            
            // Calculate grid position
            const col = index % cols;
            const row = Math.floor(index / cols);
            
            // Add some randomness but stay within cell bounds
            const randomOffsetX = Math.random() * (colSize - piece.width) * 0.8;
            const randomOffsetY = Math.random() * (rowSize - piece.height) * 0.8;
            
            piecePositions.set(piece.id, {
                left: margin + (col * colSize) + randomOffsetX,
                top: margin + (row * rowSize) + randomOffsetY,
                rotation: Math.random() * 10 - 5, // Less rotation on mobile
                scale: 0.85,
                zIndex: Math.floor(Math.random() * 10)
            });
        } else {
            // Desktop version - fully random positioning
            const maxX = Math.max(0, trayWidth - piece.width);
            const maxY = Math.max(0, trayHeight - piece.height);
            
            piecePositions.set(piece.id, {
                left: margin + Math.min(maxX, Math.random() * maxX),
                top: margin + Math.min(maxY, Math.random() * maxY),
                rotation: Math.random() * 20 - 10,
                scale: 0.85,
                zIndex: Math.floor(Math.random() * 10)
            });
        }
    });
}

// Drag handlers
function startDrag(e, piece) {
    // Only allow dragging when solving
    if (!isSolving.value) return;
    
    // Always prevent default for touch events to avoid scrolling while dragging
    if (e.cancelable) {
        e.preventDefault();
    }
    
    // Prevent double-click issues by returning if already dragging
    if (isDragging.value) {
        return;
    }
    
    // Set dragging state first
    isDragging.value = true;
    draggedPiece.value = piece;
    
    // Calculate cursor position on the piece
    const element = e.target;
    const rect = element.getBoundingClientRect();
    
    // Handle both mouse and touch events
    let clientX, clientY;
    if (e.type.startsWith('touch')) {
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    if (!clientX || !clientY) return;
    
    // Store offset from cursor to piece's top-left corner
    // getBoundingClientRect already accounts for scroll position
    dragOffsetX.value = clientX - rect.left;
    dragOffsetY.value = clientY - rect.top;
    
    // Update dragging piece style using fixed position
    // Adjust background position based on actual piece size vs original background image
    const bgScaleX = pieceSize / piece.width;  // Scale factor for background position
    const bgScaleY = pieceSize / piece.height; // Scale factor for background position
    
    draggingPieceStyle.value = {
        width: `${piece.width}px`,
        height: `${piece.height}px`,
        left: `${clientX - dragOffsetX.value}px`,
        top: `${clientY - dragOffsetY.value}px`,
        transform: 'rotate(0deg) scale(1)',
        backgroundPosition: `-${piece.bgX * bgScaleX}px -${piece.bgY * bgScaleY}px`,
        backgroundSize: `${400 * bgScaleX}px ${300 * bgScaleY}px`
    };
    
    // Remove from tray
    piecesInTray.value = piecesInTray.value.filter(p => p.id !== piece.id);
    
    // Remove from tray
    piecesInTray.value = piecesInTray.value.filter(p => p.id !== piece.id);
    
    // Add document listeners
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    
    // For mobile: explicitly set passive to false to enable preventDefault
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
    document.addEventListener('touchcancel', handleDragEnd);
}

function handleDrag(e) {
    if (!isDragging.value) return;
    
    // Always prevent default when dragging to prevent scrolling
    if (e.cancelable) {
        e.preventDefault();
    }
    
    // Handle both mouse and touch events
    let clientX, clientY;
    if (e.type.startsWith('touch')) {
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    if (!clientX || !clientY) return;
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate piece dimensions with some padding
    const pieceWidth = draggedPiece.value.width;
    const pieceHeight = draggedPiece.value.height;
    
    // Calculate constrained positions to keep piece within viewport
    const constrainedX = Math.min(Math.max(0, clientX - dragOffsetX.value), viewportWidth - pieceWidth);
    const constrainedY = Math.min(Math.max(0, clientY - dragOffsetY.value), viewportHeight - pieceHeight);
    
    // Update dragging piece position with constrained values
    draggingPieceStyle.value = {
        ...draggingPieceStyle.value,
        left: `${constrainedX}px`,
        top: `${constrainedY}px`
    };
    
    // Check if over correct drop zone
    if (puzzleBoardContainer.value) {
        // Get the current position of the board, accounting for any scrolling
        const boardRect = puzzleBoardContainer.value.getBoundingClientRect();
        
        // Constrain the check to the visible boundaries of the board
        const boardLeft = boardRect.left;
        const boardRight = boardRect.right;
        const boardTop = boardRect.top;
        const boardBottom = boardRect.bottom;
        
        const isOverBoard = clientX >= boardLeft && clientX <= boardRight &&
                          clientY >= boardTop && clientY <= boardBottom;
        
        highlightedZone.value = null;
        
        if (isOverBoard) {
            // Find the correct zone for this piece
            const correctZoneData = PIECES.find(p => p.id === draggedPiece.value.id);
            // Use getBoundingClientRect values which already account for scrolling
            const zoneLeft = boardRect.left + correctZoneData.boardX;
            const zoneRight = zoneLeft + correctZoneData.width;
            const zoneTop = boardRect.top + correctZoneData.boardY;
            const zoneBottom = zoneTop + correctZoneData.height;
            
            // Check if over the correct zone
            if (clientX >= zoneLeft && clientX <= zoneRight && 
                clientY >= zoneTop && clientY <= zoneBottom) {
                highlightedZone.value = draggedPiece.value.id;
            }
        }
    }
}

function handleDragEnd(e) {
    if (!isDragging.value) return;
    
    // Ensure we have valid coordinates even if event is touch or mouse
    let clientX, clientY;
    if (e.type.startsWith('touch')) {
        if (e.changedTouches && e.changedTouches.length > 0) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        }
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    // Safety check - if no valid coordinates, return to tray
    if (!clientX || !clientY) {
        piecesInTray.value.push(draggedPiece.value);
        resetDragState();
        return;
    }
    
    if (puzzleBoardContainer.value) {
        // Get current board position including any scrolling
        const boardRect = puzzleBoardContainer.value.getBoundingClientRect();
        const isOverBoard = clientX >= boardRect.left && clientX <= boardRect.right &&
                          clientY >= boardRect.top && clientY <= boardRect.bottom;
        
        if (isOverBoard && highlightedZone.value === draggedPiece.value.id) {
            // Correct placement - add to board
            piecesOnBoard.value.push(draggedPiece.value);
            
            // Check if puzzle is complete
            if (piecesOnBoard.value.length === PIECES.length) {
                setTimeout(() => {
                    puzzleCompleted.value = true;
                    celebratePuzzleCompletion();
                    
                    // Release focus lock after a delay to allow celebration
                    setTimeout(() => {
                        // Keep focus locked but allow scrolling so user can see the message
                        document.body.style.overflow = '';
                        
                        // Don't automatically exit the puzzle view
                        // User must click "Exit" button
                    }, 1500);
                }, 300);
            }
        } else {
            // Return to tray
            piecesInTray.value.push(draggedPiece.value);
            
            // Random position in tray - using actual dimensions for responsive support
            const trayElement = piecesTray.value;
            const margin = 10; // Smaller margin for mobile
            let trayWidth, trayHeight;
            
            // Use actual tray dimensions if available
            if (trayElement) {
                const trayRect = trayElement.getBoundingClientRect();
                trayWidth = trayRect.width - margin * 2;
                trayHeight = trayRect.height - margin * 2;
            } else {
                // Responsive defaults
                if (window.innerWidth <= 480) {
                    trayWidth = 260; // 280 - margins
                    trayHeight = 260;
                } else if (window.innerWidth <= 768) {
                    trayWidth = 300; // 320 - margins
                    trayHeight = 300;
                } else {
                    trayWidth = 360; // 380 - margins
                    trayHeight = 360;
                }
            }
            
            // For mobile, find an empty cell in the grid
            if (window.innerWidth <= 768) {
                // Get current pieces in tray to avoid overlap
                const piecesInTrayCount = piecesInTray.value.length;
                
                // Create a grid arrangement
                const cols = 3; // 3 columns for 12 pieces
                const rows = 4;
                const colSize = trayWidth / cols;
                const rowSize = trayHeight / rows;
                
                // Find an available grid cell
                const availableCells = [];
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const cellIndex = row * cols + col;
                        if (cellIndex >= piecesInTrayCount) {
                            availableCells.push({ row, col });
                        }
                    }
                }
                
                // If there are available cells, use one
                let targetCell;
                if (availableCells.length > 0) {
                    targetCell = availableCells[Math.floor(Math.random() * availableCells.length)];
                } else {
                    // All cells occupied, pick a random one
                    targetCell = {
                        row: Math.floor(Math.random() * rows),
                        col: Math.floor(Math.random() * cols)
                    };
                }
                
                // Add some randomness but stay within cell bounds
                const randomOffsetX = Math.random() * (colSize - draggedPiece.value.width) * 0.8;
                const randomOffsetY = Math.random() * (rowSize - draggedPiece.value.height) * 0.8;
                
                piecePositions.set(draggedPiece.value.id, {
                    left: margin + (targetCell.col * colSize) + randomOffsetX,
                    top: margin + (targetCell.row * rowSize) + randomOffsetY,
                    rotation: Math.random() * 10 - 5, // Less rotation on mobile
                    scale: 0.85,
                    zIndex: Math.floor(Math.random() * 10)
                });
            } else {
                // Desktop version - fully random positioning
                const maxX = Math.max(0, trayWidth - draggedPiece.value.width);
                const maxY = Math.max(0, trayHeight - draggedPiece.value.height);
                
                piecePositions.set(draggedPiece.value.id, {
                    left: margin + Math.min(maxX, Math.random() * maxX),
                    top: margin + Math.min(maxY, Math.random() * maxY),
                    rotation: Math.random() * 20 - 10,
                    scale: 0.85,
                    zIndex: Math.floor(Math.random() * 10)
                });
            }
        }
    } else {
        // If board is not available, return to tray
        piecesInTray.value.push(draggedPiece.value);
    }
    
    // Reset dragging state
    resetDragState();
}

// Helper function to cleanly reset drag state
function resetDragState() {
    // Reset state variables first
    isDragging.value = false;
    draggedPiece.value = null;
    highlightedZone.value = null;
    
    // Remove document listeners
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', handleDragEnd);
    document.removeEventListener('touchcancel', handleDragEnd);
    
    // Resume animations immediately to avoid state stuck in paused
    document.querySelectorAll('.animate-item').forEach(item => {
        item.style.animationPlayState = 'running';
    });
}

function celebratePuzzleCompletion() {
    // Animation effect for completed puzzle
    piecesOnBoard.value.forEach((piece, index) => {
        setTimeout(() => {
            const element = document.querySelector(`.puzzle-piece[data-piece-id="${piece.id}"]`);
            if (element) {
                element.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            }
        }, index * 50);
    });
}
</script>
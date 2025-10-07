<template>
    <section id="puzzle">
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
                
                <button class="reset-button" @click="resetPuzzle">Reset</button>
                <p v-if="puzzleCompleted" class="fancy-font puzzle-success-message">
                    Congratulations! Puzzle completed! 🎉
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
    min-height: 100vh;
    width: 100%;
    padding: 5rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #EAD7BB;
}

/* Animation classes */
.animate-item {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeUp 1s ease forwards;
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
.reset-button {
    margin-top: 1.5rem;
    background-color: #A87C7C;
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 9999px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}
.reset-button:hover { background-color: #6B4F4F; }

.puzzle-piece {
    position: absolute;
    cursor: grab;
    border: 2px solid #8B4513;
    border-radius: 4px;
    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
    background-image: url('../assets/images/og13_1.jpg');
    background-size: 400px 300px;
    background-repeat: no-repeat;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, opacity 0.6s ease;
    z-index: 5;
    touch-action: none; /* Prevents default touch actions like scrolling */
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
    color: #166534;
    margin-top: 1rem;
    text-align: center;
    animation: fadeIn 0.5s ease-in;
}
</style>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

// Define puzzle pieces
const PIECES = [
    // Row 1 (top)
    { id: 1, width: 100, height: 100, boardX: 0, boardY: 0, bgX: 0, bgY: 0 },
    { id: 2, width: 100, height: 100, boardX: 100, boardY: 0, bgX: 100, bgY: 0 },
    { id: 3, width: 100, height: 100, boardX: 200, boardY: 0, bgX: 200, bgY: 0 },
    { id: 4, width: 100, height: 100, boardX: 300, boardY: 0, bgX: 300, bgY: 0 },
    
    // Row 2 (middle)
    { id: 5, width: 100, height: 100, boardX: 0, boardY: 100, bgX: 0, bgY: 100 },
    { id: 6, width: 100, height: 100, boardX: 100, boardY: 100, bgX: 100, bgY: 100 },
    { id: 7, width: 100, height: 100, boardX: 200, boardY: 100, bgX: 200, bgY: 100 },
    { id: 8, width: 100, height: 100, boardX: 300, boardY: 100, bgX: 300, bgY: 100 },
    
    // Row 3 (bottom)
    { id: 9, width: 100, height: 100, boardX: 0, boardY: 200, bgX: 0, bgY: 200 },
    { id: 10, width: 100, height: 100, boardX: 100, boardY: 200, bgX: 100, bgY: 200 },
    { id: 11, width: 100, height: 100, boardX: 200, boardY: 200, bgX: 200, bgY: 200 },
    { id: 12, width: 100, height: 100, boardX: 300, boardY: 200, bgX: 300, bgY: 200 }
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
const puzzleCompleted = ref(false);

// Setup initial state
onMounted(() => {
    resetPuzzle();
});

// Computed to check if puzzle is complete
const isPuzzleComplete = computed(() => {
    return piecesOnBoard.value.length === PIECES.length;
});

// Styling functions
function getPieceStyle(piece) {
    const position = piecePositions.get(piece.id);
    return {
        width: `${piece.width}px`,
        height: `${piece.height}px`,
        left: position ? `${position.left}px` : '0px',
        top: position ? `${position.top}px` : '0px',
        transform: position ? `rotate(${position.rotation}deg) scale(${position.scale})` : 'rotate(0deg)',
        backgroundPosition: `-${piece.bgX}px -${piece.bgY}px`,
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
    return {
        width: `${piece.width}px`,
        height: `${piece.height}px`,
        left: `${piece.boardX}px`,
        top: `${piece.boardY}px`,
        backgroundPosition: `-${piece.bgX}px -${piece.bgY}px`
    };
}

// Helpers
function isPieceOnBoard(pieceId) {
    return piecesOnBoard.value.some(p => p.id === pieceId);
}

// Reset puzzle
function resetPuzzle() {
    // Clear states
    piecePositions.clear();
    piecesInTray.value = [...PIECES].sort(() => Math.random() - 0.5);
    piecesOnBoard.value = [];
    puzzleCompleted.value = false;
    
    // Position pieces in tray with random positions
    piecesInTray.value.forEach((piece) => {
        const margin = 20;
        const trayWidth = 380;
        const trayHeight = 380;
        const maxX = trayWidth - piece.width - margin;
        const maxY = trayHeight - piece.height - margin;
        
        piecePositions.set(piece.id, {
            left: Math.max(margin, Math.random() * maxX),
            top: Math.max(margin, Math.random() * maxY),
            rotation: Math.random() * 20 - 10,
            scale: 0.85,
            zIndex: Math.floor(Math.random() * 10)
        });
    });
}

// Drag handlers
function startDrag(e, piece) {
    isDragging.value = true;
    draggedPiece.value = piece;
    
    // Calculate cursor position on the piece
    const element = e.target;
    const rect = element.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    // Store offset from center
    dragOffsetX.value = clientX - (rect.left + rect.width/2);
    dragOffsetY.value = clientY - (rect.top + rect.height/2);
    
    // Update dragging piece style
    draggingPieceStyle.value = {
        width: `${piece.width}px`,
        height: `${piece.height}px`,
        left: `${clientX - (piece.width/2) - dragOffsetX.value}px`,
        top: `${clientY - (piece.height/2) - dragOffsetY.value}px`,
        transform: 'rotate(0deg) scale(1)',
        backgroundPosition: `-${piece.bgX}px -${piece.bgY}px`
    };
    
    // Remove from tray
    piecesInTray.value = piecesInTray.value.filter(p => p.id !== piece.id);
    
    // Add document listeners
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
}

function handleDrag(e) {
    if (!isDragging.value) return;
    e.preventDefault();
    
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    // Update dragging piece position
    draggingPieceStyle.value = {
        ...draggingPieceStyle.value,
        left: `${clientX - (draggedPiece.value.width/2) - dragOffsetX.value}px`,
        top: `${clientY - (draggedPiece.value.height/2) - dragOffsetY.value}px`
    };
    
    // Check if over correct drop zone
    if (puzzleBoardContainer.value) {
        const boardRect = puzzleBoardContainer.value.getBoundingClientRect();
        const isOverBoard = clientX >= boardRect.left && clientX <= boardRect.right &&
                          clientY >= boardRect.top && clientY <= boardRect.bottom;
        
        highlightedZone.value = null;
        
        if (isOverBoard) {
            // Find the correct zone for this piece
            const correctZoneData = PIECES.find(p => p.id === draggedPiece.value.id);
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
    
    const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
    const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
    
    if (puzzleBoardContainer.value) {
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
                }, 300);
            }
        } else {
            // Return to tray
            piecesInTray.value.push(draggedPiece.value);
            
            // Random position in tray
            const margin = 20;
            const trayWidth = piecesTray.value?.clientWidth || 380;
            const trayHeight = piecesTray.value?.clientHeight || 380;
            const maxX = trayWidth - draggedPiece.value.width - margin;
            const maxY = trayHeight - draggedPiece.value.height - margin;
            
            piecePositions.set(draggedPiece.value.id, {
                left: Math.max(margin, Math.random() * maxX),
                top: Math.max(margin, Math.random() * maxY),
                rotation: Math.random() * 20 - 10,
                scale: 0.85,
                zIndex: Math.floor(Math.random() * 10)
            });
        }
    } else {
        // If board is not available, return to tray
        piecesInTray.value.push(draggedPiece.value);
    }
    
    // Reset dragging state
    isDragging.value = false;
    draggedPiece.value = null;
    highlightedZone.value = null;
    
    // Remove document listeners
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('touchend', handleDragEnd);
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
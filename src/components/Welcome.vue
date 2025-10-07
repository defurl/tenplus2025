<template>
    <section id="welcome">
        <div>
            <h1 class="fancy-font fade-in">TenPlus 2025,</h1>
            <p class="fancy-font subtitle fade-in stagger-1">OG13.</p>
        </div>
        <div class="polaroids-container fade-in stagger-3">
            <div class="polaroid">
                <img src="../assets/images/og13_1.jpg" alt="Tenplus">
                <p class="fancy-font">An End</p>
            </div>
            <div class="polaroid">
                <img src="../assets/images/og13_2.jpg" alt="2025">
                <p class="fancy-font">To Our Beginning</p>
            </div>
        </div>
        <div class="scroll-indicator fade-in stagger-4">
            <svg style="width:2rem; height:2rem; color: #A87C7C;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
    </section>
</template>

<style scoped>
    /* Welcome Section */
    #welcome {
        height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 2rem;
        position: relative;
    }
    #welcome h1 { font-size: 4rem; color: #6B4F4F; }
    #welcome p.subtitle { font-size: 2.5rem; color: #A87C7C; margin-top: 1rem; }
    @media (min-width: 768px) {
        #welcome h1 { font-size: 6rem; }
        #welcome p.subtitle { font-size: 3rem; }
    }
    .polaroids-container {
        position: relative;
        margin-top: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }
    .polaroid {
        background: white;
        padding: 1rem 1rem 3rem 1rem;
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }
    .polaroid img {
        width: 8rem; height: 8rem;
        object-fit: cover;
    }
    .polaroid p { text-align: center; font-size: 1.25rem; margin-top: 0.5rem; color: #555; }
    .polaroid:nth-child(1) { transform: rotate(-12deg); }
    .polaroid:nth-child(2) { transform: rotate(6deg); }
    .polaroid:hover {
        transform: scale(1.05) rotate(0deg) !important;
        z-index: 10;
    }
    @media (min-width: 768px) {
        .polaroid img { width: 12rem; height: 12rem; }
    }
    .scroll-indicator {
        position: absolute;
        bottom: 2.5rem;
        animation: bounce 2s infinite;
    }
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-20px); }
        60% { transform: translateY(-10px); }
    }
</style>
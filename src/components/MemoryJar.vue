<template>
    <section id="memory-jar" ref="sectionRef">
        <h2 class="fancy-font animate-item">Jar of Memories</h2>
        <p class="animate-item delay-1">
            Gửi các OGL, gửi những người đi trước tuyệt vời đã luôn đem đến cho các em nguồn năng lượng tích cực và đã luôn là một vẻ đẹp truyền thống của 10+.
        </p>
        <div class="jar-container animate-item delay-2">
            <img src="../assets/jar.svg" alt="Jar illustration" class="jar-illustration" />

            <div ref="lettersContainer" class="jar-letters-container">
                <button
                    v-for="letter in letters"
                    :key="letter.id"
                    type="button"
                    class="jar-letter"
                    :class="{
                        out: letter.isOut,
                        dragging: letter.isDragging,
                        clickable: !letter.isOut && !letter.isDragging && !letter.wasDragged
                    }"
                    :style="getLetterStyle(letter)"
                    @pointerdown.prevent="handlePointerDown($event, letter)"
                    @click="handleLetterClick(letter)"
                >
                    <svg class="letter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </button>
            </div>
        </div>
    </section>

    <Teleport to="body">
        <div v-if="popupMounted">
            <Transition name="memory-popup" @after-leave="handlePopupLeave" :duration="{ enter: 500, leave: 300 }">
                <div
                    v-show="popupVisible"
                    id="memory-board-popup"
                    :class="{ visible: popupVisible }"
                    @click.self="closePopup"
                >
                <div class="memory-board-content">
                    <button
                        type="button"
                        id="close-memory-board"
                        class="close-button"
                        aria-label="Close memory popup"
                        @click="closePopup"
                    >
                        ×
                    </button>
                    <h3 class="fancy-font">{{ currentLetter?.author || 'An anonymous letter' }}</h3>
                    
                    <div class="memory-content">
                        <p v-if="currentLetter">{{ currentLetter.text }}</p>
                        <!-- Image display (if available) -->
                        <div v-if="currentLetter?.image" class="memory-image-container">
                            <img :src="currentLetter.image" :alt="currentLetter.author || 'Letter image'" class="memory-image" />
                        </div>
                    </div>
                    <div class="close-hint">Tap anywhere to close</div>
                </div>
                </div>
            </Transition>
        </div>
    </Teleport>
</template>

<style scoped>
#memory-jar {
    min-height: 100vh;
    width: 100%;
    padding: 5rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
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

#memory-jar h2 {
    font-size: 3rem;
    text-align: center;
    color: #6B4F4F;
    margin-bottom: 1rem;
}

#memory-jar p {
    text-align: center;
    color: #555;
    margin-bottom: 3rem;
}

.jar-container {
    position: relative;
    width: 32rem;
    height: 48rem;
    max-width: 100%;
}

@media (max-width: 768px) {
    .jar-container {
        width: 28rem;
        height: 42rem;
    }
}

@media (max-width: 480px) {
    .jar-container {
        width: 22rem;
        height: 33rem;
    }
}

.jar-illustration {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}

.jar-letters-container {
    position: absolute;
    inset: 0;
    /* Constrain letters to the visible part of the jar */
    top: 25%;
    bottom: 15%;
    left: 20%;
    right: 20%;
    padding: 0;
    /* Add overflow hidden to ensure letters don't escape */
    overflow: hidden;
}

.jar-letter {
    width: 3rem;
    height: 2rem;
    background-color: #fff8e1;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    cursor: pointer;
    position: absolute;
    border: none;
    outline: none;
    opacity: 1;
    transition: transform 1s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
}

/* Responsive letter sizes */
@media (max-width: 768px) {
    .jar-letter {
        width: 2.5rem;
        height: 1.8rem;
    }
}

@media (max-width: 480px) {
    .jar-letter {
        width: 2.2rem;
        height: 1.6rem;
    }
}

.jar-letter:hover,
.jar-letter:focus-visible {
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    z-index: 15;
}

.jar-letter.dragging {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
}

.jar-letter.out {
    /* Keep letter visible but add subtle visual indication that it's selected */
    box-shadow: 0 0 15px rgba(168, 124, 124, 0.5);
}

.jar-letter.clickable {
    cursor: pointer;
}

.letter-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: #A87C7C;
    pointer-events: none;
}

@media (max-width: 768px) {
    .letter-icon {
        width: 1.25rem;
        height: 1.25rem;
    }
}

@media (max-width: 480px) {
    .letter-icon {
        width: 1.1rem;
        height: 1.1rem;
    }
}

#memory-board-popup {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    z-index: 50;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    pointer-events: none;
    backdrop-filter: blur(0px);
    transition: opacity 0.6s ease, backdrop-filter 0.6s ease;
}

#memory-board-popup.visible {
    opacity: 1;
    pointer-events: auto;
    backdrop-filter: blur(5px);
}

.memory-board-content {
    background-color: #F5EFE6;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    padding: 1.5rem;
    max-width: 90%;
    width: 100%;
    max-height: 80vh;
    position: relative;
    border: 4px solid white;
    transform: scale(0.95) translateY(20px);
    opacity: 0;
    transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    overflow-y: auto;
}

#memory-board-popup.visible .memory-board-content {
    transform: scale(1) translateY(0);
    opacity: 1;
    visibility: visible;
}

/* Ensure content is visible inside visible popup */
#memory-board-popup.visible .memory-content,
#memory-board-popup.visible p {
    opacity: 1 !important;
    visibility: visible !important;
}

.close-button {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    color: #666;
    background: rgba(255, 255, 255, 0.7);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
    line-height: 1;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 10;
    transition: all 0.2s ease;
}

.close-button:hover,
.close-button:focus {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    transform: scale(1.05);
}

@media (max-width: 768px) {
    .close-button {
        width: 40px;
        height: 40px;
        font-size: 1.75rem;
    }
}

.memory-board-content h3 {
    font-size: 1.8rem;
    color: #A87C7C;
    margin-bottom: 1rem;
    text-align: center;
}

.memory-board-content p {
    font-size: 1rem;
    color: #555;
    text-align: center;
    white-space: pre-line;
    line-height: 1.5;
}

/* Responsive font sizes */
@media (max-width: 768px) {
    .memory-board-content h3 {
        font-size: 1.5rem;
    }
    
    .memory-board-content p {
        font-size: 0.9rem;
    }
}

.memory-popup-enter-active,
.memory-popup-leave-active {
    transition: opacity 0.4s ease, backdrop-filter 0.4s ease;
}

.memory-popup-enter-from,
.memory-popup-leave-to {
    opacity: 0;
    backdrop-filter: blur(0px);
}

/* Add specific styles to keep the content visible during transitions */
.memory-popup-enter-active .memory-board-content,
.memory-popup-leave-active .memory-board-content {
    transition: transform 0.4s ease, opacity 0.4s ease;
}

/* Ensure text content is always visible */
.memory-board-content p {
    opacity: 1 !important;
    visibility: visible !important;
}

/* No need for fadeSlideIn animation - removing it */

.memory-content {
    max-height: 50vh;
    overflow-y: auto;
    padding-right: 0.5rem;
    margin-bottom: 1rem;
    /* For mobile scrolling */
    -webkit-overflow-scrolling: touch;
    /* Ensure content doesn't disappear */
    position: relative;
    display: block;
}

.memory-board-content p {
    font-size: 1rem;
    color: #555;
    text-align: center;
    white-space: pre-line;
    line-height: 1.5;
    margin-top: 0;
    margin-bottom: 1.5rem;
    /* Ensure text is always visible */
    opacity: 1 !important;
    visibility: visible !important;
    display: block !important;
}

.memory-image-container {
    margin: 1rem auto;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}

.memory-image {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    margin: 0 auto;
    display: block;
}

.memory-image:hover {
    transform: scale(1.01);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
}

@media (max-width: 768px) {
    /* Stack vertically on smaller screens */
    .memory-content.side-by-side {
        flex-direction: column;
    }
    
    .memory-image {
        max-height: 200px;
    }
}

.close-hint {
    text-align: center;
    font-size: 0.85rem;
    color: #999;
    margin-top: 1rem;
    font-style: italic;
}

@media (min-width: 768px) {
    .close-hint {
        display: none;
    }
}
</style>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const LETTER_MARGIN = 36;
const DRAG_THRESHOLD = 6;

const sectionRef = ref(null);
const lettersContainer = ref(null);
const containerSize = ref({ width: 0, height: 0 });
const initialized = ref(false);

// This method can be called from parent component to force initialization
function beforeEnterViewport() {
    if (!initialized.value) {
        bootstrap();
        initialized.value = true;
    }
}

const rawMemories = [
    "em yêu các anh chị nhiều lắm. các anh chị đã dành cả một mùa hè tuổi niên thiếu của mình cho bọn em. các anh chị nói rằng bọn em là mùa hè của các anh chị. còn các anh chị chính là khởi đầu của bọn em. các anh chị chính là khởi đầu cho những ngày đón nắng ấm tại ngữ, cho những ngày cơn gió mát lạnh phả vào da thịt. là khởi đầu cho những tiếng cười đầy ắp gian phòng khi em chưa quen với môi trường mới, là khởi đầu cho biết bao long lanh vui mừng trong đôi mắt của bọn em khi bước vào ngôi nhà mới. và em mong, chúng ta sẽ cùng nhau đồng hành với nhau thật lâu. chẳng phải một mùa, một năm học, một nghìn ngày, mà là cả một đời luôn được không ạ...",
    "sau campday em muốn mãi được là cper của các anh chị. em biết các anh chị đều là những cper trân quý của các ogl của các anh chị. đôi khi em nhìn các anh chị, em lại nghĩ, không biết đôi lúc nhìn thấy bọn em, các anh chị có trộm nghĩ lại lúc mình mới bước chân vào chuyên ngữ, cũng bỡ ngỡ như em đây không. em nghĩ là các anh chị sẽ nhớ lắm, những phút giây ogtime và famtime khi các anh chị còn là tân học sinh. những bước chân đầu tiên vào ngôi trường mới, những lời chào đầu tiên với những người bạn chưa gặp bao giờ, những khúc mắc về biết bao sự mới mẻ của ngôi trường chuyên ngữ. các anh chị chắc hẳn cũng thấy bỡ ngỡ lắm, thấy sốt sắng khi thấy xung quanh mình toàn những người bạn thật giỏi. hẳn anh chị sẽ có nhiều lắm những lúc mông lung. và em mong dù có nói ra hay không, thì những vết thương, những cảm xúc mà các anh chị giữ riêng cho mình sẽ đều được vỗ về, an ủi, và được chữa lành. khi em ngồi vào nơi góc bàn mới, em thật sự đã thấy mình nhỏ bé lắm trong khoảng trời hình chữ nhật này. nhìn lên trên là bạn thủ khoa ấy, nhìn xuống dưới em lại là bạn đã bỏ túi biết bao chứng chỉ ngoại ngữ, rồi bên cạnh em là lại những người bạn có tài có khiếu, gì cũng biết làm. ngày mới bước vào trường, em thấy lạc lõng, vì thấy có những bạn đã quen nhau từ trước, còn em thì lại lạc lõng đứng một góc nơi sân trường nhìn họ. cho đến khi em được quen biết og13, và cảm giác thân quen lắm với nơi này. từng gói quà kỉ niệm, từng bức ảnh của og mình em vẫn luôn giữ cẩn thận. em biết ơn các anh chị nhiều lắm, vì đã giúp em làm quen, giúp em được biết thêm về mọi người, và rằng em không hề nhỏ bé như em nghĩ. dù bọn em chẳng nói ra nhiều, nhưng các anh chị có ảnh hưởng lớn lắm đến từng cuộc trò chuyện, từng sự làm quen, từng giây phút ở chuyên ngữ của tụi em. quay trở lại về năm đầu của khóa 56, 55, 54, và 52, các anh chị hẳn đã luôn nhung nhớ buổi campday năm ấy, cùng biết bao xúc cảm, những tiếng cười rộn rã trong thuở lập thu, những tiếng nấc cụt vang lên từng đợt vào cuối buổi campday. em thấy thời gian trôi nhanh quá, càng lớn em lại càng cảm thấy thời gian trôi nhanh hơn. các anh chị nhờ. sao những phút giây mong chờ đến buổi ogtime, famtime, và campday dài thế, nhưng khi đến lúc ấy, sao thời gian lại trôi qua nhanh thế, như gió heo may đong đưa chuyên chở vút bay nơi nào. em mong các anh chị sẽ luôn âu yếm những khoảnh khắc là cper của mình, và em biết là anh chị luôn cất giấu nó vào một ngăn trong trái tim mà dẫu cho bụi thời gian có phủ đầy, thì kí ức ấy vẫn còn vẹn nguyên. vì em sẽ làm như vậy, em cũng thế, em cũng sẽ giữ những khoảnh khắc về mười ba của mình thật toàn vẹn trong tim. các anh chị hãy cứ chia sẻ với cper của mình nhé. và cper luôn luôn ở bên các anh chị, đừng quên điều này nhé. og13 luôn ở cùng nhau, sẽ cùng lưu giữ những kí ức và tạo ra nhiều những khoảnh khắc nữa.",
    "enk cj oi e thik cec, crc, cdc, cfc, cnn puzzles, cps, cnn shine, cnn zoom lm, cko e đy cu@ s@u dC k0?",
    "cảm ơn anh híu nhìu đã lập cho web ý nghĩa này. khót lun ớ huhu.",
    "đọc được thì hét lên nhé mng : OG13 ĂN CỨT",
    "ogl và supporter og13 đáng yêu vl",
    "khi nghe câu 'Tất cả vì campers' là em rưng rưng luôn đấy :((( mấy anh chị cute thế không biết. TẤT CẢ VÌ OGL. TẤT CẢ VÌ SUPPORTER.",
    "Lúc em viết những dòng này thì ngoài trời đang đổ cơn mưa. Là cơn mưa rào cuối hạ vào thu. Từng tiếng lộp độp ngang cửa sổ làm em nhớ tới những khi bất chợt mưa rào ngày campday, nhưng rồi các anh chị vẫn lo ổn thỏa hết, vẫn che ô, dẫn bọn em đi vào chỗ trú mưa, không để đứa nào bị ốm. Từng hạt mưa rơi nghiêng lại làm em nhớ đến những giọt mồ hôi trong ngày campday, đều được anh chị quạt cho bay đi hết, rồi những giọt nước mắt trước khi rời og spot, đều được các anh chị vỗ về. quan trọng là, những giọt mưa đêm nay làm em nhớ tới trò đi bơi vcl. về nhà mùi mắm muối chanh từ miệng mấy anh chị vẫn còn, em cũng chưa gội đầu đâu. mát vl nhìn mặt og mình thôi cũng thấy hết khát hết đói, no luôn. og spot ướt át thì vl nhưng vẫn thèm đến lại lần nữa =)))",
    {
        text: "Em muốn cảm ơn các anh chị ogl, supporter và og13 rất nhiều vì những khoảng tgian vừa r ạ. Nhờ mn mà em đỡ bỡ ngỡ hơn khi ở trường, đc bond cùng nhiều người mà em chưa quen biết, và đặc biệt là em đc trải nghiệm không khí sôi động, náo nhiệt ở Campday CNN ạ (hồi đầu em còn khá lo vì em sợ ko quen đc ai;v;). Ngày Camp vừa r, em và những camper khác của og13 đã đc các anh chị chăm sóc tận tình lắm (for riel, đi đâu các anh chị cũng đi cùng luôn, mn cũng ko để camper quạt mà cứ phải là mình cơ:v). Sau hôm camp thì em cũng lụy camp như nhiều người thôi ạ:))). Em cảm ơn mn vì đã cho camper bọn em 1 ngày camp trọn vẹn cùng những tuần ogtime vui vẻ ạ!!!",
        author: "An anonymous letter",
        image: "../src/assets/images/nduong.jpg"
    },
    {
        text: "Em chào các anh chị, em Khoa của anh chị đây ạ heheehhehehe. Có thể trong suốt những ngày og sinh hoạt với nhau và cả campday em không phải đứa sôi nổi hoạt bát lắm, nhưng thực ra em cũng có nhiều điều muốn nói và nhiều tình cảm dành cho mọi người hệ hệ hệ. Thực lòng mà nói ban đầu em không quá hứng thú với 10+: bạn cùng lớp mới còn chưa làm quen xong đã phải chia thành các og, phải sinh hoạt với những người xa lạ, hò hét cheer khản cổ trong cái sân trường bé nhất HN, cứ thi thoảng lại không được ngủ trưa vì fam time og time?! Em bước vào buổi og time đầu tiên đúng với tâm thế như vậy, đã thế là còn vào đúng cái giờ nghỉ trưa buồn ngủ nữa chứ.. Thế nhưng dần dần, anh chị đã thay đổi em hoàn toàn: mọi người không những vui mà còn bựa, lúc nào cũng sát rạt vào bọn em chẳng để đứa nào bị left out; mọi người hỏi han chúng em từng giây từng phút, nâng niu và lúc nào cũng đặt chúng em làm ưu tiên hàng đầu; và hơn cả, là coi chúng em như những đứa em ruột, đối xử với chúng em như những người anh chị lớn đầy yêu thương (ít nhất là em thấy vậy, không biết có thật ko:P). Em sẽ nhớ mãi anh Đức, anh Thắng, anh Nguyên đẹp zai lúc nào cũng ga lăng kê bàn kê ghế cho og, nhớ anh H(ân)ưng, anh Huy tục tục bựa bựa mà đáng yêu, nhớ chị Thảo, chị Phương, chị Hạnh, chị Thư, chị Linh, chị Dương ân cần cute nhất quả đất và anh Hiếu, chị Ngọc tuy bận công việc nhưng luôn cố gắng tham gia cùng chúng em và các ogl, và dĩ nhiên là nhớ cả og mình nữa. Em tin rằng các năm sau dẫu có làm ogl, làm supporter thì trong em vẫn sẽ luôn nhớ về một 10+ thật vui, thật đáng nhớ và thật tuyệt vì được làm camper của các anh chị. Em sẽ luôn ở đây, luôn là đứa em bé bỏng dễ vỡ của anh chị, anh chị há. Em cảm ơn và yêu mọi người thật nhiều i lóve youuu. Yêu thương nhiều lắm,. Em Khoa",
        author: "Nguyễn Đăng Khoa"
    },
    "Các ogl và supporter siêu đáng yêu, nhiệt tình luôn ạ. Ban đầu em thấy mọi người bonding nhiều mà không ai rep em cũng thấy hơi ngại, nhưng mà sau Fam time, og time,  em đã có thể mở lòng hơn, hòa nhập trong một cộng đồng với những sắc màu riêng biệt. Sau 10+, em mới nhận ra, og mình còn lớn hơn một cộng đồng, đó chính là một gia đình. Em thấy rất xúc động cuối ngày 10+, nhưng em sẽ cố gắng khóc, vì anh chị đã cho em biết rằng đây không phải sự kết thúc mà là một khởi đầu mới, cho những kí ức đồng hành cùng anh chị của em. Em iu mọi người nhiều lắm, các ogl, supporter và ogmate ạaaa",
    "Anh Minh Huy có cái vibe hay hay ấy ạ, siu ấn tượng và thu hút với em...",
    {
        text: "Sau ngày camp vừa rồi, em thực sự đã có 1 quãng thời gian hạnh phúc và đáng nhớ, và em muốn gửi tới các anh chị – những người đã đồng hành cùng chúng em trong suốt hành trình 10+ những lời cảm ơn ạ. Em thật sự không biết phải bắt đầu từ đâu, bởi có quá nhiều điều muốn nói, quá nhiều kỷ niệm đáng nhớ, nhưng có lẽ gói gọn lại thì em biết ơn các anh chị rất nhiều ạ. Em cảm ơn các anh chị vì đã mang đến cho chúng em một hành trình thật ý nghĩa trong những ngày đầu tiên đến với CNN – khoảng thời gian mà em còn rất bỡ ngỡ, còn nhiều ngại ngùng thậm chí có chút lạc lõng trước môi trường mới vì em là người khá trầm tính, struggle khi bắt chuyện với người khác nữa ;-; Nhưng chính sự nhiệt huyết, tận tâm và tình cảm chân thành của các anh chị đã giúp em xua tan đi cảm giác ấy, em thực sự rất vui luôn (mà thực ra em không biết diễn tả sao cho đúng cái 'vui' ấy nữa). Có lẽ từng phút, từng giây trong 10+ đều trở thành những dấu ấn khó quên đối với em. Anh chị đã mang đến cho em rất nhiều năng lượng khi chúng em tham gia vào các hoạt động, các trò chơi, cùng chúng em cất tiếng cheer vang dội. Tất cả những khoảnh khắc ấy, dù nhỏ bé, nhưng lại mang một ý nghĩa vô cùng lớn lao với em bởi đó chính là những kỉ niệm đẹp đẽ đầu tiên dưới mái trường cnn. Em vô cùng cảm động khi được anh chị quan tâm, cảm ơn các anh chị đã quạt cho bọn em (dù anh chị cũng rất nóng), chuẩn bị nước cho chúng em, lấy đồ ăn trưa và tối cho bọn em, tự tay làm tặng cho chúng em mỗi người một vỏ sò rất đẹp và làm búp bê cầu nắng cho 1 ngày camp nắng đẹp và rực rỡ. Nhìn anh chị luôn hăng hái, luôn mỉm cười, em cảm thấy bản thân không chỉ được chào đón, mà còn được yêu thương, được sẻ chia. Và nhờ đó, em thấy mình thật sự là một phần của tập thể, một phần của CNN. Thật ra thì khi em mới vào trường, em cũng không biết 10+ là gì vì em không có dùng facebook hay tìm hiểu nhiều về trường, em chỉ mơ hồ hiểu là đó là một chương trình mà anh chị khóa trên sẽ giúp K57 làm quen với trường thôi, em cũng không có mấy ấn tượng (không biết có phải em là người thờ ơ quá ko nữa ;-;), nhưng qua thời gian gắn bó với tất cả mọi người, em đã cảm thấy 10+, các anh chị ogl, supporter và 10+ thật tuyệt vời, em đã có một trải nghiệm vô cùng đáng nhớ với đầy ắp những niềm vui, những tiếng cười, những tiếng cheer đầy nhiệt huyết. Em biết ơn anh chị rất nhiều vì đã luôn kiên nhẫn liên lạc và cập nhật thông tin cho em trong suốt hành trình 10+ mặc dù mới đầu em còn chưa lập facebook, và cũng ít khi check tin trên mess (em thấy em cứ như người tối cổ í ;-;) Em rất thích mấy trò chơi của anh chị ạ: ma sói (em vẫn chưa trả anh thẻ bài em đang cầm), bài (em cũng thích mà lúc đó chưa có chơi :))), trò 12345 quay ngược thời gian gì đó (giờ em vẫn chưa hiểu gì cả :))) mà đặc biệt là cái trò đi biển (thật sự là 1 trải nghiệm thú vị - chắc phải là chuyến du lịch biển thú vị nhất đời em luôn) và em cũng ấn tượng với chuông báo thức của mấy anh chị lắm ạ. Hành trình 10+ tuy không dài, nhưng em nghĩ rằng những gì mà 10+ để lại sẽ là một trong những kỷ niệm quý giá nhất của những năm tháng ở cnn. Em thật sự rất hạnh phúc và tự hào khi được là camper của các anh chị. Và em cũng thầm mong một ngày nào đó, em có thể trở thành 'anh chị' của một thế hệ mới, để tiếp nối và trao đi những gì mà em đã may mắn được nhận hôm nay. Em xin gửi lời cảm ơn đến các anh chị, vì tình cảm chân thành mà các anh chị đã dành cho chúng em, (vì đã đọc hết đống lan man này của em ;-;) vì tất cả những gì anh chị đã làm cho chúng em, vì một hành trình 10+ không thể nào quên ạ. Cảm ơn anh chị đã cho em cơ hội được gửi gắm những lời cảm ơn mà em chưa nói được với các anh chị ạ. Em còn muốn được gặp anh chị nữa, khi nào anh chị đi lăn thì gọi em đi với nha.",
        author: "Lê Ngọc Khánh Vi",
        image: "../src/assets/images/nkvile.jpg"
    },
    "Đây là sân khấu của anh Lê Minh Huy\nĐây là thảm đỏ của anh Trần Đình Gia Hưng\nĐây là sân chơi của anh Nguyễn Hoàng Đức\nĐây là sân nhà của anh Nguyễn Khôi Nguyên\nĐây là lãnh thổ của chị Nguyễn Hà Phương\nĐây là sàn diễn của anh Vũ Chiến Thắng\nĐây là party của chị Vũ Thùy Dương\nĐây là khán đài của chị Lê Vũ Khánh Linh\nĐây là lễ đài của Nguyễn Thị Bích Hạnh\nĐây là vũ đài của chị Vũ Phương Thảo\nĐây là địa bàn của anh Trần Minh Hiếu\nĐây là tiệc gala của chị Vũ Minh Ngọc\nĐây là sàn catwalk của chị Nguyễn Minh Thư"
];

const letters = ref([]);
const popupMounted = ref(false);
const popupVisible = ref(false);
const currentLetter = ref(null);
const draggingLetter = ref(null);
const dragContext = ref({ offsetX: 0, offsetY: 0, startX: 0, startY: 0 });
// Track if a popup is in the process of closing to prevent rapid open/close issues
const isClosingPopup = ref(false);

let scrollObserver = null;

function clamp(value, min, max) {
    if (min > max) {
        return (min + max) / 2;
    }
    return Math.min(Math.max(value, min), max);
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function getContainerRect() {
    return lettersContainer.value?.getBoundingClientRect() ?? null;
}

function randomizeLetterPlacement(letter) {
    const rect = getContainerRect();
    if (!rect) {
        return;
    }

    containerSize.value = { width: rect.width, height: rect.height };

    if (rect.width <= LETTER_MARGIN * 8 || rect.height <= LETTER_MARGIN * 2) {
        letter.left = rect.width / 2;
        letter.top = rect.height / 2;
    } else {
        // Use a narrower area for horizontal placement (centered in jar)
        const horizontalPadding = rect.width * 0.3; // 30% padding from edges
        letter.left = randomBetween(horizontalPadding, rect.width - horizontalPadding);
        
        // Constrain vertical placement to the middle 60% of the container
        const verticalPadding = rect.height * 0.2; // 20% padding from top and bottom
        letter.top = randomBetween(verticalPadding, rect.height - verticalPadding);
    }
    letter.rotate = randomBetween(-30, 30);
    letter.scale = randomBetween(0.75, 0.95);
}

function initializeLetters() {
    const rect = getContainerRect();
    if (!rect) {
        return;
    }

    containerSize.value = { width: rect.width, height: rect.height };

    letters.value = rawMemories.map((content, index) => {
        // Check if the content is a string (legacy format) or an object with text/author/image
        const isStringContent = typeof content === 'string';
        
        const letter = {
            id: index + 1,
            text: isStringContent ? content : content.text,
            author: isStringContent ? "An anonymous letter" : (content.author || "An anonymous letter"),
            image: isStringContent ? null : content.image,
            left: rect.width / 2,
            top: rect.height / 2,
            rotate: randomBetween(-15, 15),
            scale: 0.85,
            isVisible: true,
            isOut: false,
            isDragging: false,
            wasDragged: false
        };

        randomizeLetterPlacement(letter);
        
        // Apply a slight position delay for visual staggering but always be visible
        letter.scale = 0.85 + (index * 0.005);

        return letter;
    });
}

function getLetterStyle(letter) {
    const transforms = ['translate(-50%, -50%)'];

    if (letter.isOut) {
        // Letter is being viewed in popup but still visible in jar
        transforms.push(`rotate(${letter.rotate}deg)`);
        transforms.push(`scale(${letter.scale})`);
    } else {
        transforms.push(`rotate(${letter.isDragging ? 0 : letter.rotate}deg)`);
        transforms.push(`scale(${letter.isDragging ? 1 : letter.scale})`);
    }

    return {
        left: `${letter.left}px`,
        top: `${letter.top}px`,
        transform: transforms.join(' '),
        transition: letter.isDragging ? 'none' : undefined
    };
}

function handlePointerDown(event, letter) {
    // Prevent drag operations during popups or transitions
    if (popupVisible.value || isClosingPopup.value || letter.isOut) {
        return;
    }

    const rect = getContainerRect();
    if (!rect) {
        return;
    }

    // Clear any existing drag operation
    if (draggingLetter.value) {
        draggingLetter.value.isDragging = false;
        draggingLetter.value.wasDragged = false;
    }

    // Set up new drag operation
    draggingLetter.value = letter;
    letter.isDragging = true;
    letter.wasDragged = false;

    dragContext.value = {
        offsetX: event.clientX - rect.left - letter.left,
        offsetY: event.clientY - rect.top - letter.top,
        startX: event.clientX,
        startY: event.clientY
    };

    // Use capture phase to ensure we get all events
    window.addEventListener('pointermove', handlePointerMove, { capture: true });
    window.addEventListener('pointerup', handlePointerUp, { capture: true });
    
    // Prevent default to avoid text selection during drag
    event.preventDefault();
}

function handlePointerMove(event) {
    const letter = draggingLetter.value;
    if (!letter) {
        return;
    }

    const rect = getContainerRect();
    if (!rect) {
        return;
    }

    // Calculate new position
    let newLeft = event.clientX - rect.left - dragContext.value.offsetX;
    let newTop = event.clientY - rect.top - dragContext.value.offsetY;
    
    // Add horizontal constraints to keep letters inside jar shape
    const horizontalPadding = rect.width * 0.3; // 30% padding from edges
    // Add vertical constraints to keep letters in middle area of jar
    const verticalPadding = rect.height * 0.2; // 20% padding from top and bottom
    
    newLeft = clamp(newLeft, horizontalPadding, Math.max(horizontalPadding, rect.width - horizontalPadding));
    newTop = clamp(newTop, verticalPadding, Math.max(verticalPadding, rect.height - verticalPadding));

    // Check if we've exceeded the drag threshold
    if (!letter.wasDragged) {
        const dx = event.clientX - dragContext.value.startX;
        const dy = event.clientY - dragContext.value.startY;
        if (Math.hypot(dx, dy) > DRAG_THRESHOLD) {
            letter.wasDragged = true;
        }
    }

    // Update position
    letter.left = newLeft;
    letter.top = newTop;
    
    // Prevent default to avoid text selection during drag
    event.preventDefault();
    event.stopPropagation();
}

function handlePointerUp(event) {
    const letter = draggingLetter.value;
    if (letter) {
        letter.isDragging = false;
        letter.scale = randomBetween(0.8, 0.95);
        
        // Reset wasDragged state after a small delay
        // to prevent immediate click after drag
        const wasDragged = letter.wasDragged;
        setTimeout(() => {
            if (letter === draggingLetter.value || !draggingLetter.value) {
                letter.wasDragged = false;
            }
        }, 200);
    }

    draggingLetter.value = null;
    
    // Clean up event listeners
    window.removeEventListener('pointermove', handlePointerMove, { capture: true });
    window.removeEventListener('pointerup', handlePointerUp, { capture: true });
    
    // Prevent default behavior
    event.preventDefault();
}

function handleLetterClick(letter) {
    // Prevent clicking while another popup is closing or if letter is already active
    if (isClosingPopup.value || letter.isOut || letter.isDragging || letter.wasDragged) {
        return;
    }

    // Disable scrolling on body when popup is open
    document.body.style.overflow = 'hidden';

    // First mount the popup with the letter content
    currentLetter.value = letter;
    letter.isOut = true;
    popupMounted.value = true;
    
    // Force a delay before showing the popup to ensure content is fully rendered
    setTimeout(() => {
        if (currentLetter.value === letter) { // Only proceed if the letter hasn't changed
            popupVisible.value = true;
        }
    }, 10);
}

// isClosingPopup ref is defined at the top of the script

function closePopup() {
    if (isClosingPopup.value) return; // Prevent multiple closing actions
    isClosingPopup.value = true;
    
    // First hide the popup, then handlePopupLeave will be called via transition events
    popupVisible.value = false;
    
    // Re-enable scrolling on body when popup is closed
    document.body.style.overflow = '';
    
    // Don't immediately reset the letter state, let the transition complete first
    // The actual reset will happen in handlePopupLeave
}

function handlePopupLeave() {
    // Only process this if we have a current letter
    const letter = currentLetter.value;
    
    if (letter) {
        // Reset the letter state
        letter.isOut = false;
        letter.wasDragged = false;
        letter.isDragging = false;
    }
    
    // Clear mounted state
    popupMounted.value = false;
    currentLetter.value = null;
    
    // Allow new popups to be opened after a small delay
    setTimeout(() => {
        isClosingPopup.value = false;
    }, 200);
}

function handleResize() {
    const rect = getContainerRect();
    if (!rect || !containerSize.value.width || !containerSize.value.height) {
        containerSize.value = { width: rect?.width ?? 0, height: rect?.height ?? 0 };
        return;
    }

    const scaleX = rect.width / containerSize.value.width;
    const scaleY = rect.height / containerSize.value.height;

    letters.value.forEach(letter => {
        letter.left = clamp(letter.left * scaleX, LETTER_MARGIN, Math.max(LETTER_MARGIN, rect.width - LETTER_MARGIN));
        letter.top = clamp(letter.top * scaleY, LETTER_MARGIN, Math.max(LETTER_MARGIN, rect.height - LETTER_MARGIN));
    });

    containerSize.value = { width: rect.width, height: rect.height };
}

function setupScrollReveal() {
    if (!sectionRef.value) {
        return;
    }

    scrollObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                scrollObserver?.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    sectionRef.value.querySelectorAll('.scroll-reveal').forEach(el => {
        scrollObserver?.observe(el);
    });
}

function bootstrap() {
    const rect = getContainerRect();
    if (!rect || rect.width === 0 || rect.height === 0) {
        // Retry with a longer delay to ensure DOM is fully rendered
        setTimeout(bootstrap, 500);
        return;
    }

    initializeLetters();
    setupScrollReveal();
}

onMounted(() => {
    // Set an immediate timeout to get out of the current execution cycle
    setTimeout(() => {
        // Then use nextTick to wait for Vue to finish rendering
        nextTick(() => {
            // Then add another small delay to make sure everything is settled
            setTimeout(() => {
                bootstrap();
                window.addEventListener('resize', handleResize);
            }, 200);
        });
    }, 0);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    scrollObserver?.disconnect();
});
</script>
<template>
  <section id="train-gallery" ref="sectionRef">
    <h2 class="fancy-font animate-item">The Journey for a Wonderful Campday</h2>
    <p class="animate-item delay-1">
    Từ những người xa lạ kết nối với nhau qua post trúng tuyển và chia OG của 10+. Và từ đó, 6+7 con người đã cùng nhau đi qua những tháng ngày của hè năm đó. Qua tập luyện, qua cả bất đồng, qua khó khăn, và sau 4 Train, 1 Dryrun, các OGL đã sẵn sàng để cùng nhau, cùng Camper, tạo nên một mùa <span class="fancy-font" style="font-size:1.5em;">Mười Cộng</span> đáng nhớ 
    </p>

    <div class="gallery-container">
      <!-- Training Event 1 -->
      <div v-scroll-reveal="{ fromDirection: 'left' }" class="gallery-item">
        <div class="image-container animate-item animate-from-left">
          <img src="../assets/images/train1_1.jpg" alt="Train 1" class="gallery-image" />
        </div>
        <div class="gallery-content animate-item animate-from-right delay-1">
          <h3>Khởi sắc</h3>
          <p>
            Khởi Sắc, những con người ấy thực sự gặp sau những ngày bonding qua tin nhắn.
            Và thế là những nhân cách dần lộ diện, với sự "loa phường", sự "thánh thiện", và sự "lowkey",
            những màu sắc từ những con người ấy chính là những "dấu ấn" đầu tiên của gia đình mới.
          </p>
        </div>
      </div>

      <!-- Training Event 2 -->
      <div class="gallery-item animate-item delay-3">
        <div class="image-container">
          <img src="../assets/images/train2_1.jpg" alt="Train 2" class="gallery-image" />
        </div>
        <div class="gallery-content">
          <h3>Hòa Sắc</h3>
          <p>
            Tôi không đi train 2, tđgh sẽ viết phần này :>
          </p>
        </div>
      </div>

      <!-- Training Event 3 -->
      <div class="gallery-item animate-item delay-4">
        <div class="image-container">
          <img src="../assets/images/train3_1.jpg" alt="Third Training Event" class="gallery-image" />
        </div>
        <div class="gallery-content">
          <h3>Bừng Sắc</h3>
          <p>
            Một ngày nắng chen lẫn chút mưa đầu chiều, Train 3 là một trải nghiệm đa chiều đối với người sup già này.
            Anh ta ngủ 3 tiếng và chạy đến train với 2 bên bọng mắt xám xịt.
            Tuy nhiên gia đình, và toàn train vẫn cho anh ấy niềm vui, năng lượng và sự quan tâm tuyệt vời.
            Cuối train 3 là một session free mic, lúc mà anh ấy đã định có đôi lời cảm ơn, nhưng sau cùng thì lại quyết định giữ lại trong lòng,
            hehe.
          </p>
          <p>- Supporter K52</p>
        </div>
      </div>

      <!-- Training Event 4 -->
      <div class="gallery-item animate-item delay-5">
        <div class="image-container">
          <img src="../assets/images/train4_2.jpg" alt="Train 4" class="gallery-image" />
        </div>
        <div class="gallery-content">
          <h3>Tỏa Sắc</h3>
          <p>
            Tôi cũng sủi train 4 :>
          </p>
        </div>
      </div>

      <!-- Dryrun Event -->
      <div class="gallery-item animate-item delay-6">
        <div class="image-container">
          <img src="../assets/images/dryrun.jpg" alt="Dryrun" class="gallery-image" />
        </div>
        <div class="gallery-content">
          <h3>Dryrun Day</h3>
          <p>
            03:08AM - 08/10,
          </p>
          <p>
            Và anh quyết định nhớ về mười cộng, về dryrun, về những con người đã bên anh vượt qua 4 ngày train vui vẻ và mệt mỏi.
            Đẹp sao thì dryrun là một ngày mưa tầm tã, anh được nhìn những "đứa trẻ" ogl của mình vui vẻ, hăng hái, và tràn đầy năng lượng và tận hưởng ngày dryrun dành cho chính chúng ta.
            Bức ảnh này quen không? Đúng vậy, bức ảnh này là cảm xúc mà khó có lời nào diễn tả đủ được, khi mà mọi người đều như quên đi mọi điều xung quanh,
            tâm trí và trái tim đều đang tập trung vào 10+, và vào gia đình nhỏ xung quanh mình. Khoảnh khắc của những lời hứa, những lời cảm ơn và xin lỗi, và không thể thiếu những giọt nước mắt, nhỉ?
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
#train-gallery {
  min-height: 100vh;
  width: 100%;
  padding: 5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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
.delay-4 { animation-delay: 0.8s; }
.delay-5 { animation-delay: 1s; }
.delay-6 { animation-delay: 1.2s; }

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

#train-gallery h2 {
  font-size: 3rem;
  text-align: center;
  color: #6B4F4F;
  margin-bottom: 1rem;
}

#train-gallery > p {
  text-align: center;
  color: #555;
  margin-bottom: 3rem;
  max-width: 800px;
}

.gallery-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.gallery-item {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

/* Alternate layout for wider screens */
@media (min-width: 768px) {
  .gallery-item {
    flex-direction: row;
    align-items: center;
  }
  
  .gallery-item:nth-child(even) {
    flex-direction: row-reverse;
  }
  
  .image-container {
    flex: 1;
    max-width: 50%;
  }
  
  .gallery-content {
    flex: 1;
    padding: 2rem;
  }
}

.image-container {
  width: 100%;
  position: relative;
  overflow: hidden;
}

.gallery-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.05);
}

.gallery-content {
  padding: 1.5rem;
}

.gallery-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #A87C7C;
}

.gallery-content p {
  color: #555;
  line-height: 1.6;
}

/* Mobile optimization */
@media (max-width: 767px) {
  .gallery-item {
    margin-bottom: 2rem;
  }
  
  .gallery-content {
    padding: 1.5rem;
  }
  
  .gallery-content h3 {
    font-size: 1.25rem;
  }
  
  #train-gallery h2 {
    font-size: 2.25rem;
  }
}
</style>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const sectionRef = ref(null);
let scrollObserver = null;

// This method can be called from parent component if needed
function beforeEnterViewport() {
  // Any initialization needed when entering viewport
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

onMounted(() => {
  setupScrollReveal();
});

onBeforeUnmount(() => {
  scrollObserver?.disconnect();
});
</script>
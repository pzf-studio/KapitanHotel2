// Инициализация галереи номера
function initRoomGallery() {
    const mainSlide = document.querySelector('.gallery-main .main-slide');
    const thumbnails = document.querySelectorAll('.gallery-thumbnails .thumbnail');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const currentSlideEl = document.querySelector('.current-slide');
    const totalSlidesEl = document.querySelector('.total-slides');
    
    let currentIndex = 0;
    const images = [
        'images/comfort1/1.JPG',
        'images/comfort1/2.JPG',
        'images/comfort1/3.JPG',
        'images/comfort1/4.JPG',
        'images/comfort1/5.JPG',
        'images/comfort1/6.JPG'
    ];
    
    // Установка общего количества слайдов
    totalSlidesEl.textContent = images.length;
    
    // Обновление главного слайда
    function updateMainSlide(index) {
        mainSlide.style.backgroundImage = `url('${images[index]}')`;
        currentSlideEl.textContent = index + 1;
        
        // Обновление активной миниатюры
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
    
    // Переход к следующему слайду
    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        updateMainSlide(currentIndex);
    }
    
    // Переход к предыдущему слайду
    function prevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateMainSlide(currentIndex);
    }
    
    // Обработчики для кнопок навигации
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Обработчики для миниатюр
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            currentIndex = index;
            updateMainSlide(currentIndex);
        });
    });
    
    // Автопрокрутка галереи
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Остановка автопрокрутки при наведении
    const galleryArea = document.querySelector('.room-gallery');
    galleryArea.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    galleryArea.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // Инициализация первого слайда
    updateMainSlide(0);
}

// Инициализация формы бронирования
function initBookingForm() {
    const form = document.querySelector('.mini-booking-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        const guests = document.getElementById('guests').value;
        
        if (!checkin || !checkout) {
            alert('Пожалуйста, выберите даты заезда и выезда');
            return;
        }
        
        // Здесь должна быть логика проверки доступности
        // В данном примере просто перенаправляем на страницу бронирования
        window.location.href = 'index.html#booking';
    });
}

// Инициализация мобильного меню
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initRoomGallery();
    initBookingForm();
    initMobileMenu();
    
    // Анимация появления элементов
    gsap.utils.toArray('.room-hero, .room-description, .similar-rooms').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%'
            },
            opacity: 0,
            y: 50,
            duration: 0.8
        });
    });
});
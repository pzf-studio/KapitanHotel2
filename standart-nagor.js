function initRoomGallery() {
    const mainSlide = document.querySelector('.gallery-main .main-slide');
    const thumbnails = document.querySelectorAll('.gallery-thumbnails .thumbnail');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const currentSlideEl = document.querySelector('.current-slide');
    const totalSlidesEl = document.querySelector('.total-slides');
    
    const galleryMain = document.querySelector('.gallery-main');
    const galleryThumbnails = document.querySelector('.gallery-thumbnails');
    
    let currentIndex = 0;
    const images = [
        'images/nagor/standart/photo_1_2025-11-30_17-38-05.jpg',
        'images/nagor/standart/photo_2_2025-11-30_17-38-05.jpg',
        'images/nagor/standart/photo_3_2025-11-30_17-38-05.jpg',
        'images/nagor/standart/photo_4_2025-11-30_17-38-05.jpg',
        'images/nagor/standart/photo_5_2025-11-30_17-38-05.jpg',
        'images/nagor/standart/photo_6_2025-11-30_17-38-05.jpg'
    ];
    
    totalSlidesEl.textContent = images.length;
    
    galleryMain.classList.add('vertical');
    galleryThumbnails.classList.add('vertical');
    
    function updateMainSlide(index) {
        mainSlide.style.backgroundImage = `url('${images[index]}')`;
        currentSlideEl.textContent = index + 1;
        
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        updateMainSlide(currentIndex);
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateMainSlide(currentIndex);
    }
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            currentIndex = index;
            updateMainSlide(currentIndex);
        });
    });
    
    let slideInterval = setInterval(nextSlide, 5000);
    
    const galleryArea = document.querySelector('.room-gallery');
    galleryArea.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    galleryArea.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    updateMainSlide(0);
}

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
        
        window.location.href = 'index.html#booking';
    });
}

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initRoomGallery();
    initBookingForm();
    initMobileMenu();
    
    if (typeof gsap !== 'undefined') {
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
    }
});
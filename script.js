// script.js

// ==================== Инициализация слайдера hero-секции ====================
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.pagination-dots');
    let currentSlide = 0;
    let slideInterval;

    // Создание точек пагинации
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === currentSlide) dot.classList.add('active');
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(index);
            startSlideTimer();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (index + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function startSlideTimer() {
        slideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    // Запуск автоматической смены слайдов
    startSlideTimer();
}

// Обновленный скрипт для бронирования
function initBookingSystem() {
    const bookingForm = document.getElementById('booking-form');
    const steps = document.querySelectorAll('.booking-step');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const stepLine = document.querySelector('.step-line');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const submitBtn = document.querySelector('.btn-submit');
    const hotelOptions = document.querySelectorAll('.hotel-option');
    const bookingTypeOptions = document.querySelectorAll('.booking-type-option');
    const hoursOptions = document.querySelectorAll('.hours-option');
    const roomOptions = document.querySelectorAll('.room-option');
    const checkinDateInput = document.getElementById('checkin-date');
    const checkoutDateInput = document.getElementById('checkout-date');
    const clearDatesBtn = document.querySelector('.btn-clear-dates');
    const hourlyTimeSelection = document.getElementById('hourly-time-selection');
    
    let currentStep = 1;
    let selectedHotel = 'bulvar';
    let selectedBookingType = null;
    let selectedHours = 1;
    let selectedRoom = 'standard';
    let thirdPerson = false;
    let checkinDate = null;
    let checkoutDate = null;
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    
    // Инициализация календаря
    initCalendar();
    
    // Обработчики для выбора отеля
    hotelOptions.forEach(option => {
        option.addEventListener('click', () => {
            hotelOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedHotel = option.dataset.hotel;
        });
    });
    
    // Обработчики для выбора типа бронирования
    bookingTypeOptions.forEach(option => {
        option.addEventListener('click', () => {
            bookingTypeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedBookingType = option.dataset.type;
            
            // Показываем/скрываем выбор часов
            const hoursSelection = document.querySelector('.hours-selection');
            if (selectedBookingType === 'hourly') {
                hoursSelection.style.display = 'block';
                hourlyTimeSelection.style.display = 'block';
            } else {
                hoursSelection.style.display = 'none';
                hourlyTimeSelection.style.display = 'none';
            }
            
            updateRoomPrices();
        });
    });
    
    // Обработчики для выбора количества часов
    hoursOptions.forEach(option => {
        option.addEventListener('click', () => {
            hoursOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedHours = parseInt(option.dataset.hours);
            updateRoomPrices();
        });
    });
    
    // Обработчики для выбора типа номера
    roomOptions.forEach(option => {
        option.addEventListener('click', () => {
            roomOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedRoom = option.dataset.room;
        });
    });
    
    // Обработчик для чекбокса третьего человека
    document.getElementById('third-person').addEventListener('change', function() {
        thirdPerson = this.checked;
    });
    
    // Обработчик для кнопки очистки дат
    clearDatesBtn.addEventListener('click', () => {
        checkinDate = null;
        checkoutDate = null;
        checkinDateInput.value = '';
        checkoutDateInput.value = '';
        renderCalendar(currentMonth, currentYear);
    });
    
    // Обработчики для кнопок навигации
    nextBtn.addEventListener('click', goToNextStep);
    prevBtn.addEventListener('click', goToPrevStep);
    submitBtn.addEventListener('click', submitBooking);
    
    // Функция перехода к следующему шагу
    function goToNextStep() {
        if (currentStep === 1 && !selectedHotel) {
            showError('Пожалуйста, выберите отель');
            return;
        }
        
        if (currentStep === 2 && !selectedBookingType) {
            showError('Пожалуйста, выберите тип бронирования');
            return;
        }
        
        if (currentStep === 2 && selectedBookingType === 'hourly' && !selectedHours) {
            showError('Пожалуйста, выберите количество часов');
            return;
        }
        
        if (currentStep === 2 && !selectedRoom) {
            showError('Пожалуйста, выберите тип номера');
            return;
        }
        
        if (currentStep === 3 && (!checkinDate || !checkoutDate)) {
            showError('Пожалуйста, выберите даты заезда и выезда');
            return;
        }
        
        if (currentStep === 3 && new Date(checkoutDate) <= new Date(checkinDate)) {
            showError('Дата выезда должна быть позже даты заезда');
            return;
        }
        
        // Обновляем шаги
        steps.forEach(step => step.classList.remove('active'));
        stepIndicators.forEach(step => step.classList.remove('active'));
        
        currentStep++;
        
        document.querySelector(`.booking-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.add('active');
        
        // Обновляем линию прогресса
        updateProgressLine();
        
        // Обновляем кнопки
        prevBtn.disabled = currentStep === 1;
        
        if (currentStep === 4) {
            updateSummary();
        }
    }
    
    // Функция перехода к предыдущему шагу
    function goToPrevStep() {
        steps.forEach(step => step.classList.remove('active'));
        stepIndicators.forEach(step => step.classList.remove('active'));
        
        currentStep--;
        
        document.querySelector(`.booking-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.step-indicator[data-step="${currentStep}"]`).classList.add('active');
        
        // Обновляем линию прогресса
        updateProgressLine();
        
        // Обновляем кнопки
        prevBtn.disabled = currentStep === 1;
    }
    
    // Обновление линии прогресса
    function updateProgressLine() {
        const progress = (currentStep - 1) / (steps.length - 1) * 100;
        stepLine.style.setProperty('--progress', `${progress}%`);
        
        // Управление видимостью кнопок
        if (currentStep === 1) {
            prevBtn.disabled = true;
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        } else if (currentStep === steps.length) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
        } else {
            prevBtn.disabled = false;
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
    }
    
    // Инициализация календаря
    function initCalendar() {
        const calendarGrid = document.querySelector('.calendar-grid');
        const monthYear = document.querySelector('.calendar-month');
        const prevMonthBtn = document.querySelector('.prev-month');
        const nextMonthBtn = document.querySelector('.next-month');
        
        // Удаляем дни месяца (оставляем только заголовки дней недели)
        const weekdays = Array.from(calendarGrid.children).slice(0, 7);
        calendarGrid.innerHTML = '';
        weekdays.forEach(day => calendarGrid.appendChild(day));
        
        renderCalendar(currentMonth, currentYear);
        
        // Обработчики для кнопок навигации по месяцам
        prevMonthBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar(currentMonth, currentYear);
        });
        
        nextMonthBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar(currentMonth, currentYear);
        });
        
        // Обработчики для выбора дат
        checkinDateInput.addEventListener('focus', () => {
            if (checkinDate) {
                const date = new Date(checkinDate);
                currentMonth = date.getMonth();
                currentYear = date.getFullYear();
                renderCalendar(currentMonth, currentYear);
            }
        });
        
        checkoutDateInput.addEventListener('focus', () => {
            if (checkoutDate) {
                const date = new Date(checkoutDate);
                currentMonth = date.getMonth();
                currentYear = date.getFullYear();
                renderCalendar(currentMonth, currentYear);
            }
        });
    }
    
    // Отрисовка календаря
    function renderCalendar(month, year) {
        const calendarGrid = document.querySelector('.calendar-grid');
        const monthYear = document.querySelector('.calendar-month');
        
        // Удаляем дни месяца (оставляем только заголовки дней недели)
        const weekdays = Array.from(calendarGrid.children).slice(0, 7);
        calendarGrid.innerHTML = '';
        weekdays.forEach(day => calendarGrid.appendChild(day));
        
        // Устанавливаем название месяца и года
        const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
                          "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
        monthYear.textContent = `${monthNames[month]} ${year}`;
        
        // Получаем первый день месяца и количество дней в месяце
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Добавляем пустые ячейки для дней предыдущего месяца
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Добавляем дни месяца
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Форматируем дату для сравнения
            const formattedDay = day < 10 ? `0${day}` : day;
            const formattedMonth = month + 1 < 10 ? `0${month + 1}` : month + 1;
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
            const date = new Date(year, month, day);
            
            // Проверяем, является ли день прошедшим
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date < today) {
                dayElement.classList.add('booked');
                dayElement.title = 'Недоступно';
            }
            
            // Проверяем, является ли день сегодняшним
            if (date.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }
            
            // Проверяем, совпадает ли день с выбранными датами
            if (checkinDate && dateStr === checkinDate) {
                dayElement.classList.add('selected');
            } else if (checkoutDate && dateStr === checkoutDate) {
                dayElement.classList.add('selected');
            } else if (checkinDate && checkoutDate && 
                       date > new Date(checkinDate) && 
                       date < new Date(checkoutDate)) {
                dayElement.classList.add('in-range');
            }
            
            // Обработчик клика по дню
            dayElement.addEventListener('click', () => {
                if (dayElement.classList.contains('booked')) return;
                
                const selectedDate = new Date(year, month, day);
                const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
                
                if (!checkinDate || (checkoutDate && selectedDate >= new Date(checkinDate))) {
                    // Если дата выезда уже выбрана или выбрана дата после заезда, сбрасываем выбор
                    checkinDateInput.value = formatDate(dateStr);
                    checkoutDateInput.value = '';
                    checkinDate = dateStr;
                    checkoutDate = null;
                } else if (selectedDate > new Date(checkinDate)) {
                    // Выбираем дату выезда
                    checkoutDateInput.value = formatDate(dateStr);
                    checkoutDate = dateStr;
                }
                
                // Обновляем календарь
                renderCalendar(currentMonth, currentYear);
            });
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    // Форматирование даты для отображения
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
    }
    
    // Обновление цен в зависимости от типа бронирования
    function updateRoomPrices() {
        roomOptions.forEach(option => {
            const priceElement = option.querySelector('.room-price');
            const roomType = option.dataset.room;
            
            let price = 0;
            let priceText = '';
            
            if (selectedBookingType === 'hourly') {
                price = parseInt(priceElement.dataset.hourly);
                priceText = `${price.toLocaleString('ru-RU')}₽/час`;
            } else if (selectedBookingType === 'night') {
                price = parseInt(priceElement.dataset.night);
                priceText = `${price.toLocaleString('ru-RU')}₽/ночь`;
            } else if (selectedBookingType === 'daily') {
                price = parseInt(priceElement.dataset.daily);
                priceText = `${price.toLocaleString('ru-RU')}₽/сутки`;
            }
            
            priceElement.textContent = priceText;
        });
    }
    
    // Обновление сводки бронирования
    function updateSummary() {
        // Обновляем информацию об отеле
        const summaryHotel = document.getElementById('summary-hotel');
        if (selectedHotel === 'bulvar') {
            summaryHotel.textContent = '"У Капитана" на Нагорном бульваре';
        } else {
            summaryHotel.textContent = '"У Капитана" на Севастопольском проспекте';
        }
        
        // Обновляем информацию о номере
        const summaryRoom = document.getElementById('summary-room');
        const roomNames = {
            'standard': 'Стандарт (STD)',
            'delux': 'Делюкс (Delux)',
            'suite': 'Люкс (Suite)'
        };
        summaryRoom.textContent = roomNames[selectedRoom] || 'Стандарт';
        
        // Обновляем информацию о периоде
        const summaryPeriod = document.getElementById('summary-period');
        const selectedRoomOption = document.querySelector(`.room-option[data-room="${selectedRoom}"]`);
        let basePrice = 0;
        let priceDescription = '';
        
        if (selectedBookingType === 'hourly') {
            basePrice = parseInt(selectedRoomOption.querySelector('.room-price').dataset.hourly);
            priceDescription = `${selectedHours} ${getHourWord(selectedHours)} × ${basePrice.toLocaleString('ru-RU')}₽`;
            summaryPeriod.textContent = `${selectedHours} ${getHourWord(selectedHours)}`;
        } else if (selectedBookingType === 'night') {
            basePrice = parseInt(selectedRoomOption.querySelector('.room-price').dataset.night);
            priceDescription = `Ночь × ${basePrice.toLocaleString('ru-RU')}₽`;
            summaryPeriod.textContent = `Ночь (${formatDate(checkinDate)} - ${formatDate(checkoutDate)})`;
        } else if (selectedBookingType === 'daily') {
            basePrice = parseInt(selectedRoomOption.querySelector('.room-price').dataset.daily);
            priceDescription = `Сутки × ${basePrice.toLocaleString('ru-RU')}₽`;
            summaryPeriod.textContent = `Сутки (${formatDate(checkinDate)} - ${formatDate(checkoutDate)})`;
        }
        
        // Обновляем описание цены
        document.getElementById('price-description').textContent = priceDescription;
        document.getElementById('base-price').textContent = `${basePrice.toLocaleString('ru-RU')}₽`;
        
        // Обновляем информацию о третьем человеке
        const thirdPersonElement = document.getElementById('summary-third-person');
        const thirdPersonPriceElement = document.getElementById('third-person-price');
        if (thirdPerson) {
            thirdPersonElement.style.display = 'flex';
            thirdPersonPriceElement.style.display = 'flex';
        } else {
            thirdPersonElement.style.display = 'none';
            thirdPersonPriceElement.style.display = 'none';
        }
        
        // Рассчитываем итоговую цену
        let totalPrice = basePrice;
        if (thirdPerson) totalPrice += 1000;
        
        // Применяем правило "более 4 часов - оплата по тарифу суток"
        if (selectedBookingType === 'hourly' && selectedHours >= 4) {
            const dailyPrice = parseInt(selectedRoomOption.querySelector('.room-price').dataset.daily);
            totalPrice = dailyPrice;
            if (thirdPerson) totalPrice += 1000;
            
            document.getElementById('price-description').textContent = `4+ часов = сутки × ${dailyPrice.toLocaleString('ru-RU')}₽`;
            document.getElementById('base-price').textContent = `${dailyPrice.toLocaleString('ru-RU')}₽`;
        }
        
        document.getElementById('summary-total').textContent = `${totalPrice.toLocaleString('ru-RU')}₽`;
    }
    
    // Получение правильной формы слова "час"
    function getHourWord(hours) {
        const lastDigit = hours % 10;
        const lastTwoDigits = hours % 100;
        
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return 'часов';
        }
        
        if (lastDigit === 1) {
            return 'час';
        }
        
        if (lastDigit >= 2 && lastDigit <= 4) {
            return 'часа';
        }
        
        return 'часов';
    }
    
    // Отправка формы бронирования
    function submitBooking(e) {
        e.preventDefault();
        
        // Проверяем заполнение контактной информации
        const guestName = document.getElementById('guest-name').value;
        const guestPhone = document.getElementById('guest-phone').value;
        const guestEmail = document.getElementById('guest-email').value;
        
        if (!guestName || !guestPhone || !guestEmail) {
            showError('Пожалуйста, заполните все поля контактной информации');
            return;
        }
        
        // Формируем данные бронирования
        const bookingData = {
            hotel: selectedHotel === 'bulvar' ? 
                '"У Капитана" на Нагорном бульваре' : 
                '"У Капитана" на Севастопольском проспекте',
            roomType: selectedRoom,
            bookingType: selectedBookingType,
            hours: selectedBookingType === 'hourly' ? selectedHours : null,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            thirdPerson: thirdPerson,
            guestName: guestName,
            guestPhone: guestPhone,
            guestEmail: guestEmail,
            totalPrice: document.getElementById('summary-total').textContent
        };
        
        console.log('Данные бронирования:', bookingData);
        
        // Показываем сообщение об успешном бронировании
        alert('Бронирование успешно оформлено! Мы отправили подтверждение на вашу электронную почту.');
        
        // Сбрасываем форму
        resetBookingForm();
    }
    
    // Сброс формы бронирования
    function resetBookingForm() {
        bookingForm.reset();
        hotelOptions.forEach(opt => opt.classList.remove('selected'));
        bookingTypeOptions.forEach(opt => opt.classList.remove('active'));
        hoursOptions.forEach(opt => opt.classList.remove('active'));
        roomOptions.forEach(opt => opt.classList.remove('selected'));
        
        // Выбираем первый отель по умолчанию
        document.querySelector('.hotel-option[data-hotel="bulvar"]').classList.add('selected');
        selectedHotel = 'bulvar';
        
        // Сбрасываем остальные значения
        selectedBookingType = null;
        selectedHours = 1;
        selectedRoom = 'standard';
        thirdPerson = false;
        checkinDate = null;
        checkoutDate = null;
        checkinDateInput.value = '';
        checkoutDateInput.value = '';
        
        // Возвращаемся к первому шагу
        steps.forEach(step => step.classList.remove('active'));
        stepIndicators.forEach(step => step.classList.remove('active'));
        currentStep = 1;
        document.querySelector('.booking-step[data-step="1"]').classList.add('active');
        document.querySelector('.step-indicator[data-step="1"]').classList.add('active');
        updateProgressLine();
        prevBtn.disabled = true;
        
        // Обновляем календарь
        const today = new Date();
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
        renderCalendar(currentMonth, currentYear);
    }
    
    // Показ ошибки
    function showError(message) {
        // Здесь можно реализовать красивый вывод ошибок
        alert(message);
    }
}

// ==================== Индикатор навигации в шапке ====================
function initNavIndicator() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const navIndicator = document.querySelector('.nav-indicator');
    const btn = document.querySelector('.nav .btn');
    
    // Установка позиции индикатора
    function setIndicatorPosition(element) {
        const rect = element.getBoundingClientRect();
        const navRect = document.querySelector('.nav').getBoundingClientRect();
        
        navIndicator.style.width = `${rect.width}px`;
        navIndicator.style.height = `${rect.height}px`;
        navIndicator.style.left = `${rect.left - navRect.left}px`;
        navIndicator.style.top = `${rect.top - navRect.top}px`;
        navIndicator.style.opacity = '1';
    }
    
    // Инициализация для первого элемента
    if (navLinks.length > 0) {
        setIndicatorPosition(navLinks[0]);
    }
    
    // Обработчики для пунктов меню
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            setIndicatorPosition(link);
        });
        
        link.addEventListener('click', () => {
            setIndicatorPosition(link);
        });
    });
    
    // Скрытие индикатора при наведении на кнопку
    btn.addEventListener('mouseenter', () => {
        navIndicator.style.opacity = '0';
    });
    
    // Восстановление индикатора
    btn.addEventListener('mouseleave', () => {
        if (document.querySelector('.nav-links a:hover')) {
            setIndicatorPosition(document.querySelector('.nav-links a:hover'));
        } else {
            setIndicatorPosition(document.querySelector('.nav-links a:first-child'));
        }
    });
}

// ==================== Система частиц для hero-секции ====================
const initParticles = () => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 150;
    
    // Создание частиц
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: `hsla(${Math.random() * 60 + 180}, 100%, 70%, ${Math.random() * 0.5 + 0.1})`
        });
    }
    
    // Отслеживание позиции мыши
    const mouse = {
        x: null,
        y: null,
        radius: 100
    };
    
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Анимация частиц
    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            // Движение частиц
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Реакция на курсор мыши
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                p.x += Math.cos(angle) * force * 5;
                p.y += Math.sin(angle) * force * 5;
            }
            
            // Переход через границы
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            
            // Отрисовка частицы
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Соединение частиц линиями
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `hsla(180, 100%, 70%, ${0.1 * (1 - distance/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
};

// ==================== Магнитный эффект для кнопки ====================
const initMagneticEffect = () => {
    const btn = document.querySelector('.magnetic');
    if (!btn) return;
    
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (x - centerX) / centerX * 10;
        const angleY = (y - centerY) / centerY * 10;
        
        btn.style.transform = `perspective(1000px) rotateY(${angleX}deg) rotateX(${-angleY}deg) scale(1.05)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
    });
};

// ==================== Параллакс-эффект для фона ====================


// ==================== 3D сцена с использованием Three.js ====================
const initThreeJS = () => {
    // Проверка наличия контейнера
    const container = document.getElementById('webgl-container');
    if (!container) return;
    
    // Проверка поддержки WebGL
    if (typeof WEBGL === 'undefined' || !WEBGL.isWebGLAvailable()) {
        console.warn('WebGL не поддерживается');
        return;
    }
    
    // Создание сцены
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Загрузка 3D модели
    const loader = new THREE.GLTFLoader();
    loader.load('models/hostel.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        model.position.y = -1;
        scene.add(model);
        
        // Анимация вращения модели
        gsap.to(model.rotation, { 
            y: Math.PI * 2, 
            duration: 30, 
            repeat: -1, 
            ease: 'linear' 
        });
    }, undefined, (error) => {
        console.error('Ошибка загрузки модели:', error);
    });
    
    // Настройка освещения
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x00ffea, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Позиция камеры
    camera.position.z = 5;
    
    // Функция анимации
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };
    
    animate();
    
    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// ==================== Инициализация всех компонентов ====================
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация слайдера hero-секции
    initHeroSlider();
    
    // Инициализация индикатора навигации
    initNavIndicator();
    
    // Инициализация системы частиц
    initParticles();
    
    // Инициализация магнитного эффекта для кнопки
    initMagneticEffect();
    
    // Инициализация параллакс-эффекта
    initBookingSystem();
    
    // Инициализация 3D сцены
    initThreeJS();
    
    // Дополнительные анимации при скролле
    gsap.utils.toArray('.grid-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.2
        });
    });
    
    // Параллакс для галереи
    gsap.utils.toArray('.gallery-item').forEach(item => {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                scrub: true
            },
            y: (i) => i % 2 ? -50 : 50
        });
    });
    
    // Обработчик мобильного меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
});

// ==================== Дополнительные функции ====================
// Анимация для цен
function animatePrices() {
    gsap.to('.price', {
        scale: 1.1,
        duration: 0.5,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
    });
}

// Инициализация карты
function initMap() {
    // Код инициализации Яндекс.Карт
    ymaps.ready(init);
    
    function init() {
        // ...существующий код карты...
    }
}

function initNavIndicator() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const navIndicator = document.querySelector('.nav-indicator');
    const btn = document.querySelector('.nav .btn');
    
    // Устанавливаем начальную позицию
    function setIndicatorPosition(element) {
        const rect = element.getBoundingClientRect();
        const navRect = document.querySelector('.nav').getBoundingClientRect();
        
        navIndicator.style.width = `${rect.width}px`;
        navIndicator.style.height = `${rect.height}px`;
        navIndicator.style.left = `${rect.left - navRect.left}px`;
        navIndicator.style.top = `${rect.top - navRect.top}px`;
        navIndicator.style.opacity = '1';
    }
    
    // Инициализация для первого элемента
    if (navLinks.length > 0) {
        setIndicatorPosition(navLinks[0]);
    }
    
    // Обработчики для пунктов меню
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            setIndicatorPosition(link);
        });
        
        link.addEventListener('click', () => {
            setIndicatorPosition(link);
        });
    });
    
    // Скрываем индикатор при наведении на кнопку
    btn.addEventListener('mouseenter', () => {
        navIndicator.style.opacity = '0';
    });
    
    // Возвращаем индикатор при выходе из кнопки
    btn.addEventListener('mouseleave', () => {
        if (document.querySelector('.nav-links a:hover')) {
            setIndicatorPosition(document.querySelector('.nav-links a:hover'));
        } else {
            setIndicatorPosition(document.querySelector('.nav-links a:first-child'));
        }
    });
}

// Инициализируем при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initNavIndicator();
    // Остальной код инициализации...
});

function initGallery() {
    // Данные галереи
    const galleryData = {
        "bulvar": {
            name: "'У Капитана' на Нагорном бульваре",
            address: "г. Москва, Нагорный бульвар, д. 19, корпус 1",
            description: "Современный отель с комфортабельными номерами и высоким уровнем сервиса. Идеальное расположение в шаговой доступности от метро.",
            images: [
                'images/hotel1/1.JPG', 'images/hotel1/2.JPG', 'images/hotel1/3.JPG',
                'images/hotel1/4.JPG', 'images/hotel1/5.JPG', 'images/hotel1/6.JPG'
            ]
        },
        "sevastopol": {
            name: "Отель 'У Капитана' на Севастопольском проспекте",
            address: "г. Москва, Севастопольский пр-т, д. 28, корпус 8",
            description: "Элегантный отель с просторными номерами и панорамными видами. Удобная транспортная развязка и бесплатная парковка для гостей.",
            images: [
                'images/hotel2/1.JPG', 'images/hotel2/2.JPG', 'images/hotel2/3.JPG',
                'images/hotel2/4.JPG', 'images/hotel2/5.JPG', 'images/hotel2/6.JPG'
            ]
        }
    };

    // DOM элементы
    const tabs = document.querySelectorAll('.gallery-tab');
    const mainSlide = document.querySelector('.main-slide');
    const thumbnailsContainers = document.querySelectorAll('.thumbnails-grid');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const currentSlideEl = document.querySelector('.current-slide');
    const totalSlidesEl = document.querySelector('.total-slides');
    const hotelNameEl = document.querySelector('.hotel-name');
    const hotelAddressEl = document.querySelector('.hotel-address span');
    const hotelTextEl = document.querySelector('.hotel-text');

    // Состояние галереи
    let currentHotel = "bulvar";
    let currentImageIndex = 0;
    let currentImages = galleryData[currentHotel].images;
    
    // Инициализация миниатюр
    function initThumbnails() {
        thumbnailsContainers.forEach(container => {
            container.innerHTML = '';
            const hotel = container.dataset.hotel;
            
            galleryData[hotel].images.forEach((img, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'thumbnail';
                thumbnail.dataset.index = index;
                
                const imgElement = document.createElement('img');
                imgElement.src = img;
                imgElement.alt = `Фото отеля ${index + 1}`;
                imgElement.loading = 'lazy';
                
                thumbnail.appendChild(imgElement);
                container.appendChild(thumbnail);
                
                // Обработчик клика по миниатюре
                thumbnail.addEventListener('click', () => {
                    goToSlide(index);
                });
            });
        });
        
        // Установка общего количества слайдов
        totalSlidesEl.textContent = currentImages.length;
    }
    
    // Переключение между отелями
    function switchHotel(hotel) {
        currentHotel = hotel;
        currentImages = galleryData[hotel].images;
        currentImageIndex = 0;
        
        // Обновление активной вкладки
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.hotel === hotel);
        });
        
        // Показать соответствующие миниатюры
        thumbnailsContainers.forEach(container => {
            container.style.display = container.dataset.hotel === hotel ? 'grid' : 'none';
        });
        
        // Обновление информации об отеле
        hotelNameEl.textContent = galleryData[hotel].name;
        hotelAddressEl.textContent = galleryData[hotel].address;
        hotelTextEl.textContent = galleryData[hotel].description;
        
        // Обновление счетчика
        totalSlidesEl.textContent = currentImages.length;
        
        // Показать первое изображение
        goToSlide(0);
    }
    
    // Переход к определенному слайду
    function goToSlide(index) {
        // Проверка границ
        if (index < 0) index = currentImages.length - 1;
        if (index >= currentImages.length) index = 0;
        
        currentImageIndex = index;
        
        // Создаем новое изображение
        const newImage = document.createElement('img');
        newImage.src = currentImages[index];
        newImage.alt = `Фото отеля ${index + 1}`;
        newImage.classList.add('main-image');
        
        // Добавляем в контейнер
        mainSlide.appendChild(newImage);
        
        // Анимация перехода
        setTimeout(() => {
            newImage.style.opacity = '1';
            newImage.classList.add('active');
            
            // Удаляем старое активное изображение
            const oldImage = document.querySelector('.main-image:not(.active)');
            if (oldImage) {
                oldImage.style.opacity = '0';
                setTimeout(() => {
                    oldImage.remove();
                }, 500);
            }
            
            // Обновляем активную миниатюру
            updateActiveThumbnail();
            
            // Обновляем счетчик
            currentSlideEl.textContent = index + 1;
        }, 50);
    }
    
    // Обновление активной миниатюры
    function updateActiveThumbnail() {
        // Убираем активный класс у всех миниатюр текущего отеля
        document.querySelectorAll(`.thumbnails-grid[data-hotel="${currentHotel}"] .thumbnail`).forEach(thumb => {
            thumb.classList.remove('active');
        });
        
        // Добавляем активный класс к текущей миниатюре
        const activeThumb = document.querySelector(`.thumbnails-grid[data-hotel="${currentHotel}"] .thumbnail[data-index="${currentImageIndex}"]`);
        if (activeThumb) {
            activeThumb.classList.add('active');
        }
    }
    
    // Следующее изображение
    function nextSlide() {
        goToSlide(currentImageIndex + 1);
    }
    
    // Предыдущее изображение
    function prevSlide() {
        goToSlide(currentImageIndex - 1);
    }
    
    // Обработчики событий
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchHotel(tab.dataset.hotel);
        });
    });
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Инициализация
    initThumbnails();
    switchHotel(currentHotel);
    
    // Автопрокрутка
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Остановка автопрокрутки при наведении
    const galleryArea = document.querySelector('.gallery-content');
    galleryArea.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    galleryArea.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
}

document.addEventListener('DOMContentLoaded', initGallery);

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initGallery);

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('main-image')) {
        e.target.classList.toggle('zoomed');
    }
});

function initInteractiveFeatures() {
    // Анимация индикаторов
    const speedBar = document.querySelector('.speed-bar');
    const distanceBar = document.querySelector('.distance-bar');
    
    if (speedBar) {
        const speed = speedBar.dataset.speed;
        setTimeout(() => {
            speedBar.style.width = `${speed}%`;
        }, 300);
    }
    
    if (distanceBar) {
        const distance = distanceBar.dataset.distance;
        setTimeout(() => {
            distanceBar.style.width = `${distance * 10}%`;
        }, 300);
    }
    
    // Анимация звезд рейтинга
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
        const rating = parseFloat(starsContainer.dataset.rating);
        const stars = starsContainer.querySelectorAll('i');
        
        stars.forEach((star, index) => {
            if (rating >= index + 1) {
                star.style.opacity = '1';
            } else if (rating > index && rating < index + 1) {
                star.classList.remove('fa-star');
                star.classList.add('fa-star-half-alt');
                star.style.opacity = '1';
            }
        });
    }
    
    // Анимация кругового индикатора
    const gaugeCircle = document.querySelector('.gauge-circle');
    if (gaugeCircle) {
        const percent = parseInt(gaugeCircle.dataset.percent);
        gaugeCircle.style.background = `conic-gradient(#3b82f6 0deg, #1e3a8a ${percent}%, transparent ${percent}%)`;
    }
}

// Вызовите функцию при загрузке
document.addEventListener('DOMContentLoaded', initInteractiveFeatures);

// Добавим в конец файла script.js

// Инициализация интерактивных контактов
function initInteractiveContacts() {
    // Переключение между табами контактов
    const contactTabs = document.querySelectorAll('.contact-tab');
    const contactInfos = document.querySelectorAll('.contact-info');
    
    contactTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Убираем активный класс у всех табов и контента
            contactTabs.forEach(t => t.classList.remove('active'));
            contactInfos.forEach(info => info.classList.remove('active'));
            
            // Добавляем активный класс текущему табу и соответствующему контенту
            tab.classList.add('active');
            document.querySelector(`.contact-info[data-tab="${tabName}"]`).classList.add('active');
            
            // Обновляем карту (если нужно)
            updateMapMarker(tabName);
        });
    });
    
    // Управление картой через кнопки
    const mapControls = document.querySelectorAll('.map-control-btn');
    if (mapControls.length > 0) {
        mapControls.forEach(control => {
            control.addEventListener('click', () => {
                const hotel = control.dataset.hotel;
                
                // Обновляем активный таб
                contactTabs.forEach(t => t.classList.remove('active'));
                contactInfos.forEach(info => info.classList.remove('active'));
                
                document.querySelector(`.contact-tab[data-tab="${hotel}"]`).classList.add('active');
                document.querySelector(`.contact-info[data-tab="${hotel}"]`).classList.add('active');
                
                // Обновляем карту
                updateMapMarker(hotel);
            });
        });
    }
    
    // Обработка формы обратной связи
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Здесь должна быть логика отправки формы
            const formData = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                subject: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value
            };
            
            console.log('Форма отправлена:', formData);
            
            // Показываем сообщение об успешной отправке
            alert('Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.');
            
            // Сбрасываем форму
            contactForm.reset();
        });
    }
}

// Функция для обновления маркера на карте (заглушка)
function updateMapMarker(hotel) {
    console.log(`Активный отель: ${hotel}`);
    // Здесь должна быть логика обновления карты
    // В реальном проекте это будет взаимодействие с API Яндекс.Карт
}

// Добавляем инициализацию в DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // ... существующий код ...
    initInteractiveContacts();
});

// Обработчик мобильного меню
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileMenu = document.querySelector('.nav-mobile');
    
    if (!mobileMenuBtn || !mobileMenu) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Закрытие меню при клике на ссылку
    const mobileLinks = document.querySelectorAll('.nav-mobile-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

document.addEventListener('DOMContentLoaded', initMobileMenu);



// Инициализация сертификатов
function initCertificates() {
    const certificatePreviews = document.querySelectorAll('.certificate-preview');
    const certificateFulls = document.querySelectorAll('.certificate-full');
    const closeButtons = document.querySelectorAll('.close-certificate');
    
    // Обработчик для открытия сертификата
    certificatePreviews.forEach((preview, index) => {
        preview.addEventListener('click', () => {
            certificateFulls[index].classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Обработчик для закрытия сертификата
    closeButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            certificateFulls[index].classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Закрытие при клике вне изображения
    certificateFulls.forEach(full => {
        full.addEventListener('click', (e) => {
            if (e.target === full) {
                full.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            certificateFulls.forEach(full => {
                full.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}

// Добавьте вызов функции в DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initCertificates();
    // ... остальной код инициализации ...
});

// Обработчик мобильного меню
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.querySelector('.nav-mobile').classList.add('active');
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
});

document.querySelector('.close-menu-btn').addEventListener('click', function() {
    document.querySelector('.nav-mobile').classList.remove('active');
    document.body.style.overflow = ''; // Восстанавливаем прокрутку
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-mobile-links a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelector('.nav-mobile').classList.remove('active');
        document.body.style.overflow = '';
    });
});
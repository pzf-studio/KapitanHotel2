function checkAuth() {
    const token = localStorage.getItem('admin_token');
    if (!token && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// Обработчик входа
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Обработчик формы входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Здесь должна быть проверка логина/пароля
            // В демо-версии используем простую проверку
            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('admin_token', 'demo_token');
                window.location.href = 'admin.html';
            } else {
                alert('Неверный логин или пароль');
            }
        });
    }
    
    // Выход из системы
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('admin_token');
            window.location.href = 'login.html';
        });
    }
    
    // Переключение разделов в админке
    const navItems = document.querySelectorAll('.sidebar-nav li');
    const contentSections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            // Убираем активный класс у всех пунктов меню
            navItems.forEach(navItem => navItem.classList.remove('active'));
            // Добавляем активный класс текущему пункту
            this.classList.add('active');
            
            // Скрываем все секции контента
            contentSections.forEach(section => section.classList.remove('active'));
            // Показываем выбранную секцию
            document.getElementById(`${sectionId}-section`).classList.add('active');
            
            // Обновляем заголовок
            document.getElementById('content-title').textContent = this.textContent.trim();
        });
    });
    
    // Инициализация галереи
    initGalleryManager();
    
    // Инициализация управления акциями
    initPromotionsManager();
    
    // Инициализация управления ценами
    initPricesManager();
});

// Управление галереей
function initGalleryManager() {
    const hotelTabs = document.querySelectorAll('.hotel-tab');
    const imagesGrids = document.querySelectorAll('.images-grid');
    
    // Переключение между отелями
    hotelTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const hotel = this.getAttribute('data-hotel');
            
            hotelTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            imagesGrids.forEach(grid => grid.style.display = 'none');
            document.getElementById(`${hotel}-images`).style.display = 'grid';
        });
    });
    
    // Загрузка изображений (заглушка)
    const uploadBtn = document.querySelector('.btn-upload');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            const files = document.getElementById('gallery-images').files;
            const hotel = document.getElementById('gallery-hotel').value;
            
            if (files.length === 0) {
                alert('Выберите хотя бы одно изображение');
                return;
            }
            
            // Здесь должен быть код для загрузки на сервер
            alert(`Загружено ${files.length} изображений для отеля ${hotel}`);
            
            // Очищаем поле выбора файлов
            document.getElementById('gallery-images').value = '';
        });
    }
    
    // Загрузка существующих изображений (заглушка)
    loadGalleryImages();
}

function loadGalleryImages() {
    // В реальном проекте здесь будет запрос к серверу
    const demoImages = [
        'images/hero-bg1.JPG',
        'images/hero-bg2.JPG',
        'images/hero-bg3.JPG',
        'images/hero-bg4.JPG'
    ];
    
    const grids = {
        'bulvar': document.getElementById('bulvar-images'),
        'sevastopol': document.getElementById('sevastopol-images')
    };
    
    for (const hotel in grids) {
        demoImages.forEach((img, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            
            const imgElement = document.createElement('img');
            imgElement.src = img;
            imgElement.alt = `Фото отеля ${index + 1}`;
            
            const actions = document.createElement('div');
            actions.className = 'image-actions';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-action';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', () => {
                if (confirm('Удалить это фото?')) {
                    imageItem.remove();
                }
            });
            
            actions.appendChild(deleteBtn);
            imageItem.appendChild(imgElement);
            imageItem.appendChild(actions);
            grids[hotel].appendChild(imageItem);
        });
    }
}


function loadPromotions() {
    // В реальном проекте здесь будет запрос к серверу
    const demoPromotions = [
        {
            title: 'Долгосрочное проживание',
            description: 'Скидка 15% при бронировании от 7 дней',
            startDate: '2025-01-01',
            endDate: '2025-12-31'
        },
        {
            title: 'Раннее бронирование',
            description: 'Скидка 10% при бронировании за 30 дней',
            startDate: '2025-01-01',
            endDate: '2025-12-31'
        }
    ];
    
    const promotionsList = document.getElementById('promotions-list');
    if (!promotionsList) return;
    
    demoPromotions.forEach(promo => {
        const promotionId = Date.now();
        
        const promotionCard = document.createElement('div');
        promotionCard.className = 'promotion-card';
        promotionCard.innerHTML = `
            <div class="form-group">
                <label>Название акции</label>
                <input type="text" class="form-control" value="${promo.title}">
            </div>
            <div class="form-group">
                <label>Описание</label>
                <textarea class="form-control" rows="3">${promo.description}</textarea>
            </div>
            <div class="form-group">
                <label>Дата начала</label>
                <input type="date" class="form-control" value="${promo.startDate}">
            </div>
            <div class="form-group">
                <label>Дата окончания</label>
                <input type="date" class="form-control" value="${promo.endDate}">
            </div>
            <div class="promotion-actions">
                <button class="btn-save-promotion">Сохранить</button>
                <button class="btn-delete-promotion" data-id="${promotionId}">Удалить</button>
            </div>
        `;
        
        promotionsList.appendChild(promotionCard);
    });
}

// Управление ценами
function initPricesManager() {
    const saveBtn = document.querySelector('.btn-save-prices');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Здесь должен быть код для сохранения цен
            alert('Цены успешно сохранены');
        });
    }
}
function savePromotion(promotionId) {
    const promotionCard = document.querySelector(`.promotion-card[data-id="${promotionId}"]`);
    const title = promotionCard.querySelector('input[type="text"]').value;
    const description = promotionCard.querySelector('textarea').value;
    const startDate = promotionCard.querySelector('input[type="date"]:first-of-type').value;
    const endDate = promotionCard.querySelector('input[type="date"]:last-of-type').value;

    const data = {
        title,
        description,
        start_date: startDate,
        end_date: endDate
    };

    if (promotionId !== 'new') {
        data.id = promotionId;
    }

    fetch('promotions.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Акция сохранена!');
            loadPromotions(); // Обновляем список
        } else {
            alert('Ошибка: ' + (data.error || 'Неизвестная ошибка'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при сохранении акции');
    });
}

// Обновленная функция для удаления акции
function deletePromotion(promotionId) {
    if (!confirm('Вы уверены, что хотите удалить эту акцию?')) return;
    
    fetch('promotions.php', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${promotionId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.querySelector(`.promotion-card[data-id="${promotionId}"]`).remove();
            alert('Акция успешно удалена');
        } else {
            alert('Ошибка при удалении акции');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при удалении акции');
    });
}

// Функция для сохранения цен
function savePrices() {
    const prices = [];
    
    document.querySelectorAll('.price-table').forEach(table => {
        const hotel = table.querySelector('h3').textContent.includes('Нагорный') ? 'bulvar' : 'sevastopol';
        
        table.querySelectorAll('tbody tr').forEach(row => {
            const roomType = row.querySelector('td:first-child').textContent.trim().toLowerCase();
            const priceHour = row.querySelector('td:nth-child(2) input').value;
            const priceNight = row.querySelector('td:nth-child(3) input').value;
            const priceDay = row.querySelector('td:nth-child(4) input').value;
            
            prices.push({
                hotel,
                room_type: roomType,
                price_hour: priceHour,
                price_night: priceNight,
                price_day: priceDay
            });
        });
    });
    
    fetch('prices.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(prices)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Цены успешно сохранены');
        } else {
            alert('Ошибка при сохранении цен');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при сохранении цен');
    });
}

// Обновленная функция initPromotionsManager
function initPromotionsManager() {
    const addBtn = document.querySelector('.btn-add-promotion');
    const promotionsList = document.getElementById('promotions-list');
    
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            const promotionId = 'new_' + Date.now();
            
            const promotionCard = document.createElement('div');
            promotionCard.className = 'promotion-card';
            promotionCard.dataset.id = promotionId;
            promotionCard.innerHTML = `
                <div class="form-group">
                    <label>Название акции</label>
                    <input type="text" class="form-control" placeholder="Название" required>
                </div>
                <div class="form-group">
                    <label>Описание</label>
                    <textarea class="form-control" rows="3" placeholder="Описание" required></textarea>
                </div>
                <div class="form-group">
                    <label>Дата начала</label>
                    <input type="date" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Дата окончания</label>
                    <input type="date" class="form-control" required>
                </div>
                <div class="promotion-actions">
                    <button type="button" class="btn-save-promotion" onclick="savePromotion('${promotionId}')">Сохранить</button>
                    <button type="button" class="btn-delete-promotion" onclick="deletePromotion('${promotionId}')">Удалить</button>
                </div>
            `;
            
            promotionsList.appendChild(promotionCard);
        });
    }
    
    loadPromotions();
}

// Обновленная функция loadPromotions
function loadPromotions() {
    fetch('promotions.php')
        .then(response => response.json())
        .then(promotions => {
            const promotionsList = document.getElementById('promotions-list');
            if (!promotionsList) return;
            
            promotionsList.innerHTML = '';
            
            promotions.forEach(promo => {
                const promotionCard = document.createElement('div');
                promotionCard.className = 'promotion-card';
                promotionCard.dataset.id = promo.id;
                promotionCard.innerHTML = `
                    <div class="form-group">
                        <label>Название акции</label>
                        <input type="text" class="form-control" value="${promo.title}" required>
                    </div>
                    <div class="form-group">
                        <label>Описание</label>
                        <textarea class="form-control" rows="3" required>${promo.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Дата начала</label>
                        <input type="date" class="form-control" value="${promo.start_date}" required>
                    </div>
                    <div class="form-group">
                        <label>Дата окончания</label>
                        <input type="date" class="form-control" value="${promo.end_date}" required>
                    </div>
                    <div class="promotion-actions">
                        <button type="button" class="btn-save-promotion" onclick="savePromotion('${promo.id}')">Сохранить</button>
                        <button type="button" class="btn-delete-promotion" onclick="deletePromotion('${promo.id}')">Удалить</button>
                    </div>
                `;
                
                promotionsList.appendChild(promotionCard);
            });
        })
        .catch(error => {
            console.error('Error loading promotions:', error);
        });
}

// Обновленная функция initPricesManager
function initPricesManager() {
    const saveBtn = document.querySelector('.btn-save-prices');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', savePrices);
    }
    
    // Загрузка цен из базы данных
    fetch('prices.php')
        .then(response => response.json())
        .then(prices => {
            prices.forEach(price => {
                const hotel = price.hotel === 'bulvar' ? 
                    document.querySelector('.price-table:first-child') : 
                    document.querySelector('.price-table:last-child');
                
                if (hotel) {
                    const rows = hotel.querySelectorAll('tbody tr');
                    rows.forEach(row => {
                        const roomType = row.querySelector('td:first-child').textContent.trim().toLowerCase();
                        if (roomType === price.room_type) {
                            row.querySelector('td:nth-child(2) input').value = price.price_hour;
                            row.querySelector('td:nth-child(3) input').value = price.price_night;
                            row.querySelector('td:nth-child(4) input').value = price.price_day;
                        }
                    });
                }
            });
        })
        .catch(error => {
            console.error('Error loading prices:', error);
        });
}
// 页面加载完成后隐藏加载动画
window.addEventListener('DOMContentLoaded', () => {
    // 先获取所有需要加载的图片
    const images = document.querySelectorAll('img');
    let loadedImages = 0;

    // 检查是否所有图片都加载完成
    function checkAllImagesLoaded() {
        loadedImages++;
        if (loadedImages === images.length) {
            // 所有图片加载完成后，隐藏加载动画
            const loader = document.querySelector('.page-loader');
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }

    // 如果没有图片，直接隐藏加载动画
    if (images.length === 0) {
        const loader = document.querySelector('.page-loader');
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    } else {
        // 监听每个图片的加载完成事件
        images.forEach(img => {
            if (img.complete) {
                checkAllImagesLoaded();
            } else {
                img.addEventListener('load', checkAllImagesLoaded);
                img.addEventListener('error', checkAllImagesLoaded); // 处理图片加载失败的情况
            }
        });
    }
});

// 轮播图功能
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    
    // 更新指示器状态
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// 轮播图控制
document.querySelector('.next').addEventListener('click', () => showSlide(currentSlide + 1));
document.querySelector('.prev').addEventListener('click', () => showSlide(currentSlide - 1));

// 指示器点击事件
document.querySelectorAll('.indicator').forEach((indicator, index) => {
    indicator.addEventListener('click', () => showSlide(index));
});

// 自动轮播
setInterval(() => showSlide(currentSlide + 1), 5000);

// Tab切换功能
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // 更新按钮状态
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // 更新内容
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            pane.style.display = 'none';
        });
        const activePane = document.getElementById(tabId);
        activePane.classList.add('active');
        activePane.style.display = 'block';
        
        // 从数据库获取内容
        fetch(`get_content.php?type=${tabId}`)
            .then(response => response.json())
            .then(data => updateTabContent(tabId, data))
            .catch(error => console.error('Error:', error));
    });
});

function updateTabContent(tabId, data) {
    const container = document.getElementById(tabId);
    container.innerHTML = ''; // 清空现有内容
    
    data.forEach(item => {
        const element = document.createElement('div');
        
        switch(tabId) {
            case 'news':
                element.className = 'news-item';
                element.innerHTML = `
                    <div class="news-header">
                        <h3 class="news-title">${item.title}</h3>
                        <span class="news-date">${item.date}</span>
                    </div>
                    <div class="news-content">${item.content}</div>
                    <div class="news-footer">
                        <span class="news-tag">${item.category}</span>
                        <a href="#" class="read-more">阅读更多 <i class="fas fa-arrow-right"></i></a>
                    </div>
                `;
                break;
                
            case 'rankings':
                element.className = 'rank-item';
                element.innerHTML = `
                    <div class="rank">#${item.rank}</div>
                    <div class="rank-info">
                        <div class="name">${item.name}</div>
                        <div class="school">${item.school}</div>
                    </div>
                    <div class="score">${item.score}分</div>
                `;
                break;
                
            case 'resources':
                element.className = 'resource-item';
                element.innerHTML = `
                    <div class="resource-icon">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <div class="resource-info">
                        <h4 class="resource-title">${item.title}</h4>
                        <p class="resource-desc">${item.description}</p>
                        <div class="resource-meta">
                            <span class="upload-date">上传时间：${item.upload_date}</span>
                            <a href="${item.file_path}" class="download-btn">
                                <i class="fas fa-download"></i>下载
                            </a>
                        </div>
                    </div>
                `;
                break;
                
            case 'experience':
                element.className = 'experience-item';
                element.innerHTML = `
                    <div class="author-info">
                        <img src="${item.avatar}" alt="${item.author}" class="author-avatar">
                        <div>
                            <div class="author-name">${item.author}</div>
                            <div class="post-date">${item.date}</div>
                        </div>
                    </div>
                    <div class="experience-content">${item.content}</div>
                    <div class="experience-footer">
                        <div class="stats">
                            <span class="stat-item"><i class="far fa-heart"></i>${item.likes}</span>
                            <span class="stat-item"><i class="far fa-comment"></i>${item.comments}</span>
                            <span class="stat-item"><i class="far fa-eye"></i>${item.views}</span>
                        </div>
                        <a href="#" class="read-more">查看全文 <i class="fas fa-angle-right"></i></a>
                    </div>
                `;
                break;
        }
        
        container.appendChild(element);
    });
}

// 初始化：加载第一个标签页的内容
document.querySelector('.tab-btn.active').click();

// 倒计时功能
function updateCountdown() {
    const competitionDate = new Date('2024-06-01T00:00:00').getTime();
    const now = new Date().getTime();
    const distance = competitionDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// 在页面加载事件之后添加超时处理
setTimeout(() => {
    const loader = document.querySelector('.page-loader');
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}, 5000); // 5秒后强制隐藏加载动画
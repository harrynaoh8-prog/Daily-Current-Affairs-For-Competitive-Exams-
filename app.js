const dateListEl = document.getElementById('date-list');
const contentArea = document.getElementById('content-area');
const displayDateEl = document.getElementById('current-display-date');

function init() {
    generateDateSidebar();
    const today = new Date().toISOString().split('T')[0];
    loadNewsByDate(today);
}

function generateDateSidebar() {
    for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        const dateDiv = document.createElement('div');
        dateDiv.className = `date-item ${i === 0 ? 'active' : ''}`;
        dateDiv.innerHTML = `<i class="far fa-calendar"></i> ${formatFriendlyDate(dateStr)}`;
        dateDiv.onclick = (e) => {
            document.querySelectorAll('.date-item').forEach(el => el.classList.remove('active'));
            dateDiv.classList.add('active');
            loadNewsByDate(dateStr);
        };
        dateListEl.appendChild(dateDiv);
    }
}

function loadNewsByDate(dateStr) {
    displayDateEl.innerText = formatFriendlyDate(dateStr);
    const filteredNews = news_database.filter(item => item.date === dateStr);
    renderNews(filteredNews);
}

function renderNews(newsArray) {
    if (newsArray.length === 0) {
        contentArea.innerHTML = `<div class="news-card"><h2>No news recorded for this day.</h2></div>`;
        return;
    }

    // Group by Category
    const categories = [...new Set(newsArray.map(n => n.category))];
    contentArea.innerHTML = categories.map(cat => `
        <div class="category-block">
            <span class="cat-title">${cat}</span>
            ${newsArray.filter(n => n.category === cat).map(news => `
                <article class="news-card">
                    <h2>${news.title}</h2>
                    <p>${news.content}</p>
                    <div class="tags">
                        ${news.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                </article>
            `).join('')}
        </div>
    `).join('');
}

function formatFriendlyDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
}

function searchNews() {
    const term = document.getElementById('news-search').value.toLowerCase();
    const filtered = news_database.filter(n => 
        n.title.toLowerCase().includes(term) || 
        n.content.toLowerCase().includes(term)
    );
    renderNews(filtered);
}

init();

// Variáveis globais para gráficos (para destruir antes de recriar)
let followerGrowthChart, genderChart, ageChart, engagementChart, bestTimeChart, reelsChart, competitorChart;

// Gerador de dados mock baseado em um username (fixo por simplicidade, mas pode ser hash)
function generateMockData(username) {
  // Normaliza o nome
  const user = username.replace('@', '').replace(/^https:\/\/(www\.)?instagram\.com\//, '').trim();
  // Dados simulados variáveis
  const followers = 12500 + (user.length * 310);
  const growthRate = 3.2 + (user.charCodeAt(0) % 10) / 5;
  const engagementRate = 4.7 + (user.charCodeAt(1) % 10) / 3;
  const reach = Math.round(followers * (2.1 + Math.random()));
  const impressions = Math.round(reach * 2.4);
  const totalReelsViews = Math.round(followers * (5 + Math.random() * 3));
  const storiesCompletion = 87 - (user.length % 10);
  const topPosts = [
    { type: 'Reel', views: 183000, likes: 12400, comments: 560, shares: 840 },
    { type: 'Carrossel', likes: 9600, comments: 430, shares: 380 },
    { type: 'Reel', views: 97500, likes: 8100, comments: 320, shares: 500 },
    { type: 'Imagem', likes: 7200, comments: 280, shares: 210 },
    { type: 'Reel', views: 64500, likes: 5300, comments: 190, shares: 280 }
  ];

  return {
    username: user,
    followers,
    growthRate,
    engagementRate,
    reach,
    impressions,
    totalReelsViews,
    storiesCompletion,
    topPosts,
    demographics: {
      gender: { male: 48, female: 51, other: 1 },
      age: { '13-17': 6, '18-24': 32, '25-34': 38, '35-44': 16, '45+': 8 }
    },
    followerGrowthHistory: [9800, 10400, 10700, 11100, 11500, followers],
    engagementHistory: [4.1, 3.9, 4.5, 4.3, 4.8, engagementRate],
    bestTimes: {
      days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      heatmap: [ [10,12], [14,16], [16,18], [10,11], [18,20], [8,9], [9,10] ] // hora pico por dia
    },
    trendingHashtags: ['#tendencia2025', '#crescimentoorganico', '#instareels', '#criadoresdeconteudo', '#marketingdigital'],
    trendingAudios: [
      { name: 'Som original – criador x', type: 'Música' },
      { name: 'Efeito viral – transição de rosto', type: 'Áudio' },
      { name: 'Trend “antes e depois” com IA', type: 'Formato' }
    ],
    competitors: [
      { name: 'concorrente_a', followers: 14200, engagement: 3.8 },
      { name: 'concorrente_b', followers: 8700, engagement: 5.2 }
    ]
  };
}

// Destroi gráficos existentes
function destroyCharts() {
  [followerGrowthChart, genderChart, ageChart, engagementChart, bestTimeChart, reelsChart, competitorChart].forEach(chart => {
    if (chart) chart.destroy();
  });
}

// Cria os cartões de métricas
function renderOverviewCards(data) {
  const container = document.getElementById('overviewCards');
  const growthClass = data.growthRate > 2 ? 'positive' : 'negative';
  container.innerHTML = `
    <div class="metric-card">
      <i class="fas fa-user-friends"></i>
      <div class="metric-value">${data.followers.toLocaleString()}</div>
      <div class="metric-label">Seguidores</div>
      <div class="metric-sub ${growthClass}">↑ ${data.growthRate}% este mês</div>
    </div>
    <div class="metric-card">
      <i class="fas fa-eye"></i>
      <div class="metric-value">${(data.impressions/1000).toFixed(1)}k</div>
      <div class="metric-label">Impressões (30d)</div>
      <div class="metric-sub positive">Alcance: ${(data.reach/1000).toFixed(1)}k</div>
    </div>
    <div class="metric-card">
      <i class="fas fa-heart"></i>
      <div class="metric-value">${data.engagementRate.toFixed(1)}%</div>
      <div class="metric-label">Taxa de engajamento</div>
      <div class="metric-sub">Acima da média do setor</div>
    </div>
    <div class="metric-card">
      <i class="fas fa-play-circle"></i>
      <div class="metric-value">${(data.totalReelsViews/1000).toFixed(1)}k</div>
      <div class="metric-label">Visualizações de Reels</div>
      <div class="metric-sub">Stories: ${data.storiesCompletion}% conclusão</div>
    </div>
  `;
}

// Gráfico de crescimento de seguidores
function renderFollowerChart(data) {
  const ctx = document.getElementById('followerGrowthChart').getContext('2d');
  followerGrowthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [{
        label: 'Seguidores',
        data: data.followerGrowthHistory,
        borderColor: '#dc2743',
        backgroundColor: 'rgba(220,39,67,0.1)',
        tension: 0.4,
        fill: true
      }]
    }
  });
}

// Gênero
function renderGenderChart(data) {
  const ctx = document.getElementById('genderChart').getContext('2d');
  genderChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Homens', 'Mulheres', 'Outros'],
      datasets: [{
        data: [data.demographics.gender.male, data.demographics.gender.female, data.demographics.gender.other],
        backgroundColor: ['#405de6', '#e1306c', '#fccc63']
      }]
    }
  });
}

// Faixa etária
function renderAgeChart(data) {
  const ctx = document.getElementById('ageChart').getContext('2d');
  ageChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(data.demographics.age),
      datasets: [{
        label: '% do público',
        data: Object.values(data.demographics.age),
        backgroundColor: '#5851db'
      }]
    }
  });
}

// Engajamento
function renderEngagementChart(data) {
  const ctx = document.getElementById('engagementChart').getContext('2d');
  engagementChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Sem1', 'Sem2', 'Sem3', 'Sem4', 'Sem5', 'Sem6'],
      datasets: [{
        label: 'Taxa (%)',
        data: data.engagementHistory,
        borderColor: '#f09433',
        backgroundColor: 'rgba(240,148,51,0.2)',
        tension: 0.2,
        fill: true
      }]
    }
  });
}

// Melhores horários (heatmap simplificado em barras)
function renderBestTimeChart(data) {
  const ctx = document.getElementById('bestTimeChart').getContext('2d');
  const hours = data.bestTimes.heatmap.map(arr => arr[0] + 'h-' + arr[1] + 'h');
  bestTimeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.bestTimes.days,
      datasets: [{
        label: 'Pico de atividade (horário)',
        data: data.bestTimes.heatmap.map(arr => arr[0]),
        backgroundColor: '#bc1888'
      }]
    },
    options: {
      scales: { y: { beginAtZero: true, max: 24 } }
    }
  });
}

// Top posts table
function renderTopPosts(data) {
  const container = document.getElementById('topPostsTable');
  let html = `<table><thead><tr><th>Tipo</th><th>Métrica principal</th><th>Curtidas</th><th>Coment.</th><th>Compart.</th></tr></thead><tbody>`;
  data.topPosts.forEach(post => {
    html += `<tr>
      <td>${post.type}</td>
      <td>${post.views ? post.views.toLocaleString() + ' visualizações' : '-'}</td>
      <td>${post.likes.toLocaleString()}</td>
      <td>${post.comments}</td>
      <td>${post.shares}</td>
    </tr>`;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}

// Reels chart
function renderReelsChart(data) {
  const ctx = document.getElementById('reelsChart').getContext('2d');
  const reelsData = data.topPosts.filter(p => p.type === 'Reel').map(p => p.views);
  reelsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Reel 1', 'Reel 2', 'Reel 3'],
      datasets: [{
        label: 'Visualizações',
        data: reelsData,
        backgroundColor: '#cc2366'
      }]
    }
  });
}

// Hashtags e áudios
function renderTrends(data) {
  const cloud = document.getElementById('trendingHashtags');
  cloud.innerHTML = data.trendingHashtags.map(h => `<span class="hashtag-badge">${h}</span>`).join('');

  const audioList = document.getElementById('trendingAudios');
  audioList.innerHTML = data.trendingAudios.map(a => 
    `<li>${a.name} <span>${a.type}</span></li>`
  ).join('');
}

// Gráfico de concorrentes (simulado)
function renderCompetitorChart(competitors) {
  const ctx = document.getElementById('competitorChart').getContext('2d');
  competitorChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: competitors.map(c => c.name),
      datasets: [
        { label: 'Seguidores (mil)', data: competitors.map(c => c.followers/1000), backgroundColor: '#405de6' },
        { label: 'Engajamento (%)', data: competitors.map(c => c.engagement), backgroundColor: '#e1306c' }
      ]
    }
  });
}

// Adiciona concorrente
function addCompetitor(name, data) {
  if (!name) return;
  name = name.replace('@', '').trim();
  // Gera dados aleatórios
  const newComp = {
    name: name,
    followers: 5000 + Math.floor(Math.random() * 15000),
    engagement: 2.5 + Math.random() * 5
  };
  data.competitors.push(newComp);
  renderCompetitorChart(data.competitors);
}

// Inicia análise
async function analyzeProfile(username) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = '';
  if (!username.trim()) {
    errorDiv.textContent = 'Por favor, insira um @usuário ou link válido.';
    return;
  }

  document.getElementById('loading').classList.remove('hidden');
  document.getElementById('dashboard').classList.add('hidden');

  // Simula tempo de processamento
  await new Promise(resolve => setTimeout(resolve, 1200));

  const data = generateMockData(username);
  destroyCharts();
  renderOverviewCards(data);
  renderFollowerChart(data);
  renderGenderChart(data);
  renderAgeChart(data);
  renderEngagementChart(data);
  renderBestTimeChart(data);
  renderTopPosts(data);
  renderReelsChart(data);
  renderTrends(data);
  renderCompetitorChart(data.competitors);

  document.getElementById('loading').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');

  // Atualiza campo do concorrente com os competidores existentes
  document.getElementById('competitorInput').dataset.competitors = JSON.stringify(data.competitors);
}

// Event Listeners
document.getElementById('searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('usernameInput').value;
  analyzeProfile(username);
});

document.getElementById('addCompetitorBtn').addEventListener('click', () => {
  const input = document.getElementById('competitorInput');
  const compName = input.value;
  if (compName) {
    const dashboard = document.getElementById('dashboard');
    if (!dashboard.classList.contains('hidden')) {
      // Recupera os dados mockados atuais (a partir do dataset)
      const comps = JSON.parse(input.dataset.competitors || '[]');
      addCompetitor(compName, { competitors: comps });
      input.dataset.competitors = JSON.stringify(comps);
      input.value = '';
    }
  }
});

// Tema escuro
const toggle = document.getElementById('themeToggle');
toggle.addEventListener('click', () => {
  document.body.dataset.theme = document.body.dataset.theme === 'dark' ? '' : 'dark';
});

// Exemplo inicial: analisar um perfil padrão ao carregar (opcional)
// analyzeProfile('@instagram');

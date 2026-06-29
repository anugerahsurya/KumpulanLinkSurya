<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { siteConfig, categories, links as initialLinks, mockVisitors } from './portal.config.js'

// Reactify links array from config
const links = ref(initialLinks)

// Local storage state for tracking clicks
const clickCounts = ref({})

// Search and Filter variables
const searchQuery = ref('')
const activeTab = ref('all')

// Theme state (from config, default theme)
const isDarkMode = ref(siteConfig.defaultTheme !== 'light')

// Toast state
const toastShow = ref(false)
const toastText = ref('')
let toastTimer = null

// Clock and Greetings state
const timeString = ref('00:00:00')
const dateString = ref('')
const greeting = ref('Selamat Datang')

// Visitor state
const showVisitorModal = ref(false)
const visitorName = ref('')
const visitorLog = ref([])
const pageViews = ref(1)

// Update digital clock and greeting
const updateDateTime = () => {
  const now = new Date()
  
  // Format Time (HH:MM:SS)
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  timeString.value = `${hh}:${mm}:${ss}`
  
  // Format Date (Indonesian format)
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  
  const dayName = days[now.getDay()]
  const dateNum = now.getDate()
  const monthName = months[now.getMonth()]
  const year = now.getFullYear()
  dateString.value = `${dayName}, ${dateNum} ${monthName} ${year}`
  
  // Determine Greeting based on hours
  const hours = now.getHours()
  if (hours >= 5 && hours < 11) {
    greeting.value = 'Selamat Pagi 🌅'
  } else if (hours >= 11 && hours < 15) {
    greeting.value = 'Selamat Siang ☀️'
  } else if (hours >= 15 && hours < 18) {
    greeting.value = 'Selamat Sore 🌇'
  } else {
    greeting.value = 'Selamat Malam 🌙'
  }
}

// Toggle light/dark theme
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('light-theme', !isDarkMode.value)
  localStorage.setItem('bps_theme', isDarkMode.value ? 'dark' : 'light')
}

// Handle click counts & launch link
const visitLink = (link) => {
  if (siteConfig.enableClickTracking) {
    // Update click count in local state & localStorage
    clickCounts.value[link.name] = (clickCounts.value[link.name] || 0) + 1
    localStorage.setItem('bps_link_clicks', JSON.stringify(clickCounts.value))
  }
  
  // Trigger toast notification
  if (toastTimer) clearTimeout(toastTimer)
  toastText.value = `Mengalihkan ke ${link.name}...`
  toastShow.value = true
  toastTimer = setTimeout(() => {
    toastShow.value = false
  }, 2500)
}

// Add new visitor check-in
const addVisitor = () => {
  if (visitorName.value.trim() === '') return
  
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const timeStr = `Hari ini, ${hours}:${minutes}`
  
  const newEntry = {
    name: visitorName.value.trim(),
    time: timeStr,
    isMock: false
  }
  
  visitorLog.value.unshift(newEntry)
  localStorage.setItem('bps_visitor_log', JSON.stringify(visitorLog.value))
  
  // Show toast notification
  if (toastTimer) clearTimeout(toastTimer)
  toastText.value = `Terima kasih, ${newEntry.name}! Check-in berhasil.`
  toastShow.value = true
  toastTimer = setTimeout(() => {
    toastShow.value = false
  }, 3000)
  
  // Clear input
  visitorName.value = ''
}

// Reset search input
const resetSearch = () => {
  searchQuery.value = ''
  activeTab.value = 'all'
}

// Get click count for a link name
const getClickCount = (name) => {
  return clickCounts.value[name] || 0
}

// Computed total visits
const totalVisits = computed(() => {
  return Object.values(clickCounts.value).reduce((acc, curr) => acc + curr, 0)
})

// Filtered Links computed property
const filteredLinks = computed(() => {
  let result = links.value
  
  // Filter by category tab selection
  if (activeTab.value !== 'all') {
    result = result.filter(link => link.category === activeTab.value)
  }
  
  // Filter by search query
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(link => 
      link.name.toLowerCase().includes(query) || 
      link.description.toLowerCase().includes(query) ||
      (link.tag && link.tag.toLowerCase().includes(query))
    )
  }
  
  return result
})

// Check if a category has active links under current search/tab filter
const getLinksByCategory = (categoryId) => {
  return filteredLinks.value.filter(link => link.category === categoryId)
}

// Lifecycle Hooks
onMounted(() => {
  // Initialize Date/Clock updates
  updateDateTime()
  const timer = setInterval(updateDateTime, 1000)
  onUnmounted(() => clearInterval(timer))
  
  // Load saved click counts from localStorage
  if (siteConfig.enableClickTracking) {
    const savedClicks = localStorage.getItem('bps_link_clicks')
    if (savedClicks) {
      try {
        clickCounts.value = JSON.parse(savedClicks)
      } catch (e) {
        clickCounts.value = {}
      }
    }
  }
  
  // Load saved theme or system preference
  const savedTheme = localStorage.getItem('bps_theme')
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
  
  if (savedTheme) {
    const lightModeActive = savedTheme === 'light'
    isDarkMode.value = !lightModeActive
    document.documentElement.classList.toggle('light-theme', lightModeActive)
  } else {
    const shouldUseLight = siteConfig.defaultTheme === 'light' || prefersLight
    isDarkMode.value = !shouldUseLight
    document.documentElement.classList.toggle('light-theme', shouldUseLight)
  }

  // Load Visitor Log from localStorage
  const savedVisitors = localStorage.getItem('bps_visitor_log')
  if (savedVisitors) {
    try {
      visitorLog.value = JSON.parse(savedVisitors)
    } catch (e) {
      visitorLog.value = [...mockVisitors]
    }
  } else {
    // Initialize with mock visitors from config
    visitorLog.value = [...mockVisitors]
    localStorage.setItem('bps_visitor_log', JSON.stringify(visitorLog.value))
  }

  // Load and increment Page Views
  const savedViews = localStorage.getItem('bps_page_views')
  const views = savedViews ? parseInt(savedViews, 10) + 1 : 1
  pageViews.value = views
  localStorage.setItem('bps_page_views', String(views))
})
</script>

<template>
  <div class="bg-blobs">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    <div class="bg-blob blob-3"></div>
  </div>

  <div class="app-container">
    <!-- Header Welcome & Profile Dashboard -->
    <header class="dashboard-header glass-panel fade-in stagger-1">
      <div class="profile-section">
        <div class="profile-avatar pulse-glow">
          {{ siteConfig.avatarInitials }}
        </div>
        <div class="profile-info">
          <span class="greeting-text">{{ greeting }}</span>
          <h1 class="profile-name">{{ siteConfig.ownerName }}</h1>
          <p class="stat-item" style="margin-top: 4px; font-size: 0.85rem; color: var(--text-secondary);">
            {{ siteConfig.subTitle }}
          </p>
        </div>
      </div>
      
      <div class="clock-weather-section">
        <div class="digital-clock">{{ timeString }}</div>
        <div class="current-date">{{ dateString }}</div>
      </div>
    </header>

    <!-- Filters, Search & Controls Bar -->
    <section class="controls-bar fade-in stagger-2">
      <!-- Search Input -->
      <div class="search-wrapper">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari link, deskripsi, atau tag..." 
          class="search-input"
        />
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      <!-- Quick Category Filter Tabs -->
      <div class="filter-tabs">
        <button 
          @click="activeTab = 'all'" 
          :class="['filter-tab', { active: activeTab === 'all' }]"
        >
          Semua Link
        </button>
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          @click="activeTab = cat.id"
          :class="['filter-tab', { active: activeTab === cat.id }]"
        >
          {{ cat.name.split(' ')[0] }}
        </button>
      </div>

      <!-- General Statistics & Theme Toggle -->
      <div class="quick-stats">
        <div class="stat-item">
          Total Link: <span>{{ links.length }}</span>
        </div>
        <div class="stat-item" v-if="siteConfig.enableClickTracking && totalVisits > 0">
          Kunjungan: <span>{{ totalVisits }} kali</span>
        </div>
        <button 
          v-if="siteConfig.enableThemeToggle"
          @click="toggleTheme" 
          class="theme-toggle-btn"
          title="Ganti Tema"
        >
          <!-- Sun Icon for Light Mode -->
          <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <!-- Moon Icon for Dark Mode -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </section>

    <!-- Main Content Links Grid -->
    <main class="categories-container fade-in stagger-3">
      <!-- Loop through active categories -->
      <section 
        v-for="cat in categories" 
        :key="cat.id" 
        v-show="getLinksByCategory(cat.id).length > 0"
        class="category-section"
      >
        <!-- Category Title Bar -->
        <div class="category-title-bar">
          <div class="category-info">
            <div class="category-icon-wrapper">
              <!-- Category SVG Icon -->
              <svg v-if="cat.icon === 'activity'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <svg v-else-if="cat.icon === 'terminal'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
              </svg>
              <svg v-else-if="cat.icon === 'database'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
                <path d="M3 12A9 3 0 0 0 21 12"></path>
              </svg>
            </div>
            <h2 class="category-title">{{ cat.name }}</h2>
          </div>
          <span class="category-count">
            {{ getLinksByCategory(cat.id).length }} Link
          </span>
        </div>

        <!-- Links Grid -->
        <div class="links-grid">
          <a 
            v-for="link in getLinksByCategory(cat.id)" 
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="link-card glass-panel"
            :style="`--brand-color-rgb: ${link.colorRgb || '59, 130, 246'}`"
            @click="visitLink(link)"
          >
            <!-- Card Header: Brand Icon & Outbound Arrow -->
            <div class="card-header">
              <div class="brand-icon-container" :style="`background-color: ${link.color || '#3b82f6'}`">
                <!-- Inline Conditional SVGs for Brand Icons -->
                <!-- Activity -->
                <svg v-if="link.icon === 'activity'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                </svg>
                <!-- Chart -->
                <svg v-else-if="link.icon === 'chart'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 3v18h18"></path>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
                </svg>
                <!-- Shield / Lock -->
                <svg v-else-if="link.icon === 'shield'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="m9 11 2 2 4-4"></path>
                </svg>
                <!-- Github -->
                <svg v-else-if="link.icon === 'github'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
                <!-- Vercel -->
                <svg v-else-if="link.icon === 'vercel'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m12 3 10 17H2L12 3z" fill="currentColor"></path>
                </svg>
                <!-- Star -->
                <svg v-else-if="link.icon === 'star'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <!-- Users -->
                <svg v-else-if="link.icon === 'users'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <!-- Education -->
                <svg v-else-if="link.icon === 'education'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                </svg>
                <!-- Check Square / Survey -->
                <svg v-else-if="link.icon === 'check-square'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <polyline points="9 11 12 14 22 4"></polyline>
                </svg>
                <!-- Mail -->
                <svg v-else-if="link.icon === 'mail'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <!-- Briefcase -->
                <svg v-else-if="link.icon === 'briefcase'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <!-- Map Pin -->
                <svg v-else-if="link.icon === 'map-pin'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <!-- Globe / Default -->
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  <path d="M2 12h20"></path>
                </svg>
              </div>

              <!-- Outbound Link Arrow -->
              <svg class="open-link-indicator" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </div>

            <!-- Card Body: Title & Desc -->
            <div class="card-body">
              <h3 class="link-title">{{ link.name }}</h3>
              <p class="link-desc">{{ link.description }}</p>
            </div>

            <!-- Card Footer: Tag & Visit Counter -->
            <div class="card-footer">
              <span class="tag-badge" v-if="link.tag">{{ link.tag }}</span>
              <span class="visit-counter" v-show="siteConfig.enableClickTracking && getClickCount(link.name) > 0">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                {{ getClickCount(link.name) }}x
              </span>
            </div>
          </a>
        </div>
      </section>

      <!-- Empty State under filters/search -->
      <div v-show="filteredLinks.length === 0" class="empty-state glass-panel">
        <svg class="empty-state-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <h3 class="empty-state-title">Link tidak ditemukan</h3>
        <p class="empty-state-desc">Tidak ada hasil yang cocok dengan kata pencarian atau kategori saat ini. Coba kata kunci lain.</p>
        <button @click="resetSearch" class="reset-search-btn">Reset Pencarian</button>
      </div>
    </main>

    <!-- Floating Action Button (FAB) for Visitor Book -->
    <button 
      @click="showVisitorModal = true" 
      class="visitor-fab pulse-glow"
      title="Lihat Pengunjung"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      <span class="fab-badge" v-if="visitorLog.length > 0">{{ visitorLog.length }}</span>
    </button>

    <!-- Visitor Log Modal -->
    <Transition name="modal-fade">
      <div v-if="showVisitorModal" class="modal-overlay" @click.self="showVisitorModal = false">
        <div class="modal-box glass-panel">
          <!-- Modal Header -->
          <div class="modal-header-box">
            <div class="modal-title-section">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <h3>Buku Tamu & Pengunjung</h3>
            </div>
            <button @click="showVisitorModal = false" class="modal-close-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body-content">
            <!-- Page Statistics -->
            <div class="modal-stats-grid">
              <div class="modal-stat-card">
                <span class="modal-stat-val">{{ pageViews }}</span>
                <span class="modal-stat-lbl">Hits Halaman</span>
              </div>
              <div class="modal-stat-card">
                <span class="modal-stat-val">{{ visitorLog.length }}</span>
                <span class="modal-stat-lbl">Check-In Terdaftar</span>
              </div>
            </div>

            <!-- Add Check-in Form -->
            <form @submit.prevent="addVisitor" class="checkin-form">
              <label class="form-label">Tinggalkan Jejak Kunjungan Anda:</label>
              <div class="input-group-checkin">
                <input 
                  v-model="visitorName" 
                  type="text" 
                  placeholder="Masukkan nama Anda..." 
                  maxlength="40"
                  required
                  class="checkin-input"
                />
                <button type="submit" class="checkin-btn">
                  Check-in
                </button>
              </div>
            </form>

            <!-- Visitor List -->
            <div class="visitor-list-title">Riwayat Pengunjung Terkini</div>
            <div class="visitor-list-wrapper">
              <div v-for="(v, index) in visitorLog" :key="index" class="visitor-item">
                <div class="visitor-avatar" :style="`background: hsl(${(index * 75) % 360}, 65%, 55%)`">
                  {{ v.name.substring(0, 2).toUpperCase() }}
                </div>
                <div class="visitor-info-detail">
                  <span class="visitor-name-lbl">{{ v.name }}</span>
                  <span class="visitor-time-lbl">{{ v.time }}</span>
                </div>
                <span class="visitor-tag-mock" v-if="v.isMock">Histori</span>
                <span class="visitor-tag-live" v-else>Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification Popup -->
    <div :class="['toast-notification', { show: toastShow }]">
      <svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span class="toast-text">{{ toastText }}</span>
    </div>

    <!-- Footer Copyright -->
    <footer class="app-footer">
      <div class="footer-credits">{{ siteConfig.ownerName }} &copy; 2026</div>
      <div>{{ siteConfig.footerText }}</div>
    </footer>
  </div>
</template>

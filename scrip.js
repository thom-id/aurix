/**
 * ============================================
 * BLAZETOPIA - Complete JavaScript
 * Theme: Dark Red / Fire
 * ============================================
 */

// ============================================
// SHOP DATA
// ============================================

const shopItems = [
    // Limited Items
    {
        id: 1,
        name: 'Dragon Wings',
        icon: '🐉',
        price: 250,
        priceType: 'gems',
        category: 'limited',
        badge: '⭐ Limited',
        badgeClass: 'badge-limited',
        stock: 10,
        sold: 0
    },
    {
        id: 2,
        name: 'Phoenix Helm',
        icon: '🔥',
        price: 180,
        priceType: 'gems',
        category: 'limited',
        badge: '⭐ Limited',
        badgeClass: 'badge-limited',
        stock: 15,
        sold: 0
    },
    {
        id: 7,
        name: 'Shadow Cloak',
        icon: '🌙',
        price: 4,
        priceType: 'wl',
        category: 'limited',
        badge: '⭐ Limited',
        badgeClass: 'badge-limited',
        stock: 8,
        sold: 0
    },
    // Event Items
    {
        id: 3,
        name: 'Golden Fishing Rod',
        icon: '🎣',
        price: 3,
        priceType: 'wl',
        category: 'event',
        badge: '🎉 Event',
        badgeClass: 'badge-event',
        stock: 20,
        sold: 0
    },
    {
        id: 4,
        name: 'Candy Cane Sword',
        icon: '🍭',
        price: 2,
        priceType: 'wl',
        category: 'event',
        badge: '🎉 Event',
        badgeClass: 'badge-event',
        stock: 25,
        sold: 0
    },
    // Popular Items
    {
        id: 5,
        name: 'World Lock',
        icon: '🔒',
        price: 500,
        priceType: 'gems',
        category: 'popular',
        badge: '🔥 Popular',
        badgeClass: 'badge-popular',
        stock: 50,
        sold: 0
    },
    {
        id: 6,
        name: 'Diamond Lock',
        icon: '💎',
        price: 2500,
        priceType: 'gems',
        category: 'popular',
        badge: '🔥 Popular',
        badgeClass: 'badge-popular',
        stock: 30,
        sold: 0
    },
    {
        id: 8,
        name: 'Blaze Sword',
        icon: '⚔️',
        price: 150,
        priceType: 'gems',
        category: 'popular',
        badge: '🔥 Popular',
        badgeClass: 'badge-popular',
        stock: 40,
        sold: 0
    }
];

// ============================================
// PLAYER DATA (Simulasi)
// ============================================

let playerData = {
    username: 'Guest',
    gems: 1500,
    wl: 5,
    inventory: [],
    isLoggedIn: false
};

// ============================================
// DOM REFS
// ============================================

const DOM = {
    shopGrid: document.getElementById('shopGrid'),
    shopTabs: document.querySelectorAll('.shop-tab'),
    playerBalance: document.getElementById('playerBalance'),
    loginBtn: document.getElementById('loginBtn'),
    usernameDisplay: document.getElementById('usernameDisplay')
};

// ============================================
// SHOP FUNCTIONS
// ============================================

/**
 * Render shop items berdasarkan kategori
 */
function renderShop(category = 'all') {
    if (!DOM.shopGrid) return;

    const filtered = category === 'all'
        ? shopItems
        : shopItems.filter(item => item.category === category);

    if (filtered.length === 0) {
        DOM.shopGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:40px 20px; color:#888;">
                <div style="font-size:40px; margin-bottom:10px;">🛒</div>
                <p>No items in this category yet.</p>
                <p style="font-size:12px; margin-top:5px;">Check back later for new items!</p>
            </div>
        `;
        return;
    }

    DOM.shopGrid.innerHTML = filtered.map(item => {
        const isSoldOut = item.stock - item.sold <= 0;
        const priceDisplay = item.priceType === 'wl' 
            ? `${item.price} WL` 
            : `${formatNumber(item.price)} Gems`;
        
        return `
            <div class="shop-item ${isSoldOut ? 'sold-out' : ''}" 
                 data-id="${item.id}"
                 data-category="${item.category}">
                ${!isSoldOut && item.stock <= 5 ? `<span class="sale-tag">🔥 Low Stock</span>` : ''}
                <span class="icon">${item.icon}</span>
                <div class="name">${item.name}</div>
                <div class="price"><span>${priceDisplay}</span></div>
                <span class="badge ${item.badgeClass}">${item.badge}</span>
                <div style="font-size:10px; color:#666; margin-top:4px;">
                    Stock: ${item.stock - item.sold}
                </div>
                <button class="buy-btn" 
                        onclick="buyItem(${item.id})"
                        ${isSoldOut ? 'disabled' : ''}>
                    ${isSoldOut ? '❌ Sold Out' : '🛒 Buy Now'}
                </button>
            </div>
        `;
    }).join('');
}

/**
 * Filter shop berdasarkan kategori
 */
function filterShop(category, button) {
    // Update active tab
    DOM.shopTabs.forEach(tab => tab.classList.remove('active'));
    if (button) button.classList.add('active');

    renderShop(category);
}

// ============================================
// BUY ITEM FUNCTION
// ============================================

function buyItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    if (!item) {
        showToast('❌ Item not found!', 'error');
        return;
    }

    // Cek stock
    if (item.stock - item.sold <= 0) {
        showToast('❌ This item is sold out!', 'error');
        return;
    }

    // Cek saldo player
    const hasEnough = checkBalance(item);
    if (!hasEnough) {
        const currency = item.priceType === 'wl' ? 'World Locks' : 'Gems';
        showToast(`❌ Not enough ${currency}! You need ${item.price} ${item.priceType.toUpperCase()}`, 'error');
        return;
    }

    // Proses pembelian
    processPurchase(item);
}

/**
 * Cek saldo player cukup atau tidak
 */
function checkBalance(item) {
    if (item.priceType === 'gems') {
        return playerData.gems >= item.price;
    } else {
        return playerData.wl >= item.price;
    }
}

/**
 * Proses pembelian
 */
function processPurchase(item) {
    const btn = document.querySelector(`.shop-item[data-id="${item.id}"] .buy-btn`);
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Processing...';
    }

    // Kurangi saldo
    if (item.priceType === 'gems') {
        playerData.gems -= item.price;
    } else {
        playerData.wl -= item.price;
    }

    // Kurangi stock
    item.sold += 1;

    // Tambah ke inventory
    playerData.inventory.push({
        id: item.id,
        name: item.name,
        icon: item.icon,
        price: item.price,
        priceType: item.priceType,
        purchasedAt: new Date().toISOString()
    });

    // Update UI
    updateBalanceDisplay();

    // Simulasi delay pengiriman
    setTimeout(() => {
        showToast(`✅ Success! ${item.icon} ${item.name} sent to your account!`, 'success');

        if (btn) {
            btn.innerHTML = '✅ Owned';
            btn.disabled = true;
        }

        // Re-render shop untuk update stock
        renderShop(getActiveCategory());
    }, 1500);
}

/**
 * Get active category dari tab yang aktif
 */
function getActiveCategory() {
    const activeTab = document.querySelector('.shop-tab.active');
    return activeTab ? activeTab.dataset.category : 'all';
}

// ============================================
// BALANCE DISPLAY
// ============================================

function updateBalanceDisplay() {
    const balanceEl = document.getElementById('playerBalance');
    if (balanceEl) {
        balanceEl.innerHTML = `
            💎 ${formatNumber(playerData.gems)} Gems 
            | 🔒 ${playerData.wl} WL
        `;
    }

    const usernameEl = document.getElementById('usernameDisplay');
    if (usernameEl) {
        usernameEl.textContent = playerData.isLoggedIn ? playerData.username : 'Guest';
    }
}

// ============================================
// LOGIN / LOGOUT (Simulasi)
// ============================================

function toggleLogin() {
    if (playerData.isLoggedIn) {
        // Logout
        playerData.isLoggedIn = false;
        playerData.username = 'Guest';
        document.getElementById('loginBtn').textContent = '🔑 Login';
        showToast('👋 Logged out successfully!', 'info');
    } else {
        // Login - Simulasi
        const username = prompt('Enter your Growtopia username:');
        if (username && username.trim()) {
            playerData.isLoggedIn = true;
            playerData.username = username.trim();
            document.getElementById('loginBtn').textContent = '🚪 Logout';
            showToast(`✅ Welcome back, ${playerData.username}!`, 'success');
            
            // Simulasi load balance dari server
            playerData.gems = Math.floor(Math.random() * 3000) + 500;
            playerData.wl = Math.floor(Math.random() * 10) + 1;
        }
    }
    updateBalanceDisplay();
}

// ============================================
// TOAST NOTIFICATION
// ============================================

function showToast(message, type = 'info') {
    // Hapus toast lama
    const oldToast = document.querySelector('.toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    // Warna berdasarkan tipe
    const colors = {
        success: 'linear-gradient(135deg, #00cc88, #008855)',
        error: 'linear-gradient(135deg, #ff3030, #8a0000)',
        info: 'linear-gradient(135deg, #ff8800, #cc6600)',
        warning: 'linear-gradient(135deg, #ffcc00, #cc9900)'
    };
    
    toast.style.background = colors[type] || colors.info;
    toast.innerHTML = message;
    
    document.body.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ============================================
// COPY TEXT FUNCTION
// ============================================

function copyText(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast('✅ Copied to clipboard!', 'success');
        })
        .catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            showToast('✅ Copied to clipboard!', 'success');
        });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function getPlayerInventory() {
    return playerData.inventory;
}

function getPlayerBalance() {
    return {
        gems: playerData.gems,
        wl: playerData.wl
    };
}

// ============================================
// INVENTORY PAGE (Optional)
// ============================================

function showInventory() {
    const inventory = getPlayerInventory();
    if (inventory.length === 0) {
        showToast('📦 Your inventory is empty!', 'info');
        return;
    }

    let message = '📦 Your Inventory:\n';
    inventory.forEach((item, index) => {
        message += `${index + 1}. ${item.icon} ${item.name}\n`;
    });
    alert(message);
}

// ============================================
// DAILY SHOP (Optional - Random items setiap hari)
// ============================================

function getDailyShop() {
    const dailyItems = shopItems
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);
    
    return dailyItems;
}

// ============================================
// SEARCH ITEMS
// ============================================

function searchItems(query) {
    if (!query || query.trim() === '') {
        renderShop(getActiveCategory());
        return;
    }

    const searchTerm = query.toLowerCase().trim();
    const filtered = shopItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.includes(searchTerm)
    );

    DOM.shopGrid.innerHTML = filtered.map(item => {
        const isSoldOut = item.stock - item.sold <= 0;
        const priceDisplay = item.priceType === 'wl' 
            ? `${item.price} WL` 
            : `${formatNumber(item.price)} Gems`;
        
        return `
            <div class="shop-item ${isSoldOut ? 'sold-out' : ''}" 
                 data-id="${item.id}"
                 data-category="${item.category}">
                <span class="icon">${item.icon}</span>
                <div class="name">${item.name}</div>
                <div class="price"><span>${priceDisplay}</span></div>
                <span class="badge ${item.badgeClass}">${item.badge}</span>
                <button class="buy-btn" 
                        onclick="buyItem(${item.id})"
                        ${isSoldOut ? 'disabled' : ''}>
                    ${isSoldOut ? '❌ Sold Out' : '🛒 Buy Now'}
                </button>
            </div>
        `;
    }).join('');

    if (filtered.length === 0) {
        DOM.shopGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:40px 20px; color:#888;">
                <div style="font-size:40px; margin-bottom:10px;">🔍</div>
                <p>No items found for "<strong>${searchTerm}</strong>"</p>
            </div>
        `;
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Render shop
    renderShop('all');
    
    // Update balance
    updateBalanceDisplay();
    
    // Set default active tab
    const firstTab = document.querySelector('.shop-tab');
    if (firstTab) firstTab.classList.add('active');

    // Keyboard shortcut: Ctrl+Shift+I for inventory
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            showInventory();
        }
    });
});

// ============================================
// EXPOSE TO GLOBAL (Untuk inline onclick)
// ============================================

window.buyItem = buyItem;
window.filterShop = filterShop;
window.copyText = copyText;
window.toggleLogin = toggleLogin;
window.showInventory = showInventory;
window.searchItems = searchItems;
window.getDailyShop = getDailyShop;
window.getPlayerBalance = getPlayerBalance;
window.getPlayerInventory = getPlayerInventory;

// ============================================
// CONSOLE HELP
// ============================================

console.log('%c🔥 BlazeTopia Shop Loaded!', 'color: #ff3030; font-size: 20px; font-weight: bold;');
console.log('%cAvailable commands:', 'color: #ff8800; font-size: 14px;');
console.log('  getPlayerBalance() - Check your balance');
console.log('  getPlayerInventory() - Check your inventory');
console.log('  getDailyShop() - Get today\'s daily items');
console.log('  searchItems("keyword") - Search items');
console.log('  showInventory() - Show your inventory');
console.log('  toggleLogin() - Login/Logout');

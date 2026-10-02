// ============================================================
// MOISH - THE FISHING GAME | UI.JS
// User Interface, Rendering, Modals, Story & Visual FX
// ============================================================

class UIManager {
    constructor() {
        this.currentScreen = 'mainmenu';
        this.storyIndex = 0;
        this.storyTimer = null;
        this.storyCanSkip = false;
        this.skipCountdown = 10;
        this.skipInterval = null;
        this.selectedFishForSale = new Set();
        this.selectedFishForStore = new Set();
    }

    init() {
        this.bindEvents();
        this.applyLanguage();
        this.applyDisplayMode();

        // Game callbacks
        game.onTimeUpdate = (timeInfo) => this.updateTimeAndEnvironment(timeInfo);
        game.onBite = (data) => this.showBiteAlert(data);
        game.onMinigameTick = (pos) => this.updateMinigameIndicator(pos);
        game.onCatch = (result) => this.showCatchResult(result);
        game.onComboReset = () => this.updateComboDisplay(0);
        game.onLevelUp = (level) => this.showLevelUpNotification(level);
        game.onMapUnlocked = (map) => this.showMapUnlockedNotification(map);
        game.onAchievementUnlocked = (ach) => this.showAchievementNotification(ach);
        game.onSkillActivated = (info) => this.showToast(info.desc, 'success');
        game.onFatigueWarning = () => this.showFatigueWarning();

        this.updateMainMenuButtons();
    }

    // ── TRANSLATION HELPER ────────────────────────────────────

    t(key) {
        const lang = game.settings.language || 'id';
        const dict = I18N[lang] || I18N['id'];
        return dict[key] || I18N['id'][key] || key;
    }

    applyLanguage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) {
                el.textContent = translation;
            }
        });
    }

    // ── SCREEN MANAGEMENT ─────────────────────────────────────

    showScreen(screenId) {
        audio.playClick();
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

        const target = document.getElementById(`screen-${screenId}`);
        if (target) {
            target.classList.add('active');
            this.currentScreen = screenId;
        }

        if (screenId === 'fishing') {
            audio.startAmbientWaves();
            this.updateFishingHUD();
            this.updateWeatherParticles();
        } else {
            audio.stopAmbientWaves();
        }

        if (screenId === 'home') {
            this.renderHomeScreen();
        }

        if (screenId === 'mainmenu') {
            this.updateMainMenuButtons();
        }

        if (screenId === 'settings') {
            this.updateSettingsUI();
        }
    }

    updateMainMenuButtons() {
        const continueBtn = document.getElementById('btn-menu-continue');
        const continueSub = document.getElementById('menu-continue-subtitle');
        if (!continueBtn) return;

        const hasSave = storage.hasAnySave();
        const latest = hasSave ? storage.getLatestSave() : null;

        if (hasSave && latest) {
            continueBtn.classList.remove('disabled');
            continueBtn.classList.add('has-save');
            continueBtn.style.display = 'flex';

            if (continueSub) {
                const charObj = GAME_DATA.CHARACTERS.find(c => c.id === latest.currentCharacter);
                const charName = charObj ? charObj.name : 'Nelayan';
                const dayText = this.t('day') || 'Hari';
                continueSub.textContent = `${dayText} ${latest.day || 1} • ${charName} (Lv. ${latest.level || 1})`;
                continueSub.style.display = 'block';
            }
        } else {
            continueBtn.classList.add('disabled');
            continueBtn.classList.remove('has-save');
            continueBtn.style.display = 'flex';

            if (continueSub) {
                const lang = game.settings.language || 'id';
                continueSub.textContent = (lang === 'en') ? '(No save data)' : '(Belum ada data)';
                continueSub.style.display = 'block';
            }
        }
    }

    // ── DISPLAY SETTINGS (Fullscreen / Windowed / Custom) ─────

    applyDisplayMode() {
        const mode = game.settings.display || 'windowed';
        const res = game.settings.resolution || '1920x1080';
        const container = document.getElementById('game-container');
        if (!container) return;

        let [w, h] = res.split('x').map(Number);
        if (!w || !h) { w = 1280; h = 720; }

        if (mode === 'fullscreen') {
            container.style.width = '100vw';
            container.style.height = '100vh';
            container.style.border = 'none';
            container.style.borderRadius = '0';
            container.style.boxShadow = 'none';
        } else if (mode === 'windowed' || mode === 'custom') {
            container.style.width = `${w}px`;
            container.style.height = `${h}px`;
            container.style.maxWidth = '98vw';
            container.style.maxHeight = '98vh';
            container.style.border = '2px solid rgba(56, 189, 248, 0.25)';
            container.style.borderRadius = '16px';
            container.style.boxShadow = '0 20px 60px rgba(0,0,0,0.85)';
        }
    }

    updateSettingsUI() {
        const s = game.settings;

        // Display mode segmented buttons
        document.querySelectorAll('.btn-setting-display').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-display') === s.display);
        });

        // Resolution select
        const resSelect = document.getElementById('setting-resolution-select');
        if (resSelect && s.resolution) resSelect.value = s.resolution;

        // Visual Quality segmented buttons
        document.querySelectorAll('.btn-setting-quality').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-quality') === (s.visualQuality || 'high'));
        });

        // Language buttons (10 languages)
        document.querySelectorAll('.btn-lang').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === s.language);
        });

        // Audio Sliders
        const masterSlider = document.getElementById('slider-master-volume');
        if (masterSlider) {
            const masterVal = Math.round((s.soundMaster ?? 0.8) * 100);
            masterSlider.value = masterVal;
            const el = document.getElementById('val-master-volume');
            if (el) el.textContent = `${masterVal}%`;
        }

        const bgmSlider = document.getElementById('slider-bgm-volume');
        if (bgmSlider) {
            const bgmVal = Math.round((s.soundBgm ?? 0.6) * 100);
            bgmSlider.value = bgmVal;
            const el = document.getElementById('val-bgm-volume');
            if (el) el.textContent = `${bgmVal}%`;
        }

        const sfxSlider = document.getElementById('slider-sfx-volume');
        if (sfxSlider) {
            const sfxVal = Math.round((s.soundSfx ?? 0.9) * 100);
            sfxSlider.value = sfxVal;
            const el = document.getElementById('val-sfx-volume');
            if (el) el.textContent = `${sfxVal}%`;
        }

        const voiceSlider = document.getElementById('slider-voice-volume');
        if (voiceSlider) {
            const voiceVal = Math.round((s.soundVoice ?? 0.7) * 100);
            voiceSlider.value = voiceVal;
            const el = document.getElementById('val-voice-volume');
            if (el) el.textContent = `${voiceVal}%`;
        }

        // Controls
        const sensSlider = document.getElementById('slider-sensitivity');
        if (sensSlider) {
            const sensVal = s.hookSensitivity ?? 40;
            sensSlider.value = sensVal;
            const el = document.getElementById('val-sensitivity');
            if (el) el.textContent = `${sensVal}%`;
        }

        const autoCastBox = document.getElementById('checkbox-auto-cast');
        if (autoCastBox) autoCastBox.checked = !!s.autoCast;

        const showTimerBox = document.getElementById('checkbox-show-timer');
        if (showTimerBox) showTimerBox.checked = s.showTimer !== false;
    }

    toggleBrowserFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
        }
    }

    // ── STORY CUTSCENE WITH VOICE ─────────────────────────────

    startStory() {
        this.showScreen('story');
        this.storyIndex = 0;
        this.storyCanSkip = false;
        this.skipCountdown = 10;

        const skipBtn = document.getElementById('btn-story-skip');
        if (skipBtn) {
            skipBtn.classList.add('disabled');
            skipBtn.textContent = `${this.t('skipIn')} 10s`;
        }

        if (this.skipInterval) clearInterval(this.skipInterval);
        this.skipInterval = setInterval(() => {
            this.skipCountdown--;
            if (this.skipCountdown <= 0) {
                clearInterval(this.skipInterval);
                this.storyCanSkip = true;
                if (skipBtn) {
                    skipBtn.classList.remove('disabled');
                    skipBtn.textContent = this.t('skipStory');
                }
            } else if (skipBtn) {
                skipBtn.textContent = `${this.t('skipIn')} ${this.skipCountdown}s`;
            }
        }, 1000);

        this.showNextStoryLine();
    }

    showNextStoryLine() {
        if (this.storyIndex >= GAME_DATA.STORY.length) {
            this.finishStory();
            return;
        }

        const line = GAME_DATA.STORY[this.storyIndex];
        const textArea = document.getElementById('story-text-area');
        const lang = game.settings.language || 'id';
        const text = (lang === 'en' && line.textEn) ? line.textEn : line.text;

        if (textArea) {
            textArea.innerHTML = `
                <div class="story-line ${line.speaker}">
                    ${text}
                </div>
            `;
        }

        // Voice narration
        audio.speakStory(text, lang, line.speaker);

        this.storyIndex++;
        this.storyTimer = setTimeout(() => {
            this.showNextStoryLine();
        }, 3800);
    }

    skipStory() {
        if (!this.storyCanSkip) return;
        this.finishStory();
    }

    finishStory() {
        if (this.storyTimer) clearTimeout(this.storyTimer);
        if (this.skipInterval) clearInterval(this.skipInterval);
        audio.stopSpeech();

        // Start new game and trigger Day 1 transition
        game.newGame();
        this.showDayTransition(1, () => {
            this.showScreen('fishing');
        });
    }

    // ── DAY TRANSITION (Black Screen with "Day X") ────────────

    showDayTransition(dayNumber, callback) {
        const overlay = document.getElementById('day-transition-overlay');
        const title = document.getElementById('day-transition-title');
        const subtitle = document.getElementById('day-transition-subtitle');

        if (!overlay) {
            if (callback) callback();
            return;
        }

        title.textContent = `${this.t('day')} ${dayNumber}`;
        const mapData = GAME_DATA.MAPS[game.state.currentMap] || GAME_DATA.MAPS[0];
        const lang = game.settings.language || 'id';
        subtitle.textContent = (lang === 'en') ? mapData.nameEn : mapData.name;

        overlay.classList.remove('hidden');
        overlay.style.opacity = '1';

        setTimeout(() => {
            overlay.style.transition = 'opacity 0.8s ease';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.classList.add('hidden');
                overlay.style.transition = '';
                if (callback) callback();
            }, 800);
        }, 1800);
    }

    // ── FISHING SCREEN & HUD ──────────────────────────────────

    updateFishingHUD() {
        const st = game.state;

        // Day
        const dayEl = document.getElementById('hud-day');
        if (dayEl) dayEl.textContent = `${this.t('day')} ${st.day}`;

        // Stamina bar
        const maxStamina = game.getMaxStamina();
        const staminaPct = Math.max(0, Math.min(100, (st.stamina / maxStamina) * 100));
        const staminaFill = document.getElementById('hud-stamina-fill');
        const staminaVal = document.getElementById('hud-stamina-val');
        if (staminaFill) staminaFill.style.width = `${staminaPct}%`;
        if (staminaVal) staminaVal.textContent = `${Math.floor(st.stamina)}/${maxStamina}`;

        // EXP bar
        const reqExp = game.getRequiredExp(st.level);
        const expPct = Math.min(100, (st.exp / reqExp) * 100);
        const expFill = document.getElementById('hud-exp-fill');
        const levelVal = document.getElementById('hud-level-val');
        if (expFill) expFill.style.width = `${expPct}%`;
        if (levelVal) levelVal.textContent = `Lv. ${st.level}`;

        // Coins
        const coinsVal = document.getElementById('hud-coins-val');
        if (coinsVal) coinsVal.textContent = st.coins.toLocaleString();

        // Bag
        const maxBag = game.getMaxBagCapacity();
        const bagVal = document.getElementById('hud-bag-val');
        if (bagVal) bagVal.textContent = `${st.bag.length}/${maxBag}`;

        // Weather
        const weatherObj = GAME_DATA.WEATHER.find(w => w.id === st.weather) || GAME_DATA.WEATHER[0];
        const weatherEl = document.getElementById('hud-weather');
        if (weatherEl) {
            weatherEl.textContent = weatherObj.icon;
            const lang = game.settings.language || 'id';
            weatherEl.title = (lang === 'en') ? weatherObj.nameEn : weatherObj.name;
        }

        // Map theme styles
        const mapData = GAME_DATA.MAPS[st.currentMap] || GAME_DATA.MAPS[0];
        const mapTitle = document.getElementById('hud-map-name');
        if (mapTitle) {
            const lang = game.settings.language || 'id';
            mapTitle.textContent = (lang === 'en') ? mapData.nameEn : mapData.name;
        }
    }

    updateTimeAndEnvironment(timeInfo) {
        // Clock
        const timeEl = document.getElementById('hud-time');
        if (timeEl) timeEl.textContent = timeInfo.timeFormatted;

        // Sky & Sun/Moon
        const sky = document.getElementById('fishing-sky');
        const sun = document.getElementById('fishing-sun');

        if (sky) {
            sky.className = `fishing-sky ${timeInfo.phase}`;
        }

        if (sun) {
            if (timeInfo.isNight) {
                sun.classList.add('moon');
            } else {
                sun.classList.remove('moon');
            }
            // Sun/moon arc trajectory
            const angle = (timeInfo.percentOfDay / 100) * Math.PI;
            const xPct = 10 + (timeInfo.percentOfDay * 0.8);
            const yPct = 70 - (Math.sin(angle) * 50);
            sun.style.left = `${xPct}%`;
            sun.style.top = `${yPct}%`;
        }

        // Fatigue overlay
        const fatigueOverlay = document.getElementById('fishing-fatigue-vignette');
        if (fatigueOverlay) {
            const maxStamina = game.getMaxStamina();
            const ratio = game.state.stamina / maxStamina;
            if (ratio < 0.25 || (timeInfo.isNight && ratio < 0.4)) {
                fatigueOverlay.style.opacity = `${(0.4 - ratio) * 2}`;
            } else {
                fatigueOverlay.style.opacity = '0';
            }
        }

        this.updateFishingHUD();
    }

    updateWeatherParticles() {
        const container = document.getElementById('weather-particles-container');
        if (!container) return;
        container.innerHTML = '';

        if (!game.settings.particles) return;

        const weather = game.state.weather;
        if (weather === 'rain' || weather === 'storm') {
            const count = weather === 'storm' ? 70 : 40;
            for (let i = 0; i < count; i++) {
                const drop = document.createElement('div');
                drop.className = 'rain-particle';
                drop.style.left = `${Math.random() * 100}%`;
                drop.style.height = `${15 + Math.random() * 20}px`;
                drop.style.animationDuration = `${0.4 + Math.random() * 0.4}s`;
                drop.style.animationDelay = `${Math.random() * 1}s`;
                container.appendChild(drop);
            }
        } else if (weather === 'snow') {
            for (let i = 0; i < 40; i++) {
                const flake = document.createElement('div');
                flake.className = 'snow-particle';
                flake.style.left = `${Math.random() * 100}%`;
                flake.style.opacity = `${0.3 + Math.random() * 0.7}`;
                flake.style.animationDuration = `${2 + Math.random() * 3}s`;
                flake.style.animationDelay = `${Math.random() * 2}s`;
                container.appendChild(flake);
            }
        }
    }

    showBiteAlert(data) {
        const line = document.getElementById('fishing-line');
        const hook = document.getElementById('fishing-hook');
        if (line) line.style.height = '140px';
        if (hook) hook.textContent = '❗';

        const minigameEl = document.getElementById('timing-minigame');
        if (minigameEl) minigameEl.classList.add('active');

        const castBtn = document.getElementById('btn-cast-line');
        if (castBtn) {
            castBtn.textContent = 'STRIKE! 🎣';
            castBtn.classList.add('strike');
        }
    }

    updateMinigameIndicator(pos) {
        const indicator = document.getElementById('timing-indicator');
        if (indicator) {
            indicator.style.left = `${pos}%`;
        }
    }

    showCatchResult(result) {
        const minigameEl = document.getElementById('timing-minigame');
        if (minigameEl) minigameEl.classList.remove('active');

        const line = document.getElementById('fishing-line');
        const hook = document.getElementById('fishing-hook');
        if (line) line.style.height = '0';
        if (hook) hook.textContent = '🪝';

        const castBtn = document.getElementById('btn-cast-line');
        if (castBtn) {
            castBtn.textContent = this.t('castLine');
            castBtn.classList.remove('strike');
        }

        const popup = document.getElementById('catch-popup');
        const card = document.getElementById('catch-card');
        if (!popup || !card) return;

        if (result.success) {
            const fish = result.fish;
            const rarity = GAME_DATA.RARITIES[fish.rarity];
            const mut = result.mutation;

            card.className = 'catch-card';
            card.style.borderColor = rarity.color;
            card.style.boxShadow = rarity.glow;

            const fishImg = this.getFishImageUrl(fish);
            const lang = game.settings.language || 'id';
            const fishName = (lang === 'en') ? fish.nameEn : fish.name;

            let mutationBadgeHtml = '';
            if (mut) {
                const mutStyle = mut.specialGlow ? `box-shadow: ${mut.specialGlow}; border-color: ${mut.color};` : `background: ${mut.color}22; border-color: ${mut.color};`;
                mutationBadgeHtml = `
                    <div class="catch-mutation" style="${mutStyle}">
                        ${mut.icon} ${mut.name} (+${Math.floor(mut.coinBonus * 100)}% Koin)
                    </div>
                `;
            }

            let perfectBadgeHtml = result.perfect ? `<div style="color: var(--accent-gold); font-weight: 800; font-size: 14px; margin-bottom: 5px;">⭐ PERFECT STRIKE! +50% BONUS ⭐</div>` : '';

            let bombNoticeHtml = '';
            if (result.bombFish && result.bombFish.length) {
                bombNoticeHtml = `
                    <div style="background: rgba(239, 68, 68, 0.2); border: 1px solid var(--accent-red); border-radius: 8px; padding: 6px; margin-top: 10px; font-size: 12px;">
                        💣 <b>BOM JAUNE!</b> Mendapat +${result.bombFish.length} ikan ekstra!
                    </div>
                `;
            }

            card.innerHTML = `
                ${perfectBadgeHtml}
                <img class="catch-fish-image" src="${fishImg}" alt="${fishName}" style="filter: hue-rotate(${fish.hue}deg) saturate(1.2);">
                <div class="catch-fish-name" style="color: ${rarity.color};">${fishName}</div>
                <div class="catch-rarity" style="background: ${rarity.color}22; color: ${rarity.color}; border: 1px solid ${rarity.color};">${rarity.name}</div>
                ${mutationBadgeHtml}
                <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 12px;">${fish.desc}</p>
                <div class="catch-stats">
                    <div class="catch-stat">
                        <div class="label">${this.t('coins')}</div>
                        <div class="value">+${fish.coins}</div>
                    </div>
                    <div class="catch-stat">
                        <div class="label">${this.t('exp')}</div>
                        <div class="value">+${fish.exp}</div>
                    </div>
                </div>
                ${bombNoticeHtml}
                <button class="catch-btn" id="btn-catch-dismiss">${this.t('confirm')}</button>
            `;

            document.getElementById('btn-catch-dismiss').onclick = () => {
                popup.classList.remove('active');
                game.dismissCatch();
                this.updateFishingHUD();
            };

            this.updateComboDisplay(result.combo);
        } else {
            card.className = 'catch-card escaped';
            card.style.borderColor = 'var(--accent-red)';
            card.style.boxShadow = 'none';

            card.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 10px;">💨</div>
                <div class="catch-fish-name" style="color: var(--accent-red);">${this.t('fishEscaped')}</div>
                <p style="font-size: 13px; color: var(--text-secondary); margin: 15px 0;">Ikan terlepas dari kail!</p>
                <button class="catch-btn" id="btn-catch-dismiss">${this.t('confirm')}</button>
            `;

            document.getElementById('btn-catch-dismiss').onclick = () => {
                popup.classList.remove('active');
                game.dismissCatch();
                this.updateFishingHUD();
            };

            this.updateComboDisplay(0);
        }

        popup.classList.add('active');
    }

    updateComboDisplay(combo) {
        const comboEl = document.getElementById('combo-display');
        const numEl = document.getElementById('combo-num');
        if (!comboEl || !numEl) return;

        if (combo > 1) {
            numEl.textContent = `${combo}x`;
            comboEl.style.display = 'block';
        } else {
            comboEl.style.display = 'none';
        }
    }

    getFishImageUrl(fish) {
        return `Bahan/The Fish/Ikan_${fish.img}.png`;
    }

    showFatigueWarning() {
        this.showToast(this.t('youAreTired'), 'warning');
    }

    // ── HOME SCREEN & MODALS ──────────────────────────────────

    renderHomeScreen() {
        const st = game.state;

        // Stats bar
        document.getElementById('home-stat-day').textContent = `${this.t('day')} ${st.day}`;
        document.getElementById('home-stat-stamina').textContent = `${Math.floor(st.stamina)}/${game.getMaxStamina()}`;
        document.getElementById('home-stat-coins').textContent = st.coins.toLocaleString();
        document.getElementById('home-stat-bag').textContent = `${st.bag.length}/${game.getMaxBagCapacity()}`;
        document.getElementById('home-stat-level').textContent = `Lv. ${st.level}`;

        // Character portrait
        const charDef = GAME_DATA.CHARACTERS.find(c => c.id === st.currentCharacter);
        const charImgEl = document.getElementById('home-char-img');
        const charNameEl = document.getElementById('home-char-name');
        if (charImgEl) {
            charImgEl.src = charDef.img ? `Bahan/Characters/${charDef.img}` : 'Bahan/Characters/Chloe.png';
        }
        if (charNameEl) {
            charNameEl.textContent = charDef.name;
        }
    }

    openModal(modalId) {
        audio.playClick();
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal() {
        audio.playClick();
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }

    // ── MODAL: SELL FISH ──────────────────────────────────────

    openSellModal() {
        this.selectedFishForSale.clear();
        this.renderSellList();
        this.openModal('modal-sell');
    }

    renderSellList() {
        const listEl = document.getElementById('sell-fish-list');
        const totalCoinsEl = document.getElementById('sell-total-coins');
        const sellBtn = document.getElementById('btn-sell-confirm');

        if (!listEl) return;
        listEl.innerHTML = '';

        if (!game.state.bag.length) {
            listEl.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 30px;">${this.t('emptyBag')}</p>`;
            if (totalCoinsEl) totalCoinsEl.textContent = '0';
            if (sellBtn) sellBtn.disabled = true;
            return;
        }

        let calculatedTotal = 0;

        game.state.bag.forEach(item => {
            const isSelected = this.selectedFishForSale.has(item.instanceId);
            if (isSelected) calculatedTotal += item.coins;

            const rarity = GAME_DATA.RARITIES[item.rarity];
            const div = document.createElement('div');
            div.className = `fish-item ${isSelected ? 'selected' : ''}`;
            div.style.borderColor = rarity.color;

            const fishImg = this.getFishImageUrl(item);
            const mutBadge = item.mutation ? `<span class="mutation-badge" title="${item.mutation.name}">${item.mutation.icon}</span>` : '';

            div.innerHTML = `
                <div class="checkbox">${isSelected ? '✓' : ''}</div>
                ${mutBadge}
                <img src="${fishImg}" alt="${item.name}" style="filter: hue-rotate(${item.hue}deg) saturate(1.2);">
                <div class="name" style="color: ${rarity.color};">${item.name}</div>
                <div class="info">
                    <span class="rarity-dot" style="background: ${rarity.color};"></span>
                    ${item.coins.toLocaleString()} Koin
                </div>
            `;

            div.onclick = () => {
                if (this.selectedFishForSale.has(item.instanceId)) {
                    this.selectedFishForSale.delete(item.instanceId);
                } else {
                    this.selectedFishForSale.add(item.instanceId);
                }
                this.renderSellList();
            };

            listEl.appendChild(div);
        });

        if (totalCoinsEl) totalCoinsEl.textContent = calculatedTotal.toLocaleString();
        if (sellBtn) sellBtn.disabled = this.selectedFishForSale.size === 0;
    }

    selectAllForSale() {
        game.state.bag.forEach(item => this.selectedFishForSale.add(item.instanceId));
        this.renderSellList();
    }

    deselectAllForSale() {
        this.selectedFishForSale.clear();
        this.renderSellList();
    }

    confirmSell() {
        const ids = Array.from(this.selectedFishForSale);
        if (!ids.length) return;

        const totalEarned = game.sellFish(ids);
        this.selectedFishForSale.clear();
        this.showToast(`${this.t('sellSuccess')} +${totalEarned.toLocaleString()} ${this.t('coins')}`, 'success');
        this.renderHomeScreen();
        this.renderSellList();
    }

    // ── MODAL: STORE FISH (AQUARIUM) ──────────────────────────

    openStoreModal() {
        this.selectedFishForStore.clear();
        this.renderStoreList();
        this.openModal('modal-store');
    }

    renderStoreList() {
        const listEl = document.getElementById('store-fish-list');
        const storeBtn = document.getElementById('btn-store-confirm');

        if (!listEl) return;
        listEl.innerHTML = '';

        if (!game.state.bag.length) {
            listEl.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 30px;">${this.t('emptyBag')}</p>`;
            if (storeBtn) storeBtn.disabled = true;
            return;
        }

        game.state.bag.forEach(item => {
            const isSelected = this.selectedFishForStore.has(item.instanceId);
            const rarity = GAME_DATA.RARITIES[item.rarity];
            const div = document.createElement('div');
            div.className = `fish-item ${isSelected ? 'selected' : ''}`;
            div.style.borderColor = rarity.color;

            const fishImg = this.getFishImageUrl(item);
            const mutBadge = item.mutation ? `<span class="mutation-badge">${item.mutation.icon}</span>` : '';

            div.innerHTML = `
                <div class="checkbox">${isSelected ? '✓' : ''}</div>
                ${mutBadge}
                <img src="${fishImg}" alt="${item.name}" style="filter: hue-rotate(${item.hue}deg);">
                <div class="name" style="color: ${rarity.color};">${item.name}</div>
                <div class="info">${rarity.name}</div>
            `;

            div.onclick = () => {
                if (this.selectedFishForStore.has(item.instanceId)) {
                    this.selectedFishForStore.delete(item.instanceId);
                } else {
                    this.selectedFishForStore.add(item.instanceId);
                }
                this.renderStoreList();
            };

            listEl.appendChild(div);
        });

        if (storeBtn) storeBtn.disabled = this.selectedFishForStore.size === 0;
    }

    confirmStore() {
        const ids = Array.from(this.selectedFishForStore);
        if (!ids.length) return;

        game.storeFishInAquarium(ids);
        this.selectedFishForStore.clear();
        this.showToast(this.t('storeSuccess'), 'success');
        this.renderHomeScreen();
        this.renderStoreList();
    }

    // ── MODAL: AQUARIUM DISPLAY ───────────────────────────────

    openAquariumModal() {
        const grid = document.getElementById('aquarium-grid');
        if (!grid) return;
        grid.innerHTML = '';

        if (!game.state.aquarium.length) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 30px;">Belum ada ikan di akuarium. Simpan ikan dari tas!</p>`;
        } else {
            game.state.aquarium.forEach(item => {
                const rarity = GAME_DATA.RARITIES[item.rarity];
                const div = document.createElement('div');
                div.className = 'aquarium-fish';
                div.style.borderColor = rarity.color;

                const fishImg = this.getFishImageUrl(item);
                const mutIcon = item.mutation ? `<span style="font-size: 14px;">${item.mutation.icon}</span>` : '';

                div.innerHTML = `
                    <img src="${fishImg}" alt="${item.name}" style="filter: hue-rotate(${item.hue}deg);">
                    <div class="name" style="color: ${rarity.color};">${item.name} ${mutIcon}</div>
                    <div class="count">${rarity.name}</div>
                `;
                grid.appendChild(div);
            });
        }

        this.openModal('modal-aquarium');
    }

    // ── MODAL: UPGRADES ───────────────────────────────────────

    openUpgradeModal() {
        const grid = document.getElementById('upgrade-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const st = game.state;
        const upgradeKeys = Object.keys(GAME_DATA.UPGRADES);

        upgradeKeys.forEach(key => {
            const def = GAME_DATA.UPGRADES[key];
            const currentLvl = st.upgrades[key] || 0;
            const currentDef = def.levels[currentLvl];
            const hasNext = currentLvl + 1 < def.levels.length;
            const nextDef = hasNext ? def.levels[currentLvl + 1] : null;

            const card = document.createElement('div');
            card.className = 'upgrade-card';

            let nextHtml = `<div class="next" style="color: var(--accent-gold);">${this.t('maxLevel')}</div>`;
            let btnHtml = `<button class="btn-upgrade" disabled>${this.t('maxLevel')}</button>`;

            if (hasNext && nextDef) {
                const canAfford = st.coins >= nextDef.cost;
                nextHtml = `<div class="next">${this.t('nextUpgrade')}: ${nextDef.name} (${nextDef.cost.toLocaleString()} Koin)</div>`;
                btnHtml = `
                    <button class="btn-upgrade" ${canAfford ? '' : 'disabled'} id="btn-upg-${key}">
                        ${this.t('upgrade')} (${nextDef.cost.toLocaleString()} Koin)
                    </button>
                `;
            }

            card.innerHTML = `
                <div class="icon">${def.icon}</div>
                <div class="name">${def.name}</div>
                <div class="current">${this.t('currentLevel')}: ${currentDef.name}</div>
                ${nextHtml}
                ${btnHtml}
            `;

            grid.appendChild(card);

            if (hasNext) {
                const btn = card.querySelector(`#btn-upg-${key}`);
                if (btn) {
                    btn.onclick = () => {
                        const res = game.buyUpgrade(key);
                        if (res.success) {
                            this.showToast(`${def.name} berhasil di-upgrade!`, 'success');
                            this.renderHomeScreen();
                            this.openUpgradeModal();
                        } else if (res.error === 'not_enough_coins') {
                            this.showToast(this.t('notEnoughCoins'), 'error');
                        }
                    };
                }
            }
        });

        this.openModal('modal-upgrade');
    }

    // ── MODAL: CHARACTER SHOP & UPGRADE ───────────────────────

    openCharacterModal() {
        const grid = document.getElementById('char-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const st = game.state;

        GAME_DATA.CHARACTERS.forEach(char => {
            const isOwned = !!st.ownedCharacters[char.id];
            const isEquipped = st.currentCharacter === char.id;
            const charLvl = (st.ownedCharacters[char.id] && st.ownedCharacters[char.id].level) || 0;
            const hasNextUpgrade = isOwned && charLvl < char.upgrades.length;
            const nextUpg = hasNextUpgrade ? char.upgrades[charLvl] : null;

            const card = document.createElement('div');
            card.className = `char-card ${isEquipped ? 'equipped' : ''} ${!isOwned ? 'locked' : ''}`;

            const charImg = char.img ? `Bahan/Characters/${char.img}` : 'Bahan/Characters/Chloe.png';

            let actionHtml = '';
            if (isEquipped) {
                actionHtml = `<div class="price-tag" style="background: rgba(34, 197, 94, 0.2); color: var(--accent-green);">${this.t('equipped')}</div>`;
            } else if (isOwned) {
                actionHtml = `<button class="btn btn-primary" id="btn-equip-${char.id}">${this.t('equip')}</button>`;
            } else {
                const canAfford = st.coins >= char.price;
                actionHtml = `
                    <button class="btn btn-gold" ${canAfford ? '' : 'disabled'} id="btn-buy-${char.id}">
                        ${this.t('buy')} (${char.price.toLocaleString()} Koin)
                    </button>
                `;
            }

            let upgradeSectionHtml = '';
            if (isOwned && char.upgrades.length) {
                if (hasNextUpgrade && nextUpg) {
                    const canAffordUpg = st.coins >= nextUpg.cost;
                    upgradeSectionHtml = `
                        <div style="margin-top: 10px; border-top: 1px solid var(--border-glass); padding-top: 8px;">
                            <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">Lv.${charLvl} -> Lv.${charLvl + 1}: ${nextUpg.desc}</div>
                            <button class="btn-upgrade" ${canAffordUpg ? '' : 'disabled'} id="btn-upgchar-${char.id}">
                                Upgrade (${nextUpg.cost.toLocaleString()} Koin)
                            </button>
                        </div>
                    `;
                } else {
                    upgradeSectionHtml = `<div style="font-size: 11px; color: var(--accent-gold); margin-top: 8px;">${this.t('maxUpgrade')} (Lv.${charLvl})</div>`;
                }
            }

            card.innerHTML = `
                <img src="${charImg}" alt="${char.name}">
                <div class="name">${char.name}</div>
                <div class="skill-name">⭐ ${char.skill.name}</div>
                <div class="skill-desc">${char.skill.desc}</div>
                <div style="margin-top: 8px;">${actionHtml}</div>
                ${upgradeSectionHtml}
            `;

            grid.appendChild(card);

            // Button handlers
            if (!isOwned) {
                const buyBtn = card.querySelector(`#btn-buy-${char.id}`);
                if (buyBtn) {
                    buyBtn.onclick = () => {
                        const res = game.buyCharacter(char.id);
                        if (res.success) {
                            this.showToast(`${char.name} berhasil dibeli dan dipakai!`, 'success');
                            this.renderHomeScreen();
                            this.openCharacterModal();
                        } else if (res.error === 'not_enough_coins') {
                            this.showToast(this.t('notEnoughCoins'), 'error');
                        }
                    };
                }
            } else if (!isEquipped) {
                const equipBtn = card.querySelector(`#btn-equip-${char.id}`);
                if (equipBtn) {
                    equipBtn.onclick = () => {
                        game.equipCharacter(char.id);
                        this.showToast(`${char.name} sekarang dipakai!`, 'success');
                        this.renderHomeScreen();
                        this.openCharacterModal();
                    };
                }
            }

            if (hasNextUpgrade) {
                const upgBtn = card.querySelector(`#btn-upgchar-${char.id}`);
                if (upgBtn) {
                    upgBtn.onclick = () => {
                        const res = game.upgradeCharacter(char.id);
                        if (res.success) {
                            this.showToast(`${char.name} berhasil di-upgrade ke Lv.${res.newLevel}!`, 'success');
                            this.renderHomeScreen();
                            this.openCharacterModal();
                        } else if (res.error === 'not_enough_coins') {
                            this.showToast(this.t('notEnoughCoins'), 'error');
                        }
                    };
                }
            }
        });

        this.openModal('modal-characters');
    }

    // ── MODAL: MAP SELECTION ──────────────────────────────────

    openMapModal() {
        const grid = document.getElementById('map-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const st = game.state;

        GAME_DATA.MAPS.forEach((map, index) => {
            const isUnlocked = st.unlockedMaps.includes(index);
            const isCurrent = st.currentMap === index;

            const card = document.createElement('div');
            card.className = `map-card ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`;
            card.style.background = `linear-gradient(135deg, ${map.bgColor}44, ${map.waterColor}aa)`;

            const lang = game.settings.language || 'id';
            const mapName = (lang === 'en') ? map.nameEn : map.name;

            if (isUnlocked) {
                card.innerHTML = `
                    <div style="font-size: 28px; margin-bottom: 6px;">🌊</div>
                    <div class="map-name">${mapName}</div>
                    <div class="map-desc">${map.description}</div>
                    <div style="margin-top: 8px;">
                        ${isCurrent ? `<span style="color: var(--accent-gold); font-size: 12px; font-weight: 700;">★ ${this.t('selected')}</span>` : `<button class="btn btn-primary" id="btn-select-map-${index}">${this.t('select')}</button>`}
                    </div>
                `;

                if (!isCurrent) {
                    const btn = card.querySelector(`#btn-select-map-${index}`);
                    if (btn) {
                        btn.onclick = () => {
                            game.selectMap(index);
                            this.showToast(`Berlayar ke ${mapName}!`, 'success');
                            this.openMapModal();
                        };
                    }
                }
            } else {
                card.innerHTML = `
                    <div class="map-lock-icon">🔒</div>
                    <div class="map-name">${mapName}</div>
                    <div class="map-req">${this.t('mapLocked')} ${map.levelReq} ${this.t('required')}</div>
                `;
            }

            grid.appendChild(card);
        });

        this.openModal('modal-maps');
    }

    // ── MODAL: ENCYCLOPEDIA / COLLECTION ──────────────────────

    openCollectionModal() {
        const list = document.getElementById('collection-fish-list');
        const countEl = document.getElementById('collection-count');
        if (!list) return;
        list.innerHTML = '';

        const st = game.state;
        const totalFish = GAME_DATA.FISH.length;
        const caughtFishCount = Object.keys(st.caughtCatalog).length;

        if (countEl) {
            countEl.textContent = `${this.t('discovered')}: ${caughtFishCount} / ${totalFish}`;
        }

        GAME_DATA.FISH.forEach(fish => {
            const catalogEntry = st.caughtCatalog[fish.id];
            const isCaught = !!catalogEntry;
            const rarity = GAME_DATA.RARITIES[fish.rarity];

            const div = document.createElement('div');
            div.className = `fish-item ${!isCaught ? 'undiscovered' : ''}`;
            div.style.borderColor = isCaught ? rarity.color : 'var(--border-glass)';

            const fishImg = this.getFishImageUrl(fish);
            const lang = game.settings.language || 'id';
            const fishName = (lang === 'en') ? fish.nameEn : fish.name;

            if (isCaught) {
                div.innerHTML = `
                    <img src="${fishImg}" alt="${fishName}" style="filter: hue-rotate(${fish.hue}deg);">
                    <div class="name" style="color: ${rarity.color};">${fishName}</div>
                    <div class="info">${rarity.name} • ${catalogEntry.count}x</div>
                `;
            } else {
                div.innerHTML = `
                    <img src="${fishImg}" alt="???" style="filter: brightness(0); opacity: 0.3;">
                    <div class="name" style="color: var(--text-secondary);">???</div>
                    <div class="info" style="color: var(--accent-gold);">Map ${fish.map + 1}</div>
                `;
            }

            list.appendChild(div);
        });

        this.openModal('modal-collection');
    }

    // ── MODAL: ACHIEVEMENTS ───────────────────────────────────

    openAchievementsModal() {
        const list = document.getElementById('achievements-list');
        if (!list) return;
        list.innerHTML = '';

        const st = game.state;
        const lang = game.settings.language || 'id';

        GAME_DATA.ACHIEVEMENTS.forEach(ach => {
            const isUnlocked = st.unlockedAchievements.includes(ach.id);
            const item = document.createElement('div');
            item.className = `achievement-item ${isUnlocked ? 'unlocked' : ''}`;

            const name = (lang === 'en') ? ach.nameEn : ach.name;

            item.innerHTML = `
                <div class="icon">${isUnlocked ? ach.icon : '🔒'}</div>
                <div class="info">
                    <div class="name" style="${isUnlocked ? 'color: var(--accent-gold);' : ''}">${name}</div>
                    <div class="desc">${ach.desc}</div>
                </div>
                <div class="reward">+${ach.reward.toLocaleString()} Koin</div>
            `;

            list.appendChild(item);
        });

        this.openModal('modal-achievements');
    }

    // ── MODAL: SAVE / LOAD GAME ───────────────────────────────

    openSaveLoadModal(mode = 'load') {
        const list = document.getElementById('save-slots-list');
        const title = document.getElementById('saveload-title');
        if (!list) return;
        list.innerHTML = '';

        if (title) {
            title.textContent = mode === 'save' ? this.t('saveGame') : this.t('savedGames');
        }

        const saves = storage.listSaves();

        saves.forEach(slot => {
            const item = document.createElement('div');
            item.className = 'save-slot';

            if (slot.exists && slot.data) {
                const date = new Date(slot.data.savedAt).toLocaleString();
                const charName = (GAME_DATA.CHARACTERS.find(c => c.id === slot.data.currentCharacter) || {}).name || 'Nelayan';

                item.innerHTML = `
                    <div class="info">
                        <div class="slot-name">${this.t('saveSlot')} ${slot.slot + 1} - ${charName} (Lv. ${slot.data.level})</div>
                        <div class="slot-date">📅 ${date}</div>
                        <div class="slot-details">🌊 ${this.t('day')} ${slot.data.day} • 💰 ${slot.data.coins.toLocaleString()} • 🐟 ${slot.data.stats.totalCatches} Ikan</div>
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn btn-primary" id="btn-slot-action-${slot.slot}">
                            ${mode === 'save' ? this.t('save') : this.t('loadGame')}
                        </button>
                        <button class="btn btn-danger" id="btn-slot-del-${slot.slot}">🗑️</button>
                    </div>
                `;

                list.appendChild(item);

                const actionBtn = item.querySelector(`#btn-slot-action-${slot.slot}`);
                if (actionBtn) {
                    actionBtn.onclick = () => {
                        if (mode === 'save') {
                            game.saveCurrent(slot.slot);
                            this.showToast(`Game tersimpan di Slot ${slot.slot + 1}!`, 'success');
                            this.openSaveLoadModal('save');
                        } else {
                            if (game.loadSavedGame(slot.slot)) {
                                this.showToast(`Game dimuat dari Slot ${slot.slot + 1}!`, 'success');
                                this.closeModal();
                                this.showScreen('fishing');
                            }
                        }
                    };
                }

                const delBtn = item.querySelector(`#btn-slot-del-${slot.slot}`);
                if (delBtn) {
                    delBtn.onclick = () => {
                        storage.deleteSave(slot.slot);
                        this.showToast(`Slot ${slot.slot + 1} dihapus`, 'warning');
                        this.openSaveLoadModal(mode);
                    };
                }
            } else {
                item.innerHTML = `
                    <div class="info">
                        <div class="slot-name">${this.t('saveSlot')} ${slot.slot + 1} - [Kosong]</div>
                        <div class="slot-date">Belum ada data tersimpan</div>
                    </div>
                    <div>
                        ${mode === 'save' ? `<button class="btn btn-primary" id="btn-slot-save-${slot.slot}">${this.t('save')}</button>` : `<span style="color: var(--text-secondary); font-size: 12px;">Kosong</span>`}
                    </div>
                `;

                list.appendChild(item);

                if (mode === 'save') {
                    const saveBtn = item.querySelector(`#btn-slot-save-${slot.slot}`);
                    if (saveBtn) {
                        saveBtn.onclick = () => {
                            game.saveCurrent(slot.slot);
                            this.showToast(`Game tersimpan di Slot ${slot.slot + 1}!`, 'success');
                            this.openSaveLoadModal('save');
                        };
                    }
                }
            }
        });

        this.openModal('modal-saveload');
    }

    // ── WEATHER SELECTION MODAL (SARAH SKILL) ──────────────────

    openWeatherPickerModal() {
        const grid = document.getElementById('weather-picker-grid');
        if (!grid) return;
        grid.innerHTML = '';

        GAME_DATA.WEATHER.forEach(w => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary';
            btn.style.padding = '14px';
            btn.style.display = 'flex';
            btn.style.flexDirection = 'column';
            btn.style.alignItems = 'center';
            btn.style.gap = '6px';

            const lang = game.settings.language || 'id';
            const name = (lang === 'en') ? w.nameEn : w.name;

            btn.innerHTML = `
                <span style="font-size: 32px;">${w.icon}</span>
                <span style="font-weight: 700;">${name}</span>
                <span style="font-size: 11px; opacity: 0.8;">Mutasi: +${Math.floor(w.mutationBonus * 100)}%</span>
            `;

            btn.onclick = () => {
                game.setWeather(w.id);
                this.closeModal();
                this.showToast(`Cuaca diatur menjadi ${name}!`, 'success');
                this.showDayTransition(game.state.day, () => {
                    this.showScreen('fishing');
                });
            };

            grid.appendChild(btn);
        });

        this.openModal('modal-weather-picker');
    }

    // ── NOTIFICATIONS & TOASTS ────────────────────────────────

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    showLevelUpNotification(level) {
        this.showToast(`🎉 LEVEL UP! Kamu sekarang Level ${level}!`, 'achievement');
    }

    showMapUnlockedNotification(map) {
        const lang = game.settings.language || 'id';
        const name = (lang === 'en') ? map.nameEn : map.name;
        this.showToast(`🗺️ Map Baru Terbuka: ${name}!`, 'achievement');
    }

    showAchievementNotification(ach) {
        audio.playUpgrade();
        const lang = game.settings.language || 'id';
        const name = (lang === 'en') ? ach.nameEn : ach.name;
        this.showToast(`🏆 Penghargaan: ${name} (+${ach.reward} Koin)!`, 'achievement');
    }

    // ── EVENT BINDINGS ────────────────────────────────────────

    bindEvents() {
        // Main Menu buttons
        document.getElementById('btn-menu-start').onclick = () => {
            this.startStory();
        };

        const contBtn = document.getElementById('btn-menu-continue');
        if (contBtn) {
            contBtn.onclick = () => {
                if (!storage.hasAnySave()) {
                    audio.playClick();
                    this.showToast(this.t('noSaveFound'), 'warning');
                    return;
                }
                if (game.loadLatestGame()) {
                    audio.playClick();
                    const latest = storage.getLatestSave();
                    const dayNum = (latest && latest.day) ? latest.day : 1;
                    this.showToast(`Melanjutkan permainan: Hari ${dayNum}!`, 'success');
                    this.showScreen('fishing');
                    this.updateTimeAndEnvironment(game.getTimeInfo());
                } else {
                    this.showToast(this.t('noSaveFound'), 'error');
                }
            };
        }

        document.getElementById('btn-menu-load').onclick = () => {
            this.openSaveLoadModal('load');
        };

        document.getElementById('btn-menu-settings').onclick = () => {
            this.showScreen('settings');
        };

        document.getElementById('btn-menu-quit').onclick = () => {
            if (confirm('Yakin ingin keluar dari game?')) {
                window.close();
            }
        };

        // Story skip
        const skipBtn = document.getElementById('btn-story-skip');
        if (skipBtn) {
            skipBtn.onclick = () => this.skipStory();
        }

        // Settings Screen controls
        document.getElementById('btn-settings-back').onclick = () => {
            audio.playClick();
            storage.saveSettings(game.settings);
            this.showScreen('mainmenu');
        };

        const saveSettingsBtn = document.getElementById('btn-save-settings');
        if (saveSettingsBtn) {
            saveSettingsBtn.onclick = () => {
                audio.playClick();
                storage.saveSettings(game.settings);
                this.showToast('Pengaturan berhasil disimpan!', 'success');
            };
        }

        // Display mode toggles
        document.querySelectorAll('.btn-setting-display').forEach(btn => {
            btn.onclick = () => {
                audio.playClick();
                document.querySelectorAll('.btn-setting-display').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                game.settings.display = btn.getAttribute('data-display');
                this.applyDisplayMode();
                storage.saveSettings(game.settings);
            };
        });

        // Resolution select
        const resSelect = document.getElementById('setting-resolution-select');
        if (resSelect) {
            resSelect.onchange = () => {
                audio.playClick();
                game.settings.resolution = resSelect.value;
                this.applyDisplayMode();
                storage.saveSettings(game.settings);
            };
        }

        // Visual Quality toggles
        document.querySelectorAll('.btn-setting-quality').forEach(btn => {
            btn.onclick = () => {
                audio.playClick();
                document.querySelectorAll('.btn-setting-quality').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                game.settings.visualQuality = btn.getAttribute('data-quality');
                game.settings.particles = (game.settings.visualQuality !== 'low');
                storage.saveSettings(game.settings);
                this.updateWeatherParticles();
            };
        });

        // Language buttons (10 languages)
        document.querySelectorAll('.btn-lang').forEach(btn => {
            btn.onclick = () => {
                audio.playClick();
                document.querySelectorAll('.btn-lang').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const lang = btn.getAttribute('data-lang');
                game.settings.language = lang;
                storage.saveSettings(game.settings);
                this.applyLanguage();
                this.updateMainMenuButtons();
            };
        });

        // Sliders for Audio & Controls
        const masterSlider = document.getElementById('slider-master-volume');
        if (masterSlider) {
            masterSlider.oninput = () => {
                const val = Number(masterSlider.value);
                game.settings.soundMaster = val / 100;
                audio.setMasterVolume(val / 100);
                const el = document.getElementById('val-master-volume');
                if (el) el.textContent = `${val}%`;
                storage.saveSettings(game.settings);
            };
        }

        const bgmSlider = document.getElementById('slider-bgm-volume');
        if (bgmSlider) {
            bgmSlider.oninput = () => {
                const val = Number(bgmSlider.value);
                game.settings.soundBgm = val / 100;
                audio.setBgmVolume(val / 100);
                const el = document.getElementById('val-bgm-volume');
                if (el) el.textContent = `${val}%`;
                storage.saveSettings(game.settings);
            };
        }

        const sfxSlider = document.getElementById('slider-sfx-volume');
        if (sfxSlider) {
            sfxSlider.oninput = () => {
                const val = Number(sfxSlider.value);
                game.settings.soundSfx = val / 100;
                audio.setSfxVolume(val / 100);
                const el = document.getElementById('val-sfx-volume');
                if (el) el.textContent = `${val}%`;
                storage.saveSettings(game.settings);
            };
        }

        const voiceSlider = document.getElementById('slider-voice-volume');
        if (voiceSlider) {
            voiceSlider.oninput = () => {
                const val = Number(voiceSlider.value);
                game.settings.soundVoice = val / 100;
                const el = document.getElementById('val-voice-volume');
                if (el) el.textContent = `${val}%`;
                storage.saveSettings(game.settings);
            };
        }

        const sensSlider = document.getElementById('slider-sensitivity');
        if (sensSlider) {
            sensSlider.oninput = () => {
                const val = Number(sensSlider.value);
                game.settings.hookSensitivity = val;
                const el = document.getElementById('val-sensitivity');
                if (el) el.textContent = `${val}%`;
                storage.saveSettings(game.settings);
            };
        }

        const autoCastBox = document.getElementById('checkbox-auto-cast');
        if (autoCastBox) {
            autoCastBox.onchange = () => {
                audio.playClick();
                game.settings.autoCast = autoCastBox.checked;
                storage.saveSettings(game.settings);
            };
        }

        const showTimerBox = document.getElementById('checkbox-show-timer');
        if (showTimerBox) {
            showTimerBox.onchange = () => {
                audio.playClick();
                game.settings.showTimer = showTimerBox.checked;
                const timeEl = document.getElementById('hud-time');
                if (timeEl) timeEl.style.display = showTimerBox.checked ? 'block' : 'none';
                storage.saveSettings(game.settings);
            };
        }

        // Fishing Screen controls
        const castBtn = document.getElementById('btn-cast-line');
        if (castBtn) {
            castBtn.onclick = () => {
                if (game.fishingState === 'idle') {
                    const res = game.castLine();
                    if (res.error === 'tired') {
                        this.showToast(this.t('youAreTired'), 'warning');
                    } else if (res.error === 'bag_full') {
                        this.showToast(this.t('bagFull'), 'warning');
                    }
                    this.updateFishingHUD();
                } else if (game.fishingState === 'minigame') {
                    game.strikeFish();
                }
            };
        }

        document.getElementById('btn-go-home').onclick = () => {
            this.showScreen('home');
        };

        // Home Screen controls
        document.getElementById('home-btn-sleep').onclick = () => {
            if (confirm(this.t('sleepConfirm'))) {
                const res = game.sleep();
                if (res.canControlWeather) {
                    this.openWeatherPickerModal();
                } else {
                    this.showDayTransition(res.newDay, () => {
                        this.showScreen('fishing');
                    });
                }
            }
        };

        document.getElementById('home-btn-store').onclick = () => this.openStoreModal();
        document.getElementById('home-btn-sell').onclick = () => this.openSellModal();
        document.getElementById('home-btn-upgrade').onclick = () => this.openUpgradeModal();
        document.getElementById('home-btn-aquarium').onclick = () => this.openAquariumModal();
        document.getElementById('home-btn-collection').onclick = () => this.openCollectionModal();
        document.getElementById('home-btn-char').onclick = () => this.openCharacterModal();
        document.getElementById('home-btn-map').onclick = () => this.openMapModal();
        document.getElementById('home-btn-achievements').onclick = () => this.openAchievementsModal();
        document.getElementById('home-btn-savegame').onclick = () => this.openSaveLoadModal('save');
        document.getElementById('home-btn-fish-again').onclick = () => this.showScreen('fishing');

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.onclick = () => this.closeModal();
        });

        // Sell Modal Actions
        const sellSelectAll = document.getElementById('btn-sell-select-all');
        if (sellSelectAll) sellSelectAll.onclick = () => this.selectAllForSale();

        const sellDeselectAll = document.getElementById('btn-sell-deselect-all');
        if (sellDeselectAll) sellDeselectAll.onclick = () => this.deselectAllForSale();

        const sellConfirm = document.getElementById('btn-sell-confirm');
        if (sellConfirm) sellConfirm.onclick = () => this.confirmSell();

        // Store Modal Actions
        const storeConfirm = document.getElementById('btn-store-confirm');
        if (storeConfirm) storeConfirm.onclick = () => this.confirmStore();

        // Keyboard support
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (this.currentScreen === 'fishing') {
                    e.preventDefault();
                    castBtn.click();
                }
            } else if (e.code === 'Escape') {
                this.closeModal();
            }
        });
    }
}

const ui = new UIManager();

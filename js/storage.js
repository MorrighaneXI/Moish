// ============================================================
// MOISH - THE FISHING GAME | STORAGE.JS
// LocalStorage Persistence, Multi-slot Saves, and Auto-save
// ============================================================

const STORAGE_KEY_PREFIX = 'moish_save_slot_';
const AUTOSAVE_KEY = 'moish_autosave';
const SETTINGS_KEY = 'moish_settings';

class StorageManager {
    constructor() {
        this.maxSlots = 5;
    }

    getDefaultState() {
        return {
            version: '1.0',
            savedAt: new Date().toISOString(),
            day: 1,
            timeOfDaySeconds: 0, // 0 to 1200 (0-600 Day, 600-1200 Night)
            level: 1,
            exp: 0,
            coins: 100,
            stamina: 100,
            maxStamina: 100,
            currentMap: 0,
            unlockedMaps: [0],
            currentCharacter: 'fisher',
            ownedCharacters: {
                fisher: { level: 0 }
            },
            upgrades: {
                rod: 0,
                stamina: 0,
                luck: 0,
                mutation_rate: 0,
                coin_multiplier: 0,
                bag: 0
            },
            bag: [],
            aquarium: [],
            caughtCatalog: {},
            weather: 'sunny',
            daysSinceWeatherChange: 0,
            unlockedAchievements: [],
            stats: {
                totalCatches: 0,
                totalCoinsEarned: 0,
                totalFishSold: 0,
                mutationsFound: 0,
                uniqueMutations: {},
                daysPassed: 1,
                maxCombo: 0,
                rarityCounts: {
                    common: 0, uncommon: 0, rare: 0, epic: 0,
                    legendary: 0, mythic: 0, transcendent: 0, omega: 0
                }
            }
        };
    }

    saveGame(slotIndex, state) {
        try {
            state.savedAt = new Date().toISOString();
            const key = `${STORAGE_KEY_PREFIX}${slotIndex}`;
            localStorage.setItem(key, JSON.stringify(state));
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    }

    loadGame(slotIndex) {
        try {
            const key = `${STORAGE_KEY_PREFIX}${slotIndex}`;
            const data = localStorage.getItem(key);
            if (!data) return null;
            return JSON.parse(data);
        } catch (e) {
            console.error('Load failed:', e);
            return null;
        }
    }

    deleteSave(slotIndex) {
        try {
            const key = `${STORAGE_KEY_PREFIX}${slotIndex}`;
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Delete failed:', e);
            return false;
        }
    }

    saveAutoSave(state) {
        try {
            state.savedAt = new Date().toISOString();
            localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(state));
            return true;
        } catch (e) {
            console.warn('AutoSave failed:', e);
            return false;
        }
    }

    getAutoSave() {
        try {
            const data = localStorage.getItem(AUTOSAVE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    hasAnySave() {
        if (localStorage.getItem(AUTOSAVE_KEY)) return true;
        for (let i = 0; i < this.maxSlots; i++) {
            if (localStorage.getItem(`${STORAGE_KEY_PREFIX}${i}`)) return true;
        }
        return false;
    }

    getLatestSave() {
        const auto = this.getAutoSave();
        let latest = auto;
        let latestDate = auto ? new Date(auto.savedAt).getTime() : 0;

        for (let i = 0; i < this.maxSlots; i++) {
            const save = this.loadGame(i);
            if (save) {
                const saveDate = new Date(save.savedAt).getTime();
                if (saveDate > latestDate) {
                    latestDate = saveDate;
                    latest = save;
                }
            }
        }
        return latest;
    }

    listSaves() {
        const list = [];
        for (let i = 0; i < this.maxSlots; i++) {
            const save = this.loadGame(i);
            list.push({
                slot: i,
                exists: !!save,
                data: save
            });
        }
        return list;
    }

    // ── SETTINGS STORAGE ──────────────────────────────────────

    loadSettings() {
        const defaults = {
            language: 'id',
            display: 'windowed',
            resolution: '1280x720',
            visualQuality: 'high',
            soundMaster: 0.8,
            soundBgm: 0.6,
            soundSfx: 0.9,
            soundVoice: 0.7,
            hookSensitivity: 40,
            autoCast: false,
            showTimer: true,
            customWidth: 1280,
            customHeight: 720,
            fastMode: false,
            particles: true,
            autoSave: true
        };
        try {
            const data = localStorage.getItem(SETTINGS_KEY);
            if (data) return { ...defaults, ...JSON.parse(data) };
        } catch (e) {}

        return defaults;
    }

    saveSettings(settings) {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            return true;
        } catch (e) {
            return false;
        }
    }
}

const storage = new StorageManager();

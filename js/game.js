// ============================================================
// MOISH - THE FISHING GAME | GAME.JS
// Core Game Logic, State Machine, Fishing Cycle, and Skills
// ============================================================

class MoishGame {
    constructor() {
        this.state = storage.getDefaultState();
        this.settings = storage.loadSettings();

        // Runtime states (not saved)
        this.fishingState = 'idle'; // 'idle' | 'waiting' | 'bite' | 'minigame' | 'caught'
        this.biteTimer = null;
        this.minigameTimer = null;
        this.minigamePos = 0;
        this.minigameDir = 1;
        this.minigameSpeed = 2.0;
        this.currentPendingFish = null;
        this.currentPendingMutation = null;
        this.isPerfectCatch = false;

        this.combo = 0;
        this.streak = 0;
        this.comboTimer = null;

        // Day/Night ticker
        this.gameTickInterval = null;
        this.lastTickTime = Date.now();

        // Callbacks to UI
        this.onStateChange = null;
        this.onCatch = null;
        this.onBite = null;
        this.onLevelUp = null;
        this.onMapUnlocked = null;
        this.onAchievementUnlocked = null;
        this.onSkillActivated = null;
        this.onTimeUpdate = null;
        this.onFatigueWarning = null;
    }

    init() {
        // Apply settings
        audio.setMasterVolume(this.settings.soundMaster);
        audio.setBgmVolume(this.settings.soundBgm);
        audio.setSfxVolume(this.settings.soundSfx);
    }

    // ── GAME INITIALIZATION / LOAD ────────────────────────────

    newGame() {
        this.state = storage.getDefaultState();
        this.recalculateMaxStats();
        this.state.stamina = this.state.maxStamina;
        this.startDayNightCycle();
        storage.saveAutoSave(this.state);
        return this.state;
    }

    loadSavedGame(slotIndex) {
        const loaded = storage.loadGame(slotIndex);
        if (loaded) {
            this.state = loaded;
            this.recalculateMaxStats();
            this.startDayNightCycle();
            return true;
        }
        return false;
    }

    loadLatestGame() {
        const latest = storage.getLatestSave();
        if (latest) {
            this.state = latest;
            this.recalculateMaxStats();
            this.startDayNightCycle();
            return true;
        }
        return false;
    }

    saveCurrent(slotIndex = 0) {
        return storage.saveGame(slotIndex, this.state);
    }

    // ── STATS & BONUSES RECALCULATION ──────────────────────────

    getMaxStamina() {
        const upgradeLevel = this.state.upgrades.stamina || 0;
        const baseStamina = GAME_DATA.UPGRADES.stamina.levels[upgradeLevel].value;
        let charBonus = 0;

        // Chloe skill: Stamina bonus
        if (this.state.currentCharacter === 'chloe') {
            const charData = GAME_DATA.CHARACTERS.find(c => c.id === 'chloe');
            charBonus = charData.skill.value; // +15%
            const charLevel = (this.state.ownedCharacters.chloe && this.state.ownedCharacters.chloe.level) || 0;
            for (let i = 0; i < charLevel; i++) {
                charBonus += charData.upgrades[i].bonus;
            }
        }

        return Math.floor(baseStamina * (1 + charBonus));
    }

    getMaxBagCapacity() {
        const upgradeLevel = this.state.upgrades.bag || 0;
        const baseCap = GAME_DATA.UPGRADES.bag.levels[upgradeLevel].value;
        let charBonus = 0;

        // Nono skill: More Fish (+5, +2, +2, +3, +5)
        if (this.state.currentCharacter === 'nono') {
            const charData = GAME_DATA.CHARACTERS.find(c => c.id === 'nono');
            charBonus = charData.skill.value;
            const charLevel = (this.state.ownedCharacters.nono && this.state.ownedCharacters.nono.level) || 0;
            for (let i = 0; i < charLevel; i++) {
                charBonus += charData.upgrades[i].bonus;
            }
        }

        return baseCap + charBonus;
    }

    getRodSpeedMultiplier() {
        const upgradeLevel = this.state.upgrades.rod || 0;
        return GAME_DATA.UPGRADES.rod.levels[upgradeLevel].value;
    }

    getLuckMultiplier() {
        const upgradeLevel = this.state.upgrades.luck || 0;
        let mult = GAME_DATA.UPGRADES.luck.levels[upgradeLevel].value;

        // Jacob skill: Strike!! (Higher rare fish chance)
        if (this.state.currentCharacter === 'jacob') {
            const charData = GAME_DATA.CHARACTERS.find(c => c.id === 'jacob');
            let bonus = charData.skill.value;
            const charLevel = (this.state.ownedCharacters.jacob && this.state.ownedCharacters.jacob.level) || 0;
            for (let i = 0; i < charLevel; i++) {
                bonus += charData.upgrades[i].bonus;
            }
            mult += bonus;
        }

        // Weather bonus
        const weatherObj = GAME_DATA.WEATHER.find(w => w.id === this.state.weather);
        if (weatherObj && weatherObj.rareBonus) {
            mult += weatherObj.rareBonus;
        }

        return mult;
    }

    getMutationChance() {
        const upgradeLevel = this.state.upgrades.mutation_rate || 0;
        const upgradeMult = GAME_DATA.UPGRADES.mutation_rate.levels[upgradeLevel].value;
        let baseChance = GAME_DATA.DEFAULTS.baseMutationChance * upgradeMult;

        // Fiona skill: Bermutasilah! (+5% base chance + upgrades)
        if (this.state.currentCharacter === 'fiona') {
            const charData = GAME_DATA.CHARACTERS.find(c => c.id === 'fiona');
            let bonus = charData.skill.value;
            const charLevel = (this.state.ownedCharacters.fiona && this.state.ownedCharacters.fiona.level) || 0;
            for (let i = 0; i < charLevel; i++) {
                bonus += charData.upgrades[i].bonus;
            }
            baseChance += bonus;
        }

        // Weather bonus
        const weatherObj = GAME_DATA.WEATHER.find(w => w.id === this.state.weather);
        if (weatherObj && weatherObj.mutationBonus) {
            baseChance += weatherObj.mutationBonus;
        }

        return Math.min(0.85, baseChance);
    }

    getCoinMultiplier() {
        const upgradeLevel = this.state.upgrades.coin_multiplier || 0;
        let mult = GAME_DATA.UPGRADES.coin_multiplier.levels[upgradeLevel].value;

        // William skill: Be Rich (+40% coin + upgrades)
        if (this.state.currentCharacter === 'william') {
            const charData = GAME_DATA.CHARACTERS.find(c => c.id === 'william');
            let bonus = charData.skill.value;
            const charLevel = (this.state.ownedCharacters.william && this.state.ownedCharacters.william.level) || 0;
            for (let i = 0; i < charLevel; i++) {
                bonus += charData.upgrades[i].bonus;
            }
            mult += bonus;
        }

        return mult;
    }

    getExpMultiplier() {
        let mult = 1.0;

        // Iris skill: Super Levelling (+40% EXP + upgrades)
        if (this.state.currentCharacter === 'iris') {
            const charData = GAME_DATA.CHARACTERS.find(c => c.id === 'iris');
            let bonus = charData.skill.value;
            const charLevel = (this.state.ownedCharacters.iris && this.state.ownedCharacters.iris.level) || 0;
            for (let i = 0; i < charLevel; i++) {
                bonus += charData.upgrades[i].bonus;
            }
            mult += bonus;
        }

        return mult;
    }

    recalculateMaxStats() {
        this.state.maxStamina = this.getMaxStamina();
        if (this.state.stamina > this.state.maxStamina) {
            this.state.stamina = this.state.maxStamina;
        }
    }

    // ── DAY & NIGHT CYCLE ──────────────────────────────────────

    startDayNightCycle() {
        if (this.gameTickInterval) clearInterval(this.gameTickInterval);

        this.lastTickTime = Date.now();
        this.gameTickInterval = setInterval(() => {
            this.tick();
        }, 1000);
    }

    stopDayNightCycle() {
        if (this.gameTickInterval) {
            clearInterval(this.gameTickInterval);
            this.gameTickInterval = null;
        }
    }

    tick() {
        const now = Date.now();
        const delta = (now - this.lastTickTime) / 1000;
        this.lastTickTime = now;

        // Speed multiplier: fast mode accelerates time 10x for testing/quick play
        const speed = this.settings.fastMode ? 10 : 1;
        const totalDayDuration = GAME_DATA.DEFAULTS.dayDuration + GAME_DATA.DEFAULTS.nightDuration; // 1200 seconds (20 min)

        this.state.timeOfDaySeconds = (this.state.timeOfDaySeconds + (delta * speed)) % totalDayDuration;

        // Check if Night phase (after 600s)
        const isNight = this.state.timeOfDaySeconds >= GAME_DATA.DEFAULTS.dayDuration;

        if (isNight && this.fishingState !== 'idle') {
            // Passive stamina drain during late night
            const weatherDrain = (GAME_DATA.WEATHER.find(w => w.id === this.state.weather) || {}).staminaDrain || 0;
            const drainRate = (GAME_DATA.DEFAULTS.staminaDrainRate + Math.abs(weatherDrain)) * delta * speed;
            this.state.stamina = Math.max(0, this.state.stamina - drainRate);

            if (this.state.stamina <= 15 && this.onFatigueWarning) {
                this.onFatigueWarning();
            }
        }

        if (this.onTimeUpdate) {
            this.onTimeUpdate(this.getTimeInfo());
        }
    }

    getTimeInfo() {
        const total = GAME_DATA.DEFAULTS.dayDuration + GAME_DATA.DEFAULTS.nightDuration; // 1200s
        const sec = this.state.timeOfDaySeconds;
        const dayDuration = GAME_DATA.DEFAULTS.dayDuration; // 600s

        let phase = 'morning'; // morning, afternoon, evening, night
        let isNight = false;

        if (sec < 250) {
            phase = 'morning';
        } else if (sec < dayDuration - 100) {
            phase = 'afternoon';
        } else if (sec < dayDuration + 100) {
            phase = 'sunset';
        } else {
            phase = 'night';
            isNight = true;
        }

        // Virtual 24h clock representation
        const virtualHours = Math.floor((sec / total) * 24);
        const virtualMinutes = Math.floor(((sec / total) * 24 * 60) % 60);
        const timeFormatted = `${String(virtualHours).padStart(2, '0')}:${String(virtualMinutes).padStart(2, '0')}`;

        return {
            phase,
            isNight,
            timeFormatted,
            percentOfDay: (sec / total) * 100,
            seconds: sec
        };
    }

    // ── FISHING MECHANICS ──────────────────────────────────────

    castLine() {
        if (this.fishingState !== 'idle') return false;

        // Check stamina
        if (this.state.stamina < GAME_DATA.DEFAULTS.staminaPerCast) {
            return { error: 'tired' };
        }

        // Check bag capacity
        if (this.state.bag.length >= this.getMaxBagCapacity()) {
            return { error: 'bag_full' };
        }

        // Deduct stamina
        this.state.stamina = Math.max(0, this.state.stamina - GAME_DATA.DEFAULTS.staminaPerCast);
        this.fishingState = 'waiting';

        audio.playCast();

        // Calculate bite delay (2 to 5 seconds, reduced by rod speed)
        const rodSpeed = this.getRodSpeedMultiplier();
        const baseWait = (Math.random() * 2.5 + 2.0) / rodSpeed;

        this.biteTimer = setTimeout(() => {
            this.onFishBite();
        }, baseWait * 1000);

        return { success: true };
    }

    onFishBite() {
        if (this.fishingState !== 'waiting') return;

        this.fishingState = 'bite';
        audio.playBite();

        // Prepare the fish before minigame starts
        this.currentPendingFish = this.rollFish();
        this.currentPendingMutation = this.rollMutation(this.currentPendingFish);

        // Adjust minigame difficulty based on fish rarity
        const rarity = this.currentPendingFish.rarity;
        let baseSpeed = 2.2;
        if (rarity === 'rare') baseSpeed = 2.6;
        if (rarity === 'epic') baseSpeed = 3.0;
        if (rarity === 'legendary') baseSpeed = 3.5;
        if (rarity === 'mythic') baseSpeed = 4.2;
        if (rarity === 'transcendent') baseSpeed = 4.8;
        if (rarity === 'omega') baseSpeed = 5.5;

        this.minigameSpeed = baseSpeed;
        this.minigamePos = 10;
        this.minigameDir = 1;

        if (this.onBite) {
            this.onBite({
                fish: this.currentPendingFish,
                mutation: this.currentPendingMutation
            });
        }

        this.startMinigame();
    }

    startMinigame() {
        this.fishingState = 'minigame';
        const fps = 60;
        const intervalMs = 1000 / fps;

        if (this.minigameTimer) clearInterval(this.minigameTimer);

        this.minigameTimer = setInterval(() => {
            this.minigamePos += this.minigameDir * this.minigameSpeed;
            if (this.minigamePos >= 95) {
                this.minigamePos = 95;
                this.minigameDir = -1;
            } else if (this.minigamePos <= 5) {
                this.minigamePos = 5;
                this.minigameDir = 1;
            }

            if (this.onMinigameTick) {
                this.onMinigameTick(this.minigamePos);
            }
        }, intervalMs);

        // Auto-escape if player doesn't strike within 6 seconds
        this.escapeTimeout = setTimeout(() => {
            if (this.fishingState === 'minigame') {
                this.strikeFish(true); // Forced miss
            }
        }, 6000);
    }

    strikeFish(forceMiss = false) {
        if (this.fishingState !== 'minigame') return;

        clearInterval(this.minigameTimer);
        clearTimeout(this.escapeTimeout);

        const pos = this.minigamePos; // 0 to 100
        // Target Zones influenced by hookSensitivity (default 40: normal)
        const sens = this.settings.hookSensitivity || 40;
        const extraZone = (sens - 40) * 0.25; // Expands or tightens zone
        const isGreen = !forceMiss && (pos >= Math.max(10, 35 - extraZone) && pos <= Math.min(90, 75 + extraZone));
        const isPerfect = !forceMiss && (pos >= Math.max(15, 48 - extraZone * 0.5) && pos <= Math.min(85, 62 + extraZone * 0.5));

        this.isPerfectCatch = isPerfect;

        if (isGreen) {
            this.catchSuccess(isPerfect);
        } else {
            this.catchFail();
        }
    }

    catchSuccess(perfect = false) {
        this.fishingState = 'caught';
        const fish = this.currentPendingFish;
        const mutation = this.currentPendingMutation;

        // Combo system
        this.combo++;
        this.streak++;
        if (this.combo > this.state.stats.maxCombo) {
            this.state.stats.maxCombo = this.combo;
        }
        this.resetComboTimer();

        // Calculate Rewards
        const rarityData = GAME_DATA.RARITIES[fish.rarity];
        let baseCoins = Math.floor(Math.random() * (rarityData.coinMax - rarityData.coinMin + 1)) + rarityData.coinMin;
        let baseExp = Math.floor(Math.random() * (rarityData.xpMax - rarityData.xpMin + 1)) + rarityData.xpMin;

        // Mutation bonus
        let mutationMultiplier = 1;
        if (mutation) {
            mutationMultiplier = 1 + mutation.coinBonus;
        }

        // Multipliers
        const coinMult = this.getCoinMultiplier();
        const expMult = this.getExpMultiplier();
        const perfectBonus = perfect ? 1.5 : 1.0;

        const finalCoins = Math.floor(baseCoins * mutationMultiplier * coinMult * perfectBonus);
        const finalExp = Math.floor(baseExp * expMult * perfectBonus);

        // Create caught fish item for bag
        const caughtItem = {
            instanceId: 'fish_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
            fishId: fish.id,
            name: fish.name,
            nameEn: fish.nameEn,
            rarity: fish.rarity,
            map: fish.map,
            img: fish.img,
            hue: fish.hue,
            desc: fish.desc,
            mutation: mutation ? {
                id: mutation.id,
                name: mutation.name,
                color: mutation.color,
                coinBonus: mutation.coinBonus,
                icon: mutation.icon
            } : null,
            coins: finalCoins,
            exp: finalExp,
            caughtAt: new Date().toISOString()
        };

        // Add to bag
        this.state.bag.push(caughtItem);

        // Add EXP
        this.addExp(finalExp);

        // Update Catalog & Stats
        if (!this.state.caughtCatalog[fish.id]) {
            this.state.caughtCatalog[fish.id] = { count: 0, firstCaught: new Date().toISOString(), mutations: [] };
        }
        this.state.caughtCatalog[fish.id].count++;
        if (mutation && !this.state.caughtCatalog[fish.id].mutations.includes(mutation.id)) {
            this.state.caughtCatalog[fish.id].mutations.push(mutation.id);
        }

        this.state.stats.totalCatches++;
        this.state.stats.rarityCounts[fish.rarity] = (this.state.stats.rarityCounts[fish.rarity] || 0) + 1;

        if (mutation) {
            this.state.stats.mutationsFound++;
            this.state.stats.uniqueMutations[mutation.id] = true;
            audio.playMutation();
        } else {
            audio.playCatch(fish.rarity);
        }

        // Character Skill: Oliver (Lock-In)
        // Every 5 streak fish caught, restore 5% stamina (+ upgrades)
        if (this.state.currentCharacter === 'oliver') {
            const charData = GAME_DATA.CHARACTERS.find(c => c.id === 'oliver');
            let reqStreak = charData.skill.value; // 5
            let healPercent = 0.05;
            const charLevel = (this.state.ownedCharacters.oliver && this.state.ownedCharacters.oliver.level) || 0;
            if (charLevel >= 1) reqStreak += charData.upgrades[0].bonus; // 4
            if (charLevel >= 2) healPercent += charData.upgrades[1].bonus;
            if (charLevel >= 3) reqStreak += charData.upgrades[2].bonus; // 3
            if (charLevel >= 4) healPercent += charData.upgrades[3].bonus;

            if (this.streak >= reqStreak) {
                const healAmount = Math.floor(this.state.maxStamina * healPercent);
                this.state.stamina = Math.min(this.state.maxStamina, this.state.stamina + healAmount);
                this.streak = 0;
                if (this.onSkillActivated) {
                    this.onSkillActivated({ skill: 'Lock-In', desc: `+${healAmount} Stamina!` });
                }
            }
        }

        // Character Skill: Jaune (Bomb!)
        // Every 10x combo, throw bomb to catch extra fish!
        let bonusFishFromBomb = [];
        if (this.state.currentCharacter === 'jaune') {
            const charData = GAME_DATA.CHARACTERS.find(c => c.id === 'jaune');
            let reqCombo = charData.skill.value; // 10
            let bombCount = 4;
            const charLevel = (this.state.ownedCharacters.jaune && this.state.ownedCharacters.jaune.level) || 0;
            if (charLevel >= 1) reqCombo += charData.upgrades[0].bonus; // 9
            if (charLevel >= 2) reqCombo += charData.upgrades[1].bonus; // 8
            if (charLevel >= 3) bombCount += charData.upgrades[2].bonus; // 6
            if (charLevel >= 4) bombCount += charData.upgrades[3].bonus; // 9

            if (this.combo > 0 && this.combo % reqCombo === 0) {
                audio.playBomb();
                const availableSpace = this.getMaxBagCapacity() - this.state.bag.length;
                const actualCount = Math.min(bombCount, availableSpace);

                for (let b = 0; b < actualCount; b++) {
                    const extraFish = this.rollFish();
                    const extraMut = this.rollMutation(extraFish);
                    const extraItem = {
                        instanceId: 'fish_bomb_' + Date.now() + '_' + b,
                        fishId: extraFish.id,
                        name: extraFish.name,
                        nameEn: extraFish.nameEn,
                        rarity: extraFish.rarity,
                        map: extraFish.map,
                        img: extraFish.img,
                        hue: extraFish.hue,
                        desc: extraFish.desc,
                        mutation: extraMut ? {
                            id: extraMut.id,
                            name: extraMut.name,
                            color: extraMut.color,
                            coinBonus: extraMut.coinBonus,
                            icon: extraMut.icon
                        } : null,
                        coins: Math.floor(GAME_DATA.RARITIES[extraFish.rarity].coinMin * this.getCoinMultiplier()),
                        exp: Math.floor(GAME_DATA.RARITIES[extraFish.rarity].xpMin * this.getExpMultiplier()),
                        caughtAt: new Date().toISOString()
                    };
                    this.state.bag.push(extraItem);
                    bonusFishFromBomb.push(extraItem);
                    this.state.stats.totalCatches++;
                }

                if (this.onSkillActivated) {
                    this.onSkillActivated({ skill: 'Bomb!', count: actualCount, desc: `💥 Bom meledak! Mendapat +${actualCount} ikan!` });
                }
            }
        }

        // Check achievements
        this.checkAchievements();

        // Notify UI
        if (this.onCatch) {
            this.onCatch({
                success: true,
                fish: caughtItem,
                mutation,
                perfect,
                combo: this.combo,
                bombFish: bonusFishFromBomb
            });
        }

        // Auto-save periodically
        if (this.settings.autoSave && this.state.stats.totalCatches % 3 === 0) {
            storage.saveAutoSave(this.state);
        }
    }

    catchFail() {
        this.fishingState = 'caught';
        this.combo = 0;
        this.streak = 0;
        audio.playEscape();

        if (this.onCatch) {
            this.onCatch({
                success: false,
                fish: this.currentPendingFish
            });
        }
    }

    dismissCatch() {
        this.fishingState = 'idle';
        this.currentPendingFish = null;
        this.currentPendingMutation = null;
    }

    resetComboTimer() {
        if (this.comboTimer) clearTimeout(this.comboTimer);
        this.comboTimer = setTimeout(() => {
            this.combo = 0;
            if (this.onComboReset) this.onComboReset();
        }, GAME_DATA.DEFAULTS.comboTimeout * 1000);
    }

    // ── ROLLING ALGORITHMS ─────────────────────────────────────

    rollFish() {
        const currentMapIndex = this.state.currentMap;
        // Filter fish for current map
        const mapFish = GAME_DATA.FISH.filter(f => f.map === currentMapIndex);
        if (!mapFish.length) return GAME_DATA.FISH[0];

        const luck = this.getLuckMultiplier();

        // Calculate weighted pool
        const weights = mapFish.map(f => {
            const baseWeight = GAME_DATA.RARITIES[f.rarity].weight;
            // Higher luck increases weights of higher rarities
            if (f.rarity === 'common') return Math.max(5, baseWeight - (luck * 3));
            if (f.rarity === 'uncommon') return baseWeight;
            if (f.rarity === 'rare') return baseWeight * luck;
            if (f.rarity === 'epic') return baseWeight * (luck * 1.2);
            if (f.rarity === 'legendary') return baseWeight * (luck * 1.5);
            if (f.rarity === 'mythic') return baseWeight * (luck * 1.8);
            if (f.rarity === 'transcendent') return baseWeight * (luck * 2.2);
            if (f.rarity === 'omega') return baseWeight * (luck * 2.5);
            return baseWeight;
        });

        const totalWeight = weights.reduce((acc, w) => acc + w, 0);
        let randomRoll = Math.random() * totalWeight;

        for (let i = 0; i < mapFish.length; i++) {
            if (randomRoll <= weights[i]) {
                return mapFish[i];
            }
            randomRoll -= weights[i];
        }

        return mapFish[0];
    }

    rollMutation(fish) {
        const mutationChance = this.getMutationChance();
        const roll = Math.random();

        if (roll > mutationChance) return null; // Normal fish, not mutated

        // Mutated! Decide which mutation
        // First check special mutations:
        // Godly (0.001%), Prismana (0.1%), Galaxy (0.5%), Void (1%)
        const specialRoll = Math.random() * 100;

        if (specialRoll < 0.001) {
            return GAME_DATA.MUTATIONS.special.find(m => m.id === 'godly');
        } else if (specialRoll < 0.1) {
            return GAME_DATA.MUTATIONS.special.find(m => m.id === 'prismana');
        } else if (specialRoll < 0.5) {
            return GAME_DATA.MUTATIONS.special.find(m => m.id === 'galaxy');
        } else if (specialRoll < 1.0) {
            return GAME_DATA.MUTATIONS.special.find(m => m.id === 'void');
        }

        // Otherwise pick from normal mutations pool based on their chance weights
        const normals = GAME_DATA.MUTATIONS.normal;
        const totalWeight = normals.reduce((acc, n) => acc + n.chance, 0);
        let normRoll = Math.random() * totalWeight;

        for (let i = 0; i < normals.length; i++) {
            if (normRoll <= normals[i].chance) {
                return normals[i];
            }
            normRoll -= normals[i].chance;
        }

        return normals[0];
    }

    // ── LEVEL & EXP ────────────────────────────────────────────

    addExp(amount) {
        this.state.exp += amount;
        const reqExp = this.getRequiredExp(this.state.level);

        while (this.state.exp >= reqExp) {
            this.state.exp -= reqExp;
            this.state.level++;
            audio.playLevelUp();

            if (this.onLevelUp) {
                this.onLevelUp(this.state.level);
            }

            // Check map unlocks based on level
            this.checkMapUnlocks();
        }
    }

    getRequiredExp(level) {
        if (level < GAME_DATA.LEVEL_XP.length) {
            return GAME_DATA.LEVEL_XP[level];
        }
        return Math.floor(50 + (level * 35) + (level * level * 3));
    }

    checkMapUnlocks() {
        GAME_DATA.MAPS.forEach((map, index) => {
            if (this.state.level >= map.levelReq && !this.state.unlockedMaps.includes(index)) {
                this.state.unlockedMaps.push(index);
                if (this.onMapUnlocked) {
                    this.onMapUnlocked(map);
                }
            }
        });
    }

    // ── HOME ACTIVITIES ────────────────────────────────────────

    sleep() {
        this.state.day++;
        this.state.stats.daysPassed++;
        this.state.timeOfDaySeconds = 0;
        this.recalculateMaxStats();
        this.state.stamina = this.state.maxStamina;

        // Check Sarah skill (Weather control)
        const canControlWeather = this.canSarahControlWeather();

        if (!canControlWeather) {
            this.rollNextWeather();
        }

        storage.saveAutoSave(this.state);
        return {
            newDay: this.state.day,
            canControlWeather
        };
    }

    canSarahControlWeather() {
        if (this.state.currentCharacter !== 'sarah') return false;
        const charData = GAME_DATA.CHARACTERS.find(c => c.id === 'sarah');
        let daysReq = charData.skill.value; // 3
        const charLevel = (this.state.ownedCharacters.sarah && this.state.ownedCharacters.sarah.level) || 0;
        if (charLevel >= 1) daysReq += charData.upgrades[0].bonus; // 2
        if (charLevel >= 3) daysReq += charData.upgrades[2].bonus; // 1

        return this.state.day % daysReq === 0;
    }

    setWeather(weatherId) {
        const found = GAME_DATA.WEATHER.find(w => w.id === weatherId);
        if (found) {
            this.state.weather = weatherId;
            return true;
        }
        return false;
    }

    rollNextWeather() {
        const weathers = GAME_DATA.WEATHER;
        const total = weathers.reduce((acc, w) => acc + w.weight, 0);
        let roll = Math.random() * total;

        for (let i = 0; i < weathers.length; i++) {
            if (roll <= weathers[i].weight) {
                this.state.weather = weathers[i].id;
                return;
            }
            roll -= weathers[i].weight;
        }
        this.state.weather = 'sunny';
    }

    sellFish(instanceIds) {
        if (!instanceIds || !instanceIds.length) return 0;

        let totalGained = 0;
        const remaining = [];

        this.state.bag.forEach(item => {
            if (instanceIds.includes(item.instanceId)) {
                totalGained += item.coins;
                this.state.stats.totalFishSold++;
            } else {
                remaining.push(item);
            }
        });

        this.state.bag = remaining;
        this.state.coins += totalGained;
        this.state.stats.totalCoinsEarned += totalGained;

        audio.playCoin();
        this.checkAchievements();
        storage.saveAutoSave(this.state);

        return totalGained;
    }

    storeFishInAquarium(instanceIds) {
        if (!instanceIds || !instanceIds.length) return false;

        const remaining = [];
        this.state.bag.forEach(item => {
            if (instanceIds.includes(item.instanceId)) {
                this.state.aquarium.push(item);
            } else {
                remaining.push(item);
            }
        });

        this.state.bag = remaining;
        storage.saveAutoSave(this.state);
        return true;
    }

    buyUpgrade(upgradeType) {
        const upgradeDef = GAME_DATA.UPGRADES[upgradeType];
        if (!upgradeDef) return { error: 'invalid_upgrade' };

        const currentLvl = this.state.upgrades[upgradeType] || 0;
        const nextLvl = currentLvl + 1;

        if (nextLvl >= upgradeDef.levels.length) {
            return { error: 'max_level' };
        }

        const cost = upgradeDef.levels[nextLvl].cost;
        if (this.state.coins < cost) {
            return { error: 'not_enough_coins' };
        }

        this.state.coins -= cost;
        this.state.upgrades[upgradeType] = nextLvl;
        this.recalculateMaxStats();

        audio.playUpgrade();
        storage.saveAutoSave(this.state);

        return { success: true, newLevel: nextLvl };
    }

    buyCharacter(charId) {
        const charDef = GAME_DATA.CHARACTERS.find(c => c.id === charId);
        if (!charDef) return { error: 'invalid_character' };

        if (this.state.ownedCharacters[charId]) {
            return { error: 'already_owned' };
        }

        if (this.state.coins < charDef.price) {
            return { error: 'not_enough_coins' };
        }

        this.state.coins -= charDef.price;
        this.state.ownedCharacters[charId] = { level: 0 };
        this.state.currentCharacter = charId;
        this.recalculateMaxStats();

        audio.playUpgrade();
        storage.saveAutoSave(this.state);

        return { success: true };
    }

    equipCharacter(charId) {
        if (!this.state.ownedCharacters[charId]) {
            return { error: 'not_owned' };
        }
        this.state.currentCharacter = charId;
        this.recalculateMaxStats();
        storage.saveAutoSave(this.state);
        return { success: true };
    }

    upgradeCharacter(charId) {
        const charDef = GAME_DATA.CHARACTERS.find(c => c.id === charId);
        if (!charDef || !this.state.ownedCharacters[charId]) return { error: 'not_owned' };

        const currentLvl = this.state.ownedCharacters[charId].level || 0;
        if (currentLvl >= charDef.upgrades.length) {
            return { error: 'max_level' };
        }

        const cost = charDef.upgrades[currentLvl].cost;
        if (this.state.coins < cost) {
            return { error: 'not_enough_coins' };
        }

        this.state.coins -= cost;
        this.state.ownedCharacters[charId].level = currentLvl + 1;
        this.recalculateMaxStats();

        audio.playUpgrade();
        storage.saveAutoSave(this.state);

        return { success: true, newLevel: currentLvl + 1 };
    }

    selectMap(mapIndex) {
        if (!this.state.unlockedMaps.includes(mapIndex)) {
            return { error: 'locked' };
        }
        this.state.currentMap = mapIndex;
        storage.saveAutoSave(this.state);
        return { success: true };
    }

    // ── ACHIEVEMENTS ──────────────────────────────────────────

    checkAchievements() {
        GAME_DATA.ACHIEVEMENTS.forEach(ach => {
            if (this.state.unlockedAchievements.includes(ach.id)) return;

            let conditionMet = false;
            const cond = ach.condition;

            if (cond.type === 'total_catch') {
                conditionMet = this.state.stats.totalCatches >= cond.value;
            } else if (cond.type === 'unique_fish') {
                const uniqueCount = Object.keys(this.state.caughtCatalog).length;
                conditionMet = uniqueCount >= cond.value;
            } else if (cond.type === 'maps_unlocked') {
                conditionMet = this.state.unlockedMaps.length >= cond.value;
            } else if (cond.type === 'mutations_found') {
                const mutCount = Object.keys(this.state.stats.uniqueMutations).length;
                conditionMet = mutCount >= cond.value;
            } else if (cond.type === 'rarity_caught') {
                conditionMet = (this.state.stats.rarityCounts[cond.value] || 0) > 0;
            } else if (cond.type === 'total_coins_earned') {
                conditionMet = this.state.stats.totalCoinsEarned >= cond.value;
            } else if (cond.type === 'level') {
                conditionMet = this.state.level >= cond.value;
            } else if (cond.type === 'specific_mutation') {
                conditionMet = !!this.state.stats.uniqueMutations[cond.value];
            } else if (cond.type === 'fish_from_map') {
                conditionMet = Object.values(this.state.caughtCatalog).some(cat => {
                    const fish = GAME_DATA.FISH.find(f => f.id === cat.fishId);
                    return fish && fish.map === cond.value;
                });
            }

            if (conditionMet) {
                this.state.unlockedAchievements.push(ach.id);
                this.state.coins += ach.reward;
                if (this.onAchievementUnlocked) {
                    this.onAchievementUnlocked(ach);
                }
            }
        });
    }
}

const game = new MoishGame();

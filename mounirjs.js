document.addEventListener("DOMContentLoaded", () => {
    // === DONNÉES UTILISATEUR ===
    let user = JSON.parse(localStorage.getItem("hbUser")) || {
        name: "Utilisateur",
        email: "",
        joinDate: new Date().toLocaleDateString("fr-FR"),
        testsCompleted: 0,
        bestReaction: Infinity,
        bestNumber: 4,
        bestTyping: 0,
        bestAim: 0
    };

    function saveUser() {
        localStorage.setItem("hbUser", JSON.stringify(user));
        updateOverview();
        updateProfile();
        if (document.getElementById("leaderboardSection").classList.contains("active")) {
            updateLeaderboard(currentLeaderboardTab);
        }
    }

    function updateOverview() {
        document.getElementById("bestReaction").innerText = user.bestReaction === Infinity ? "-- ms" : user.bestReaction + " ms";
        document.getElementById("bestNumber").innerText = user.bestNumber > 4 ? user.bestNumber + " chiffres" : "--";
        document.getElementById("bestTyping").innerText = user.bestTyping > 0 ? user.bestTyping + " MPM" : "-- MPM";
        document.getElementById("bestAim").innerText = user.bestAim > 0 ? user.bestAim : "--";
    }

    function updateProfile() {
        document.getElementById("userName").innerText = user.name;
        document.getElementById("profileName").innerText = user.name;
        document.getElementById("profileEmail").innerText = user.email || "Non renseigné";
        document.getElementById("testsCount").innerText = user.testsCompleted;
        document.getElementById("joinDate").innerText = user.joinDate;
        document.getElementById("profileReaction").innerText = user.bestReaction === Infinity ? "-- ms" : user.bestReaction + " ms";
        document.getElementById("profileNumber").innerText = user.bestNumber > 4 ? user.bestNumber + " chiffres" : "--";
        document.getElementById("profileTyping").innerText = user.bestTyping > 0 ? user.bestTyping + " MPM" : "-- MPM";
        document.getElementById("profileAim").innerText = user.bestAim > 0 ? user.bestAim : "--";
    }

    updateOverview();
    updateProfile();

    // === LOGIN / REGISTER ===
    document.getElementById("loginForm").onsubmit = e => {
        e.preventDefault();
        document.getElementById("loginPage").classList.remove("active");
        document.getElementById("dashboardPage").classList.add("active");
    };

    document.getElementById("registerForm").onsubmit = e => {
        e.preventDefault();
        user.name = document.getElementById("registerName").value.trim() || "Utilisateur";
        user.email = document.getElementById("registerEmail").value;
        user.joinDate = new Date().toLocaleDateString("fr-FR");
        saveUser();
        document.getElementById("loginPage").classList.remove("active");
        document.getElementById("dashboardPage").classList.add("active");
    };

    window.switchTab = tab => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".form").forEach(f => f.classList.remove("active"));
        document.querySelector(tab === "login" ? ".tab:first-child" : ".tab:last-child").classList.add("active");
        document.getElementById(tab + "Form").classList.add("active");
    };

    window.logout = () => location.reload();

    window.showSection = section => {
        document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
        document.querySelectorAll(".menu-item").forEach(m => m.classList.remove("active"));
        document.getElementById(section + "Section").classList.add("active");
        document.querySelector(`[onclick="showSection('${section}')"]`).classList.add("active");
        closeTest();

        if (section === "leaderboard") {
            showLeaderboardTab("reaction");
        }
    };

    // === TESTS PLEIN ÉCRAN ===
    window.startTest = test => {
        document.querySelector(".tests-grid").style.display = "none";
        document.querySelector("#testsSection h2").style.display = "none";
        document.getElementById("testArea").classList.add("active");
        document.querySelectorAll(".test-content").forEach(c => c.classList.remove("active"));
        document.getElementById(test + "Test").classList.add("active");

        if (test === "reaction") setupReaction();
        if (test === "number") setupNumber();
        if (test === "typing") setupTyping();
        if (test === "aim") setupAim();
    };

    window.closeTest = () => {
        document.getElementById("testArea").classList.remove("active");
        document.querySelector(".tests-grid").style.display = "grid";
        document.querySelector("#testsSection h2").style.display = "block";
    };

    // === FAKE PLAYERS POUR LE CLASSEMENT ===
    const fakePlayers = [
        { name: "EmmaQuick", bestReaction: 159, bestNumber: 8, bestTyping: 165, bestAim: 49 },
        { name: "NinaSpeed", bestReaction: 165, bestNumber: 8, bestTyping: 158, bestAim: 52 },
        { name: "LeoMaster", bestReaction: 172, bestNumber: 9, bestTyping: 152, bestAim: 50 },
        { name: "AlexPro", bestReaction: 178, bestNumber: 9, bestTyping: 142, bestAim: 48 },
        { name: "ZoeBrain", bestReaction: 188, bestNumber: 12, bestTyping: 140, bestAim: 42 },
        { name: "SaraClick", bestReaction: 185, bestNumber: 7, bestTyping: 148, bestAim: 55 },
        { name: "MaxFocus", bestReaction: 192, bestNumber: 10, bestTyping: 135, bestAim: 45 },
        { name: "TomPrecision", bestReaction: 201, bestNumber: 11, bestTyping: 128, bestAim: 58 }
    ];

    let currentLeaderboardTab = "reaction";

    window.showLeaderboardTab = function(tab) {
        currentLeaderboardTab = tab;
        document.querySelectorAll(".leaderboard-tab").forEach(t => t.classList.remove("active"));
        document.querySelector(`[onclick="showLeaderboardTab('${tab}')"]`).classList.add("active");
        updateLeaderboard(tab);
    };

    function updateLeaderboard(type) {
        const container = document.getElementById("leaderboardTable");
        let players = [...fakePlayers];

        // Ajouter le joueur actuel s'il a un score
        const hasScore = type === "reaction" ? user.bestReaction < Infinity :
                         type === "number" ? user.bestNumber > 4 :
                         type === "typing" ? user.bestTyping > 0 : user.bestAim > 0;

        if (hasScore) {
            players.push({
                name: user.name,
                bestReaction: user.bestReaction,
                bestNumber: user.bestNumber,
                bestTyping: user.bestTyping,
                bestAim: user.bestAim
            });
        }

        // Tri
        players.sort((a, b) => {
            if (type === "reaction") {
                return (a.bestReaction || Infinity) - (b.bestReaction || Infinity);
            }
            const key = "best" + type.charAt(0).toUpperCase() + type.slice(1);
            return (b[key] || 0) - (a[key] || 0);
        });

        players = players.slice(0, 10);

        let html = `
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rang</th>
                        <th>Joueur</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
        `;

        players.forEach((p, i) => {
            let score;
            if (type === "reaction") score = p.bestReaction === Infinity ? "--" : p.bestReaction + " ms";
            else if (type === "number") score = p.bestNumber > 4 ? p.bestNumber + " chiffres" : "--";
            else if (type === "typing") score = p.bestTyping > 0 ? p.bestTyping + " MPM" : "-- MPM";
            else score = p.bestAim > 0 ? p.bestAim : "--";

            const rankClass = i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";
            const isYou = p.name === user.name ? " (Vous)" : "";

            html += `
                <tr>
                    <td class="leaderboard-rank ${rankClass}">#${i + 1}</td>
                    <td class="leaderboard-name">${p.name}${isYou}</td>
                    <td class="leaderboard-score">${score}</td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
    }

    // === REACTION TEST ===
    function setupReaction() {
        const container = document.getElementById("reactionTest");
        container.innerHTML = `
            <h1 style="color:#667eea;margin-bottom:30px;">⚡ Reaction Test</h1>
            <p>Cliquez le plus vite possible quand le fond devient vert !</p>
            <div id="reactionBox" class="reaction-box red">Cliquez pour commencer</div>
            <div id="reactionResult" class="result-display"></div>
        `;

        const box = container.querySelector("#reactionBox");
        const result = container.querySelector("#reactionResult");
        let startTime, timeout;

        box.onclick = () => {
            if (box.classList.contains("red")) {
                box.innerText = "Attendez le vert...";
                timeout = setTimeout(() => {
                    box.className = "reaction-box green";
                    box.innerText = "CLIQUEZ !";
                    startTime = Date.now();
                }, Math.random() * 3000 + 2000);
            } else if (box.classList.contains("green")) {
                const time = Date.now() - startTime;
                box.className = "reaction-box blue";
                box.innerText = time + " ms";
                result.innerHTML = time < 250 ? "⚡ Excellent !" : "Bien joué !";

                if (time < user.bestReaction) {
                    user.bestReaction = time;
                    result.innerHTML += "<br><strong style='color:#2ecc71;'>Nouveau record !</strong>";
                }
                user.testsCompleted++;
                saveUser();
            } else {
                box.className = "reaction-box red";
                box.innerText = "Recommencer";
                result.innerHTML = "";
            }
        };
    }

    // === NUMBER MEMORY (version corrigée) ===
        // === NUMBER MEMORY avec barre de progression ===
    function setupNumber() {
        const container = document.getElementById("numberTest");
        container.innerHTML = `
            <h1 style="color:#667eea;margin-bottom:20px;">🔢 Number Memory</h1>
            <p style="margin-bottom:30px;">Mémorisez le nombre affiché pendant quelques secondes</p>
            
            <!-- Barre de progression -->
            <div class="progress-container">
                <div class="progress-label">Niveau ${user.bestNumber} / 20</div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" id="progressFill"></div>
                </div>
                <div class="progress-text" id="progressText">${user.bestNumber} chiffres maîtrisés</div>
            </div>

            <div id="numberDisplay" class="number-display">Cliquez sur "Commencer"</div>
            <input type="text" id="numberInput" class="number-input" placeholder="Entrez le nombre ici">
            <button class="btn-primary" id="startBtn">Commencer</button>
            <div id="numberResult" class="result-display" style="font-size:1.8em; margin-top:30px; min-height:60px;"></div>
        `;

        let currentNumber = "";
        let currentLevel = user.bestNumber;

        const display = container.querySelector("#numberDisplay");
        const input = container.querySelector("#numberInput");
        const btn = container.querySelector("#startBtn");
        const result = container.querySelector("#numberResult");
        const progressFill = container.querySelector("#progressFill");
        const progressText = container.querySelector("#progressText");

        // Mise à jour de la barre de progression
        function updateProgress() {
            const percentage = Math.min((user.bestNumber / 20) * 100, 100);
            progressFill.style.width = percentage + "%";
            progressText.innerText = `${user.bestNumber} chiffres maîtrisés`;
            container.querySelector(".progress-label").innerText = `Niveau ${user.bestNumber} / 20`;
        }

        updateProgress();

        function resetForNewTest() {
            input.value = "";
            input.style.display = "none";
            result.innerHTML = "";
            display.innerText = "Cliquez sur 'Commencer'";
            btn.style.display = "block";
            btn.innerText = "Commencer";
        }

        resetForNewTest();

        btn.onclick = () => {
            const min = Math.pow(10, currentLevel - 1);
            const max = Math.pow(10, currentLevel) - 1;
            currentNumber = Math.floor(Math.random() * (max - min + 1)) + min;

            display.innerText = currentNumber;
            btn.style.display = "none";
            input.value = "";
            input.style.display = "none";
            result.innerHTML = "";

            const displayTime = 1500 + currentLevel * 300;

            setTimeout(() => {
                display.innerText = "?";
                input.style.display = "block";
                input.focus();
            }, displayTime);
        };

        input.onkeydown = e => {
            if (e.key === "Enter") {
                const answer = input.value.trim();

                if (answer === currentNumber.toString()) {
                    result.innerHTML = `
                        <strong style="color:#2ecc71; font-size:2em;">✔ Correct ! Excellent !</strong><br><br>
                        <span style="color:#2ecc71; font-size:1.6em;">Niveau ${currentLevel + 1} débloqué ! 🎉</span>
                    `;
                    user.bestNumber = currentLevel + 1;
                    updateProgress(); // Anime la progression
                } else {
                    result.innerHTML = `
                        <strong style="color:#e74c3c; font-size:2em;">✘ Incorrect</strong><br><br>
                        <span style="font-size:1.4em;">Le nombre était : <strong>${currentNumber}</strong></span>
                    `;
                }

                user.testsCompleted++;
                saveUser();

                btn.style.display = "block";
                btn.innerText = "Rejouer";
                input.style.display = "none";
            }
        };
    }

    // === TYPING TEST ===
    function setupTyping() {
        const paragraphs = [
            "La technologie évolue rapidement et transforme notre quotidien de façon spectaculaire.",
            "Le soleil se lève chaque matin à l'est et offre une lumière magnifique sur le monde.",
            "Apprendre une nouvelle compétence demande de la patience et de la persévérance.",
            "Les montagnes majestueuses dominent le paysage et inspirent l'aventure.",
            "La musique a le pouvoir unique de toucher nos émotions les plus profondes."
        ];
        const text = paragraphs[Math.floor(Math.random() * paragraphs.length)];

        const container = document.getElementById("typingTest");
        container.innerHTML = `
            <h1 style="color:#667eea;margin-bottom:30px;">⌨️ Typing Test</h1>
            <div id="textToType" class="typing-text"></div>
            <input type="text" id="typingInput" class="typing-input" placeholder="Commencez à taper ici..." autocomplete="off">
            <div id="typingStats" class="typing-stats">
                <div class="typing-stat"><div class="typing-stat-value" id="wpm">0</div><div class="typing-stat-label">MPM</div></div>
                <div class="typing-stat"><div class="typing-stat-value" id="accuracy">100</div><div class="typing-stat-label">Précision %</div></div>
                <div class="typing-stat"><div class="typing-stat-value" id="timer">0</div><div class="typing-stat-label">Secondes</div></div>
            </div>
            <div id="typingResult" class="result-display"></div>
        `;

        const textEl = container.querySelector("#textToType");
        textEl.innerHTML = text.split('').map(c => `<span>${c === ' ' ? '&nbsp;' : c}</span>`).join('');

        const input = container.querySelector("#typingInput");
        const stats = container.querySelector("#typingStats");
        const wpmEl = container.querySelector("#wpm");
        const accEl = container.querySelector("#accuracy");
        const timerEl = container.querySelector("#timer");
        const result = container.querySelector("#typingResult");

        let startTime = null;
        let interval = null;

        input.oninput = () => {
            if (!startTime) {
                startTime = Date.now();
                stats.style.display = "grid";
                interval = setInterval(() => {
                    const elapsed = (Date.now() - startTime) / 1000;
                    timerEl.innerText = elapsed.toFixed(1);

                    const words = input.value.trim().split(/\s+/).filter(w => w).length;
                    wpmEl.innerText = elapsed > 0 ? Math.round((words / elapsed) * 60) : 0;

                    let correct = 0;
                    for (let i = 0; i < input.value.length; i++) {
                        if (input.value[i] === text[i]) correct++;
                    }
                    accEl.innerText = input.value.length ? Math.round((correct / input.value.length) * 100) : 100;
                }, 100);
            }

            const spans = textEl.querySelectorAll("span");
            spans.forEach((span, i) => {
                if (i < input.value.length) {
                    span.style.color = input.value[i] === text[i] ? "#2ecc71" : "#e74c3c";
                    span.style.backgroundColor = i === input.value.length - 1 ? "#ffff99" : "transparent";
                } else {
                    span.style.color = "#333";
                    span.style.backgroundColor = "transparent";
                }
            });
        };

        input.onkeydown = e => {
            if (e.key === "Enter" && startTime) {
                clearInterval(interval);
                const finalWpm = wpmEl.innerText;
                if (finalWpm > user.bestTyping) {
                    user.bestTyping = finalWpm;
                    result.innerHTML += "<br><strong style='color:#2ecc71;'>Nouveau record de vitesse !</strong>";
                }
                result.innerHTML = `<strong style="font-size:1.8em;">Test terminé !</strong><br>Vitesse : <strong>${finalWpm} MPM</strong><br>Précision : <strong>${accEl.innerText}%</strong>`;
                user.testsCompleted++;
                saveUser();
                input.disabled = true;
            }
        };
    }

    // === AIM TRAINER ===
    function setupAim() {
        const container = document.getElementById("aimTest");
        container.innerHTML = `
            <h1 style="color:#667eea;margin-bottom:30px;">🎯 Aim Trainer</h1>
            <p>Cliquez sur les cibles rouges • 30 secondes</p>
            <div id="aimArea" class="aim-area"></div>
            <div class="aim-stats">
                <div class="aim-stat"><div class="aim-stat-value" id="score">0</div><div class="aim-stat-label">Score</div></div>
                <div class="aim-stat"><div class="aim-stat-value" id="timeLeft">30</div><div class="aim-stat-label">Temps</div></div>
                <div class="aim-stat"><div class="aim-stat-value" id="avgTime">0</div><div class="aim-stat-label">Moyenne ms</div></div>
            </div>
        `;

        const area = container.querySelector("#aimArea");
        const scoreEl = container.querySelector("#score");
        const timeEl = container.querySelector("#timeLeft");
        const avgEl = container.querySelector("#avgTime");

        let score = 0, hits = 0, totalTime = 0, remaining = 30;
        let timer = setInterval(() => {
            remaining--;
            timeEl.innerText = remaining;
            if (remaining <= 0) {
                clearInterval(timer);
                area.innerHTML = `<div style="padding:150px;font-size:2em;color:#667eea;">Test terminé !<br>Score final : ${score}</div>`;
                if (score > user.bestAim) {
                    user.bestAim = score;
                    area.innerHTML += "<br><strong style='color:#2ecc71;'>Nouveau record !</strong>";
                }
                user.testsCompleted++;
                saveUser();
            }
        }, 1000);

        function spawnTarget() {
            if (remaining <= 0) return;
            const target = document.createElement("div");
            target.className = "target";
            const size = 40 + Math.random() * 40;
            target.style.width = target.style.height = size + "px";
            target.style.left = Math.random() * (area.clientWidth - size) + "px";
            target.style.top = Math.random() * (area.clientHeight - size) + "px";

            const clickTime = Date.now();
            target.onclick = () => {
                const reaction = Date.now() - clickTime;
                totalTime += reaction;
                hits++;
                score++;
                scoreEl.innerText = score;
                avgEl.innerText = hits ? Math.round(totalTime / hits) : 0;
                target.remove();
                spawnTarget();
            };

            setTimeout(() => target.parentElement && target.remove() && spawnTarget(), 1600);
            area.appendChild(target);
        }
        spawnTarget();
    }
});

    // === PROTECTION ANTI-COPIE AVANCÉE ===
    // Désactive Ctrl+C, Ctrl+A, Ctrl+X, Ctrl+V (sauf dans les inputs)
    document.addEventListener("keydown", e => {
        if (e.ctrlKey || e.metaKey) {
            const activeEl = document.activeElement;
            const isInput = activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA";
            
            if (!isInput && (e.key === "c" || e.key === "a" || e.key === "x" || e.key === "v" || e.key === "s")) {
                e.preventDefault();
            }
        }
    });

    // Désactive complètement le menu contextuel (clic droit)
    document.addEventListener("contextmenu", e => {
        e.preventDefault();
    });

    // Empêche le drag & drop des images/texte
    document.addEventListener("dragstart", e => {
        e.preventDefault();
    });

    // Empêche la copie via le menu (au cas où)
    document.addEventListener("copy", e => {
        const activeEl = document.activeElement;
        const isInput = activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA";
        if (!isInput) e.preventDefault();
    });
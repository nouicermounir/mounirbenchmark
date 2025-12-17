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
        bestAim: 0,
        bestChimp: 4,
        bestVisual: 3,
        bestVerbal: 0
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
        document.getElementById("welcomeName").innerText = user.name;
        document.getElementById("bestReaction").innerText = user.bestReaction === Infinity ? "-- ms" : user.bestReaction + " ms";
        document.getElementById("bestNumber").innerText = user.bestNumber > 4 ? user.bestNumber + " chiffres" : "--";
        document.getElementById("bestTyping").innerText = user.bestTyping > 0 ? user.bestTyping + " MPM" : "-- MPM";
        document.getElementById("bestAim").innerText = user.bestAim > 0 ? user.bestAim : "--";
        document.getElementById("bestChimp").innerText = user.bestChimp > 4 ? user.bestChimp : "--";
        document.getElementById("bestVisual").innerText = user.bestVisual > 3 ? user.bestVisual : "--";
        document.getElementById("bestVerbal").innerText = user.bestVerbal > 0 ? user.bestVerbal : "--";
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
        document.getElementById("profileChimp").innerText = user.bestChimp > 4 ? user.bestChimp : "--";
        document.getElementById("profileVisual").innerText = user.bestVisual > 3 ? user.bestVisual : "--";
        document.getElementById("profileVerbal").innerText = user.bestVerbal > 0 ? user.bestVerbal : "--";
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
        if (test === "chimp") setupChimp();
        if (test === "visual") setupVisual();
        if (test === "verbal") setupVerbal();
    };

    window.closeTest = () => {
        document.getElementById("testArea").classList.remove("active");
        document.querySelector(".tests-grid").style.display = "grid";
        document.querySelector("#testsSection h2").style.display = "block";
    };

    // === FAKE PLAYERS ===
    const fakePlayers = [
        { name: "EmmaQuick", bestReaction: 159, bestNumber: 8, bestTyping: 165, bestAim: 49, bestChimp: 12, bestVisual: 15, bestVerbal: 320 },
        { name: "NinaSpeed", bestReaction: 165, bestNumber: 8, bestTyping: 158, bestAim: 52, bestChimp: 11, bestVisual: 14, bestVerbal: 280 },
        { name: "LeoMaster", bestReaction: 172, bestNumber: 9, bestTyping: 152, bestAim: 50, bestChimp: 14, bestVisual: 16, bestVerbal: 410 },
        { name: "AlexPro", bestReaction: 178, bestNumber: 9, bestTyping: 142, bestAim: 48, bestChimp: 10, bestVisual: 13, bestVerbal: 250 },
        { name: "ZoeBrain", bestReaction: 188, bestNumber: 12, bestTyping: 140, bestAim: 42, bestChimp: 16, bestVisual: 18, bestVerbal: 480 },
        { name: "SaraClick", bestReaction: 185, bestNumber: 7, bestTyping: 148, bestAim: 55, bestChimp: 9, bestVisual: 12, bestVerbal: 220 },
        { name: "MaxFocus", bestReaction: 192, bestNumber: 10, bestTyping: 135, bestAim: 45, bestChimp: 13, bestVisual: 15, bestVerbal: 350 },
        { name: "TomPrecision", bestReaction: 201, bestNumber: 11, bestTyping: 128, bestAim: 58, bestChimp: 15, bestVisual: 17, bestVerbal: 390 }
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

        const hasScore = type === "reaction" ? user.bestReaction < Infinity :
                         type === "number" ? user.bestNumber > 4 :
                         type === "typing" ? user.bestTyping > 0 :
                         type === "aim" ? user.bestAim > 0 :
                         type === "chimp" ? user.bestChimp > 4 :
                         type === "visual" ? user.bestVisual > 3 :
                         user.bestVerbal > 0;

        if (hasScore) {
            players.push({
                name: user.name,
                bestReaction: user.bestReaction,
                bestNumber: user.bestNumber,
                bestTyping: user.bestTyping,
                bestAim: user.bestAim,
                bestChimp: user.bestChimp,
                bestVisual: user.bestVisual,
                bestVerbal: user.bestVerbal
            });
        }

        players.sort((a, b) => {
            if (type === "reaction") return (a.bestReaction || Infinity) - (b.bestReaction || Infinity);
            const key = "best" + type.charAt(0).toUpperCase() + type.slice(1);
            return (b[key] || 0) - (a[key] || 0);
        });

        players = players.slice(0, 10);

        let html = `<table class="leaderboard-table"><thead><tr><th>Rang</th><th>Joueur</th><th>Score</th></tr></thead><tbody>`;

        players.forEach((p, i) => {
            let score = "--";
            if (type === "reaction") score = p.bestReaction === Infinity ? "--" : p.bestReaction + " ms";
            else if (type === "number") score = p.bestNumber > 4 ? p.bestNumber + " chiffres" : "--";
            else if (type === "typing") score = p.bestTyping > 0 ? p.bestTyping + " MPM" : "-- MPM";
            else if (type === "aim") score = p.bestAim > 0 ? p.bestAim : "--";
            else if (type === "chimp") score = p.bestChimp > 4 ? p.bestChimp : "--";
            else if (type === "visual") score = p.bestVisual > 3 ? p.bestVisual : "--";
            else if (type === "verbal") score = p.bestVerbal > 0 ? p.bestVerbal : "--";

            const rankClass = i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";
            const isYou = p.name === user.name ? " (Vous)" : "";

            html += `<tr><td class="leaderboard-rank ${rankClass}">#${i + 1}</td><td class="leaderboard-name">${p.name}${isYou}</td><td class="leaderboard-score">${score}</td></tr>`;
        });

        html += `</tbody></table>`;
        container.innerHTML = html;
    }

    // === REACTION TEST - Avec message "Trop tôt" ===
    function setupReaction() {
        const container = document.getElementById("reactionTest");
        container.innerHTML = `
            <h1 style="color:#667eea;margin-bottom:20px;">⚡ Reaction Test</h1>
            <div class="test-explanation">
                <p><strong>Explication :</strong> Cliquez le plus rapidement possible dès que la zone passe du rouge au vert. Attention : cliquer trop tôt = pénalité !</p>
            </div>
            <div id="reactionBox" class="reaction-box red">Cliquez pour commencer</div>
            <div id="reactionResult" class="result-display"></div>
        `;

        const box = container.querySelector("#reactionBox");
        const result = container.querySelector("#reactionResult");
        let startTime;
        let waiting = false;

        box.onclick = () => {
            if (box.classList.contains("red") && !waiting) {
                // Démarrage normal
                box.innerText = "Attendez le vert...";
                waiting = true;
                setTimeout(() => {
                    box.className = "reaction-box green";
                    box.innerText = "CLIQUEZ !";
                    startTime = Date.now();
                }, Math.random() * 3000 + 2000);
            } else if (box.classList.contains("red") && waiting) {
                // Clic trop tôt
                box.className = "reaction-box red";
                box.innerText = "Trop tôt !";
                result.innerHTML = "<strong style='color:#e74c3c;font-size:2em;'>Trop tôt ! Attendez le vert.</strong>";
                waiting = false;
                setTimeout(() => {
                    box.innerText = "Cliquez pour recommencer";
                    result.innerHTML = "";
                }, 2000);
            } else if (box.classList.contains("green")) {
                // Clic valide
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
                waiting = false;
            } else {
                // Après résultat → recommencer
                box.className = "reaction-box red";
                box.innerText = "Cliquez pour recommencer";
                result.innerHTML = "";
                waiting = false;
            }
        };
    }

    // === NUMBER MEMORY ===
    function setupNumber() {
        const container = document.getElementById("numberTest");
        container.innerHTML = `
            <h1 style="color:#667eea;margin-bottom:20px;">🔢 Number Memory</h1>
            <div class="test-explanation">
                <p><strong>Explication :</strong> Un nombre de plus en plus long s'affiche brièvement. Mémorisez-le et retapez-le exactement. Chaque succès augmente la difficulté !</p>
            </div>
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
            <div id="numberResult" class="result-display"></div>
        `;

        let currentNumber = "";
        let currentLevel = user.bestNumber;

        const display = container.querySelector("#numberDisplay");
        const input = container.querySelector("#numberInput");
        const btn = container.querySelector("#startBtn");
        const result = container.querySelector("#numberResult");
        const progressFill = container.querySelector("#progressFill");

        function updateProgress() {
            const percentage = Math.min((user.bestNumber / 20) * 100, 100);
            progressFill.style.width = percentage + "%";
        }

        updateProgress();

        btn.onclick = () => {
            const min = Math.pow(10, currentLevel - 1);
            const max = Math.pow(10, currentLevel) - 1;
            currentNumber = Math.floor(Math.random() * (max - min + 1)) + min;

            display.innerText = currentNumber;
            btn.style.display = "none";
            result.innerHTML = "";

            setTimeout(() => {
                display.innerText = "?";
                input.style.display = "block";
                input.focus();
            }, 1500 + currentLevel * 300);
        };

        input.onkeydown = e => {
            if (e.key === "Enter") {
                if (input.value.trim() === currentNumber.toString()) {
                    result.innerHTML = `<strong style="color:#2ecc71;">✔ Correct ! Niveau ${currentLevel + 1} débloqué !</strong>`;
                    user.bestNumber = currentLevel + 1;
                    updateProgress();
                } else {
                    result.innerHTML = `<strong style="color:#e74c3c;">✘ Incorrect</strong><br>Le nombre était : ${currentNumber}`;
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
            <h1 style="color:#667eea;margin-bottom:20px;">⌨️ Typing Test</h1>
            <div class="test-explanation">
                <p><strong>Explication :</strong> Tapez le texte affiché le plus vite et précisément possible. Appuyez sur Entrée quand vous avez fini. Votre vitesse est mesurée en Mots Par Minute (MPM).</p>
            </div>
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
                stats.classList.add("active");
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
                    result.innerHTML += "<br><strong style='color:#2ecc71;'>Nouveau record !</strong>";
                }
                result.innerHTML = `<strong>Test terminé !</strong><br>Vitesse : <strong>${finalWpm} MPM</strong><br>Précision : <strong>${accEl.innerText}%</strong>`;
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
            <h1 style="color:#667eea;margin-bottom:20px;">🎯 Aim Trainer</h1>
            <div class="test-explanation">
                <p><strong>Explication :</strong> Cliquez sur les cibles rouges qui apparaissent aléatoirement pendant 30 secondes. Plus vous en touchez, plus votre score est élevé !</p>
            </div>
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

    // === CHIMP TEST ===
    function setupChimp() {
        const container = document.getElementById("chimpTest");
        container.innerHTML = `
            <h1 style="color:#667eea;margin-bottom:20px;">🧠 Chimp Test</h1>
            <div class="test-explanation">
                <p><strong>Explication :</strong> Des chiffres apparaissent brièvement dans une grille 4x4. Vous devez ensuite cliquer sur les cases dans l'ordre croissant (1 → 2 → 3...). La difficulté augmente à chaque niveau réussi.</p>
            </div>
            <div id="chimpLevel" style="font-size:1.6em;color:#667eea;margin-bottom:20px;">Meilleur niveau : <strong>${user.bestChimp}</strong></div>
            <div id="chimpGrid"></div>
            <button class="btn-primary" id="chimpStart" style="margin:30px auto;display:block;">Commencer</button>
            <div id="chimpResult" class="result-display"></div>
        `;

        const grid = container.querySelector("#chimpGrid");
        const startBtn = container.querySelector("#chimpStart");
        const result = container.querySelector("#chimpResult");
        const levelDisplay = container.querySelector("#chimpLevel");

        let currentLevel = user.bestChimp || 4;
        let numbers = [];
        let clicked = [];
        let showing = false;

        function createGrid() {
            grid.innerHTML = "";
            numbers = new Array(16).fill(0);
            for (let i = 0; i < 16; i++) {
                const square = document.createElement("div");
                square.dataset.index = i;
                grid.appendChild(square);
            }
        }

        function startLevel() {
            createGrid();
            clicked = [];
            showing = true;
            startBtn.style.display = "none";
            result.innerHTML = "";

            const positions = [];
            while (positions.length < currentLevel) {
                const pos = Math.floor(Math.random() * 16);
                if (!positions.includes(pos)) positions.push(pos);
            }

            positions.forEach((pos, idx) => {
                const square = grid.children[pos];
                square.innerText = idx + 1;
                square.classList.add("showing");
                numbers[pos] = idx + 1;
            });

            const hideDelay = Math.max(1000, 3000 - (currentLevel - 4) * 200);

            setTimeout(() => {
                showing = false;
                grid.querySelectorAll("div").forEach(square => {
                    square.innerText = "";
                    square.classList.remove("showing");
                    square.classList.add("hidden");
                });
                result.innerHTML = "<p style='font-size:1.4em;color:#495057;'>Cliquez dans l'ordre croissant : 1 → 2 → 3...</p>";
            }, hideDelay);
        }

        grid.onclick = (e) => {
            if (showing || !e.target.dataset.index) return;

            const index = parseInt(e.target.dataset.index);
            const expected = clicked.length + 1;

            if (numbers[index] === expected) {
                e.target.innerText = expected;
                e.target.classList.remove("hidden");
                e.target.classList.add("correct");
                clicked.push(index);

                if (clicked.length === currentLevel) {
                    result.innerHTML = `<strong style="color:#2ecc71;font-size:2.2em;">✔ Bravo ! Niveau ${currentLevel} réussi !</strong>`;
                    user.bestChimp = currentLevel + 1;
                    levelDisplay.innerHTML = `Meilleur niveau : <strong>${user.bestChimp}</strong>`;
                    user.testsCompleted++;
                    saveUser();

                    setTimeout(() => {
                        currentLevel++;
                        startBtn.style.display = "block";
                        startBtn.innerText = "Niveau suivant →";
                    }, 2500);
                }
            } else {
                result.innerHTML = `<strong style="color:#e74c3c;font-size:2.2em;">✘ Game Over</strong><br><p>Niveau atteint : ${currentLevel}</p>`;
                grid.querySelectorAll("div").forEach((sq, i) => {
                    if (numbers[i] > 0) {
                        sq.innerText = numbers[i];
                        sq.classList.add("correct");
                    }
                    sq.style.pointerEvents = "none";
                });
                startBtn.style.display = "block";
                startBtn.innerText = "Recommencer";
            }
        };

        startBtn.onclick = () => {
            currentLevel = user.bestChimp || 4;
            startLevel();
        };

        createGrid();
    }

    // === VISUAL MEMORY TEST ===
    function setupVisual() {
        const container = document.getElementById("visualTest");
        container.innerHTML = `
            <h1 style="color:#667eea;margin-bottom:20px;">👁️ Visual Memory</h1>
            <div class="test-explanation">
                <p><strong>Explication :</strong> Plusieurs cases s'allument en séquence dans une grille 3x3. Reproduisez exactement le même ordre en cliquant dessus après.</p>
            </div>
            <div id="visualLevel" style="font-size:1.6em;color:#667eea;margin-bottom:20px;">Meilleur niveau : <strong>${user.bestVisual}</strong></div>
            <div id="visualGrid"></div>
            <button class="btn-primary" id="visualStart" style="margin:30px auto;display:block;">Commencer</button>
            <div id="visualResult" class="result-display"></div>
        `;

        const grid = container.querySelector("#visualGrid");
        const startBtn = container.querySelector("#visualStart");
        const result = container.querySelector("#visualResult");
        const levelDisplay = container.querySelector("#visualLevel");

        let currentLevel = user.bestVisual || 3;
        let sequence = [];
        let playerSequence = [];
        let showing = false;

        function createGrid() {
            grid.innerHTML = "";
            for (let i = 0; i < 9; i++) {
                const square = document.createElement("div");
                square.dataset.index = i;
                grid.appendChild(square);
            }
        }

        function showSequence() {
            showing = true;
            playerSequence = [];
            result.innerHTML = "";
            let delay = 0;

            sequence.forEach((index, i) => {
                setTimeout(() => {
                    grid.children[index].classList.add("active");
                    setTimeout(() => {
                        grid.children[index].classList.remove("active");
                        if (i === sequence.length - 1) {
                            showing = false;
                            result.innerHTML = "<p style='font-size:1.4em;color:#495057;'>Reproduisez la séquence...</p>";
                        }
                    }, 600);
                }, delay);
                delay += 1000;
            });
        }

        function startLevel() {
            createGrid();
            sequence = [];
            const used = new Set();
            while (sequence.length < currentLevel) {
                const rand = Math.floor(Math.random() * 9);
                if (!used.has(rand)) {
                    used.add(rand);
                    sequence.push(rand);
                }
            }

            result.innerHTML = "<p style='font-size:1.4em;'>Regardez bien...</p>";
            startBtn.style.display = "none";
            setTimeout(showSequence, 1000);
        }

        grid.onclick = (e) => {
            if (showing || !e.target.dataset.index) return;

            const clickedIndex = parseInt(e.target.dataset.index);
            playerSequence.push(clickedIndex);

            e.target.classList.add("active");
            setTimeout(() => e.target.classList.remove("active"), 300);

            const step = playerSequence.length - 1;
            if (playerSequence[step] !== sequence[step]) {
                result.innerHTML = `<strong style="color:#e74c3c;font-size:2.2em;">✘ Incorrect !</strong><br><p>Niveau atteint : ${currentLevel}</p>`;
                sequence.forEach((idx, i) => {
                    setTimeout(() => grid.children[idx].classList.add("correct"), i * 600);
                });
                grid.querySelectorAll("div").forEach(sq => sq.style.pointerEvents = "none");
                startBtn.style.display = "block";
                startBtn.innerText = "Recommencer";
                return;
            }

            if (playerSequence.length === currentLevel) {
                result.innerHTML = `<strong style="color:#2ecc71;font-size:2.2em;">✔ Parfait ! Niveau ${currentLevel} réussi !</strong>`;
                user.bestVisual = currentLevel + 1;
                levelDisplay.innerHTML = `Meilleur niveau : <strong>${user.bestVisual}</strong>`;
                user.testsCompleted++;
                saveUser();

                setTimeout(() => {
                    currentLevel++;
                    startBtn.style.display = "block";
                    startBtn.innerText = "Niveau suivant →";
                }, 2000);
            }
        };

        startBtn.onclick = () => {
            currentLevel = user.bestVisual || 3;
            startLevel();
        };

        createGrid();
    }

    // === VERBAL MEMORY TEST ===
    function setupVerbal() {
        const container = document.getElementById("verbalTest");
        container.innerHTML = `
            <h1 style="color:#667eea;margin-bottom:20px;">📖 Verbal Memory</h1>
            <div class="test-explanation">
                <p><strong>Explication :</strong> Un mot apparaît. Cliquez "NEW" s'il est nouveau, "SEEN" s'il est déjà apparu. Vous avez 3 vies !</p>
            </div>
            <div id="verbalLives">Vies : ❤️❤️❤️</div>
            <div id="verbalScore">Score : 0</div>
            <div id="verbalWord"></div>
            <div id="verbalButtons">
                <button id="verbalNew" class="verbal-btn">NEW</button>
                <button id="verbalSeen" class="verbal-btn">SEEN</button>
            </div>
            <div id="verbalResult" class="result-display"></div>
        `;

        const wordEl = container.querySelector("#verbalWord");
        const livesEl = container.querySelector("#verbalLives");
        const scoreEl = container.querySelector("#verbalScore");
        const result = container.querySelector("#verbalResult");
        const newBtn = container.querySelector("#verbalNew");
        const seenBtn = container.querySelector("#verbalSeen");

        let score = 0;
        let lives = 3;
        let seenWords = new Set();
        let currentWord = "";

        const wordsList = [
            "maison", "voiture", "arbre", "fleur", "soleil", "lune", "étoile", "océan", "montagne", "rivière",
            "chien", "chat", "oiseau", "poisson", "livre", "musique", "film", "ordinateur", "téléphone", "table",
            "chaise", "fenêtre", "porte", "clé", "lampe", "plante", "fruit", "légume", "pain", "eau",
            "feu", "terre", "air", "ciel", "nuage", "pluie", "neige", "vent", "été", "hiver",
            "printemps", "automne", "jour", "nuit", "matin", "soir", "heure", "minute", "seconde", "temps"
        ];

        function nextWord() {
            currentWord = wordsList[Math.floor(Math.random() * wordsList.length)];
            wordEl.innerText = currentWord.toUpperCase();
            result.innerHTML = "";
        }

        function updateLives() {
            livesEl.innerHTML = "Vies : " + "❤️".repeat(lives) + "♡".repeat(3 - lives);
        }

        function gameOver() {
            newBtn.disabled = true;
            seenBtn.disabled = true;
            result.innerHTML = `<strong style="color:#e74c3c;font-size:2.5em;">Game Over !</strong><br><p style="font-size:2em;">Score final : ${score}</p>`;
            if (score > user.bestVerbal) {
                user.bestVerbal = score;
                result.innerHTML += "<br><strong style='color:#2ecc71;font-size:2em;'>Nouveau record !</strong>";
            }
            user.testsCompleted++;
            saveUser();
        }

        newBtn.onclick = () => {
            if (seenWords.has(currentWord)) {
                lives--;
                updateLives();
                result.innerHTML = "<strong style='color:#e74c3c;font-size:1.8em;'>Erreur ! Ce mot était déjà vu.</strong>";
                if (lives <= 0) gameOver();
            } else {
                seenWords.add(currentWord);
                score++;
                scoreEl.innerText = `Score : ${score}`;
                result.innerHTML = "<strong style='color:#2ecc71;font-size:1.8em;'>Correct !</strong>";
            }
            nextWord();
        };

        seenBtn.onclick = () => {
            if (!seenWords.has(currentWord)) {
                lives--;
                updateLives();
                result.innerHTML = "<strong style='color:#e74c3c;font-size:1.8em;'>Erreur ! Ce mot était nouveau.</strong>";
                if (lives <= 0) gameOver();
            } else {
                score++;
                scoreEl.innerText = `Score : ${score}`;
                result.innerHTML = "<strong style='color:#2ecc71;font-size:1.8em;'>Correct !</strong>";
            }
            nextWord();
        };

        nextWord();
        updateLives();
    }

    // === PROTECTION ANTI-COPIE ===
    document.addEventListener("keydown", e => {
        if (e.ctrlKey || e.metaKey) {
            const activeEl = document.activeElement;
            const isInput = ["INPUT", "TEXTAREA"].includes(activeEl.tagName);
            if (!isInput && ["c","a","x","v","s"].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        }
    });

    document.addEventListener("contextmenu", e => e.preventDefault());
    document.addEventListener("dragstart", e => e.preventDefault());
    document.addEventListener("copy", e => {
        const activeEl = document.activeElement;
        if (!["INPUT","TEXTAREA"].includes(activeEl.tagName)) e.preventDefault();
    });
});

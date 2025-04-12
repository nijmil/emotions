window.onload = function () {
    const canvas = document.getElementById("emotionWheel");
    const ctx = canvas.getContext("2d");
  
    const coreEmotions = ["Happy", "Sad", "Angry", "Fearful", "Disgusted", "Bad", "Surprised"];
    const colors = ["#F6A623", "#4A90E2", "#D0021B", "#9013FE", "#8B572A", "#7ED321", "#50E3C2"];
  
    let radius = canvas.width / 2;
    let angleStep = (2 * Math.PI) / coreEmotions.length;
  
    // Draw the core emotion wheel
    function drawWheel() {
      for (let i = 0; i < coreEmotions.length; i++) {
        let angle = i * angleStep;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, angle, angle + angleStep);
        ctx.fillStyle = colors[i];
        ctx.fill();
  
        // Emotion labels
        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px sans-serif";
        ctx.textAlign = "center";
        ctx.save();
        ctx.translate(
          radius + Math.cos(angle + angleStep / 2) * radius * 0.65,
          radius + Math.sin(angle + angleStep / 2) * radius * 0.65
        );
        ctx.rotate(angle + angleStep / 2);
        ctx.fillText(coreEmotions[i], 0, 0);
        ctx.restore();
      }
    }
  
    drawWheel();
  
    // Handle click on the wheel
    canvas.addEventListener("click", function (e) {
      let x = e.offsetX - radius;
      let y = e.offsetY - radius;
      let clickAngle = Math.atan2(y, x);
      if (clickAngle < 0) clickAngle += 2 * Math.PI;
      let selectedIndex = Math.floor(clickAngle / angleStep);
      let selectedEmotion = coreEmotions[selectedIndex];
      showLevel2(selectedEmotion);
    });
  
    // Show level 2 emotions
    function showLevel2(coreEmotion) {
      fetch("emotions/emotions-wheel-data.json")
        .then(res => res.json())
        .then(data => {
          const found = data.find(e => e.core === coreEmotion);
          if (!found) return;
          let html = `<h3>${coreEmotion} → Select One:</h3>`;
          found.level2.forEach(level2 => {
            html += `<button onclick="showLevel3('${coreEmotion}', '${level2}')">${level2}</button> `;
          });
          document.getElementById("selectionBox").innerHTML = html;
        });
    }
  
    // Show level 3 emotions
    window.showLevel3 = function (coreEmotion, level2Emotion) {
      fetch("emotions/emotions-wheel-data.json")
        .then(res => res.json())
        .then(data => {
          const found = data.find(e => e.core === coreEmotion);
          const level3Options = found.level3[level2Emotion];
          let html = `<h3>${coreEmotion} → ${level2Emotion} → Select One:</h3>`;
          level3Options.forEach(level3 => {
            html += `<button onclick="logEmotion('${coreEmotion}', '${level2Emotion}', '${level3}')">${level3}</button> `;
          });
          document.getElementById("selectionBox").innerHTML = html;
        });
    };
  
    // Log selected emotion and note
    window.logEmotion = function (core, level2, level3) {
      const note = prompt("What happened?");
      const today = new Date().toISOString().split("T")[0];
      const log = { date: today, core, level2, level3, note };
      let logs = JSON.parse(localStorage.getItem("emotionLogs") || "[]");
      logs.push(log);
      localStorage.setItem("emotionLogs", JSON.stringify(logs));
      alert("Emotion logged!");
      document.getElementById("selectionBox").innerHTML = "";
    };
  };
  
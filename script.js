window.onload = function () {
    const canvas = document.getElementById("emotionWheel");
    const ctx = canvas.getContext("2d");
    const selectionBox = document.getElementById("selectionBox");
  
    const coreEmotions = ["Happy", "Sad", "Angry", "Fearful", "Disgusted", "Bad", "Surprised"];
    const colors = ["#F6A623", "#4A90E2", "#D0021B", "#9013FE", "#8B572A", "#7ED321", "#50E3C2"];
    const radius = canvas.width / 2;
    const angleStep = (2 * Math.PI) / coreEmotions.length;
  
    let rotation = 0;
    let dragging = false;
    let lastAngle = 0;
  
    // Convert mouse coords to angle
    function getAngle(x, y) {
      const dx = x - radius;
      const dy = y - radius;
      return Math.atan2(dy, dx);
    }
  
    function drawWheel() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      for (let i = 0; i < coreEmotions.length; i++) {
        const angle = i * angleStep + rotation;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, angle, angle + angleStep);
        ctx.fillStyle = colors[i];
        ctx.fill();
  
        ctx.save();
        ctx.translate(
          radius + Math.cos(angle + angleStep / 2) * radius * 0.65,
          radius + Math.sin(angle + angleStep / 2) * radius * 0.65
        );
        ctx.rotate(angle + angleStep / 2
            ctx.font = "bold 18px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(coreEmotions[i], 0, 0);
            ctx.restore();
          }
      
          drawPointerEmotion();
        }
      
        function drawPointerEmotion() {
          // Emotion at the top (angle = -90 degrees)
          let index = Math.floor(((1.5 * Math.PI - rotation) % (2 * Math.PI)) / angleStep);
          if (index < 0) index += coreEmotions.length;
      
          const selectedEmotion = coreEmotions[index];
          selectionBox.innerHTML = `<h3>You selected: <strong>${selectedEmotion}</strong></h3>
            <button onclick="showLevel2('${selectedEmotion}')">Next</button>`;
        }
      
        canvas.addEventListener("mousedown", (e) => {
          dragging = true;
          lastAngle = getAngle(e.offsetX, e.offsetY);
        });
      
        canvas.addEventListener("mousemove", (e) => {
          if (dragging) {
            const currentAngle = getAngle(e.offsetX, e.offsetY);
            rotation += currentAngle - lastAngle;
            lastAngle = currentAngle;
            drawWheel();
          }
        });
      
        canvas.addEventListener("mouseup", () => (dragging = false));
        canvas.addEventListener("mouseleave", () => (dragging = false));
      
        // For touch devices
        canvas.addEventListener("touchstart", (e) => {
          const touch = e.touches[0];
          const rect = canvas.getBoundingClientRect();
          lastAngle = getAngle(touch.clientX - rect.left, touch.clientY - rect.top);
          dragging = true;
        });
      
        canvas.addEventListener("touchmove", (e) => {
          if (dragging) {
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const currentAngle = getAngle(touch.clientX - rect.left, touch.clientY - rect.top);
            rotation += currentAngle - lastAngle;
            lastAngle = currentAngle;
            drawWheel();
          }
        });
      
        canvas.addEventListener("touchend", () => (dragging = false));
      
        drawWheel(); // Initial draw
      };
      
      // Allow global call from buttons
      function showLevel2(coreEmotion) {
        fetch("emotions/emotions-wheel-data.json")
          .then((res) => res.json())
          .then((data) => {
            const found = data.find((e) => e.core === coreEmotion);
            if (!found) return;
            let html = `<h3>${coreEmotion} → Select One:</h3>`;
            found.level2.forEach((level2) => {
              html += `<button onclick="showLevel3('${coreEmotion}', '${level2}')">${level2}</button> `;
            });
            document.getElementById("selectionBox").innerHTML = html;
          });
      }
      
      function showLevel3(coreEmotion, level2Emotion) {
        fetch("emotions/emotions-wheel-data.json")
          .then((res) => res.json())
          .then((data) => {
            const found = data.find((e) => e.core === coreEmotion);
            const level3Options = found.level3[level2Emotion];
            let html = `<h3>${coreEmotion} → ${level2Emotion} → Select One:</h3>`;
            level3Options.forEach((level3) => {
              html += `<button onclick="logEmotion('${coreEmotion}', '${level2Emotion}', '${level3}')">${level3}</button> `;
            });
            document.getElementById("selectionBox").innerHTML = html;
          });
      }
      
      function logEmotion(core, level2, level3) {
        const note = prompt("Thoughts from today...");
        const today = new Date().toISOString().split("T")[0];
        const log = { date: today, core, level2, level3, note };
        let logs = JSON.parse(localStorage.getItem("emotionLogs") || "[]");
        logs.push(log);
        localStorage.setItem("emotionLogs", JSON.stringify(logs));
        alert("Emotion logged!");
        document.getElementById("selectionBox").innerHTML = "";
      }
        
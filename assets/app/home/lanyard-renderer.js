export function createLanyardRenderer({ ctx, state, clamp }) {
  const roundedRect = (x, y, width, height, radius) => {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  };

  const smoothPath = (points) => {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let index = 1; index < points.length - 1; index += 1) {
      const current = points[index];
      const next = points[index + 1];
      ctx.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
    }
    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
  };

  const lanyardDisplayPoints = () => {
    return state.points.slice(0, 4).map((item, index) => {
      if (index === 0) {
        item.lerpX = item.x;
        item.lerpY = item.y;
        return { x: item.x, y: item.y };
      }
      const distance = Math.hypot(item.x - item.lerpX, item.y - item.lerpY);
      const speed = clamp(0.12 + distance * 0.012, 0.12, 0.42);
      item.lerpX += (item.x - item.lerpX) * speed;
      item.lerpY += (item.y - item.lerpY) * speed;
      return { x: item.lerpX, y: item.lerpY };
    });
  };

  const drawAnchor = () => {
    const anchor = state.points[0];
    ctx.save();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#171717";
    ctx.fillStyle = "#fdfbf9";
    roundedRect(anchor.x - 30, anchor.y - 9, 60, 20, 10);
    ctx.shadowColor = "rgba(0, 0, 0, 0.18)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.stroke();
    ctx.strokeStyle = "#ff6f1e";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(anchor.x - 13, anchor.y + 1);
    ctx.lineTo(anchor.x + 13, anchor.y - 2);
    ctx.stroke();
    ctx.restore();
  };

  const drawBand = () => {
    const bandPoints = lanyardDisplayPoints();
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    smoothPath(bandPoints);
    ctx.lineWidth = 18;
    ctx.strokeStyle = "rgba(0, 0, 0, 0.88)";
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 8;
    ctx.stroke();

    smoothPath(bandPoints);
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#f6f1ea";
    ctx.shadowColor = "transparent";
    ctx.stroke();

    smoothPath(bandPoints);
    ctx.lineWidth = 2;
    ctx.setLineDash([9, 13]);
    ctx.strokeStyle = "#ff6f1e";
    ctx.stroke();
    ctx.restore();
  };

  const drawClip = () => {
    const top = state.points[3];
    ctx.save();
    ctx.translate(top.x, top.y);
    ctx.rotate(state.card.angle);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = "rgba(23, 23, 23, 0.78)";
    const clipWidth = Math.min(state.card.width * 0.28, 68);
    const metal = ctx.createLinearGradient(-clipWidth / 2, -28, clipWidth / 2, 10);
    metal.addColorStop(0, "#f6f1ea");
    metal.addColorStop(0.5, "#fffdf2");
    metal.addColorStop(1, "#c8c2b6");
    ctx.fillStyle = metal;
    roundedRect(-clipWidth / 2, -30, clipWidth, 34, 13);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ff8a2a";
    roundedRect(clipWidth * 0.1, -15, clipWidth * 0.22, 5, 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 6, Math.min(11, clipWidth * 0.2), 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 247, 223, 0.86)";
    ctx.beginPath();
    ctx.arc(0, 8, Math.min(6, clipWidth * 0.12), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  return {
    draw() {
      drawAnchor();
      drawBand();
      drawClip();
    }
  };
}

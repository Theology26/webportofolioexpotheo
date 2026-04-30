import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";

export default function HourglassCanvas() {
  const containerRef = useRef<View>(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const node = containerRef.current as unknown as HTMLElement;
    if (!node) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;";
    node.appendChild(canvas);

    let animId: number;
    let W: number, H: number;

    const resize = () => {
      W = canvas.width = node.clientWidth;
      H = canvas.height = node.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      s: number;
      a: number;
    }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        s: Math.random() * 2.5 + 0.5,
        a: Math.random() * 0.25 + 0.05,
      });
    }

    const grains: { x: number; y: number; vy: number; a: number }[] = [];

    let time = 0;
    let flipAngle = 0;
    let flipTarget = 0;
    let sandProgress = 0; 
    let isFlipping = false;

    const handleInteract = (e: MouseEvent | TouchEvent) => {
      let clientX = 0, clientY = 0;
      if (e.type === "touchstart") {
        clientX = (e as TouchEvent).touches[0].clientX;
        clientY = (e as TouchEvent).touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      const isDesktop = W > 800;
      const cx = isDesktop ? W * 0.75 : W / 2;
      const cy = H / 2;

      if (Math.abs(clientX - cx) < 150 && Math.abs(clientY - cy) < 200) {
        if (!isFlipping && sandProgress > 0.01) {
          isFlipping = true;
          flipTarget = Math.PI;
        }
      }
    };
    window.addEventListener("mousedown", handleInteract);
    window.addEventListener("touchstart", handleInteract);

    const drawHourglass = (ctx: CanvasRenderingContext2D) => {
      const isDesktop = W > 800;
      const cx = isDesktop ? W * 0.75 : W / 2;
      const cy = H / 2;
      const hH = Math.min(H * 0.55, 380);
      const hW = Math.min(W * 0.22, 140);
      const neckW = 6;

      ctx.save();
      ctx.translate(cx, cy);

      const glow = ctx.createRadialGradient(0, 0, 10, 0, 0, hH * 0.7);
      glow.addColorStop(0, "rgba(212, 165, 116, 0.08)");
      glow.addColorStop(0.5, "rgba(124, 92, 252, 0.04)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(-hH, -hH, hH * 2, hH * 2);

      const skew = Math.sin(time * 0.2) * 0.03;
      ctx.transform(1, 0, skew, 1, 0, 0);
      ctx.rotate(flipAngle);

      ctx.beginPath();

      ctx.moveTo(-hW, -hH / 2);
      ctx.bezierCurveTo(-hW, -hH * 0.12, -neckW * 2, -neckW, -neckW, 0);

      ctx.bezierCurveTo(-neckW * 2, neckW, -hW, hH * 0.12, -hW, hH / 2);

      ctx.lineTo(hW, hH / 2);

      ctx.bezierCurveTo(hW, hH * 0.12, neckW * 2, neckW, neckW, 0);

      ctx.bezierCurveTo(neckW * 2, -neckW, hW, -hH * 0.12, hW, -hH / 2);
      ctx.closePath();

      const glassFill = ctx.createLinearGradient(-hW, 0, hW, 0);
      glassFill.addColorStop(0, "rgba(124, 92, 252, 0.06)");
      glassFill.addColorStop(0.3, "rgba(167, 139, 250, 0.1)");
      glassFill.addColorStop(0.7, "rgba(124, 92, 252, 0.08)");
      glassFill.addColorStop(1, "rgba(100, 70, 200, 0.04)");
      ctx.fillStyle = glassFill;
      ctx.fill();

      ctx.strokeStyle = "rgba(167, 139, 250, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-hW * 0.75, -hH / 2 + 10);
      ctx.bezierCurveTo(
        -hW * 0.75,
        -hH * 0.1,
        -neckW * 3,
        -neckW * 2,
        -neckW * 1.5,
        0
      );
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.strokeStyle = "rgba(212, 165, 116, 0.4)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-hW - 5, -hH / 2);
      ctx.lineTo(hW + 5, -hH / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-hW - 5, hH / 2);
      ctx.lineTo(hW + 5, hH / 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(212, 165, 116, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-hW - 8, -hH / 2 - 4);
      ctx.lineTo(hW + 8, -hH / 2 - 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-hW - 8, hH / 2 + 4);
      ctx.lineTo(hW + 8, hH / 2 + 4);
      ctx.stroke();

      const upperLevel = sandProgress; 

      if (upperLevel < 0.95) {
        ctx.beginPath();
        const sandTop = -hH / 2 + hH * 0.5 * upperLevel + 10;
        const sandWidthAtTop =
          hW * (1 - upperLevel * 0.9) * (1 - (sandTop + hH / 2) / (hH / 2));
        const wAtLevel = Math.max(
          neckW,
          hW * Math.pow(1 - (sandTop + hH / 2) / (hH * 0.38), 0.6) * 0.85
        );

        ctx.moveTo(-wAtLevel, sandTop);
        ctx.lineTo(wAtLevel, sandTop);
        ctx.bezierCurveTo(
          wAtLevel,
          sandTop + 10,
          neckW * 2,
          -neckW * 0.5,
          neckW * 0.8,
          0
        );
        ctx.lineTo(-neckW * 0.8, 0);
        ctx.bezierCurveTo(
          -neckW * 2,
          -neckW * 0.5,
          -wAtLevel,
          sandTop + 10,
          -wAtLevel,
          sandTop
        );
        ctx.closePath();

        const sandGrad = ctx.createLinearGradient(0, sandTop, 0, 0);
        sandGrad.addColorStop(0, "rgba(212, 165, 116, 0.5)");
        sandGrad.addColorStop(1, "rgba(194, 145, 96, 0.7)");
        ctx.fillStyle = sandGrad;
        ctx.fill();
      }

      if (upperLevel < 0.95) {
        ctx.beginPath();
        ctx.moveTo(-1, -2);
        ctx.lineTo(1, -2);
        ctx.lineTo(2, 20);
        ctx.lineTo(-2, 20);
        ctx.closePath();
        ctx.fillStyle = "rgba(212, 165, 116, 0.6)";
        ctx.fill();
      }

      const lowerLevel = sandProgress; 
      if (lowerLevel > 0.05) {
        ctx.beginPath();
        const sandBot = hH / 2 - 5;
        const sandTopLower =
          hH / 2 - hH * 0.42 * lowerLevel;
        const wAtBot = hW * 0.85;
        const wAtTopLower = Math.max(
          neckW,
          hW *
            Math.pow(
              1 - (hH / 2 - sandTopLower) / (hH * 0.38),
              0.6
            ) *
            0.85
        );

        ctx.moveTo(-neckW * 0.8, sandTopLower < 15 ? 15 : sandTopLower);
        ctx.lineTo(neckW * 0.8, sandTopLower < 15 ? 15 : sandTopLower);
        ctx.bezierCurveTo(
          neckW * 2,
          sandBot * 0.4,
          wAtBot,
          sandBot - 10,
          wAtBot,
          sandBot
        );
        ctx.lineTo(-wAtBot, sandBot);
        ctx.bezierCurveTo(
          -wAtBot,
          sandBot - 10,
          -neckW * 2,
          sandBot * 0.4,
          -neckW * 0.8,
          sandTopLower < 15 ? 15 : sandTopLower
        );
        ctx.closePath();

        const sandGrad2 = ctx.createLinearGradient(
          0,
          sandTopLower,
          0,
          sandBot
        );
        sandGrad2.addColorStop(0, "rgba(194, 145, 96, 0.6)");
        sandGrad2.addColorStop(1, "rgba(212, 165, 116, 0.75)");
        ctx.fillStyle = sandGrad2;
        ctx.fill();
      }

      if (Math.random() < 0.3 && upperLevel < 0.95) {
        grains.push({
          x: (Math.random() - 0.5) * 4,
          y: 2,
          vy: Math.random() * 1.5 + 0.5,
          a: Math.random() * 0.5 + 0.3,
        });
      }

      for (let i = grains.length - 1; i >= 0; i--) {
        const g = grains[i];
        g.y += g.vy;
        g.x += (Math.random() - 0.5) * 0.5;
        g.a -= 0.005;
        if (g.a <= 0 || g.y > hH / 2 - 10) {
          grains.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(g.x, g.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 165, 116, ${g.a})`;
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, W, H);
      time += 0.016;

      if (isFlipping) {
        flipAngle += (flipTarget - flipAngle) * 0.08;
        if (Math.abs(flipTarget - flipAngle) < 0.02) {
           flipAngle = 0;
           flipTarget = 0;
           sandProgress = 1 - sandProgress; 
           isFlipping = false;
        }
      } else {

        if (sandProgress < 1) {
          sandProgress += 0.0005; 
        }
      }

      drawHourglass(ctx);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 165, 116, ${p.a})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousedown", handleInteract);
      window.removeEventListener("touchstart", handleInteract);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  if (Platform.OS !== "web") return null;

  return (
    <View
      ref={containerRef}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
}

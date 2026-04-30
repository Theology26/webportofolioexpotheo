import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";

export default function PyramidsCanvas() {
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
      initSandParticles();
    };

    let sandParticles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      s: number;
      a: number;
      life: number;
    }[] = [];

    const initSandParticles = () => {
      sandParticles = [];
      for (let i = 0; i < 120; i++) {
        sandParticles.push({
          x: Math.random() * (W || 1500),
          y: Math.random() * (H || 800),
          vx: Math.random() * 2 + 0.5,
          vy: (Math.random() - 0.6) * 0.4,
          s: Math.random() * 2 + 0.3,
          a: Math.random() * 0.3 + 0.05,
          life: Math.random(),
        });
      }
    };
    initSandParticles();

    const stars: { x: number; y: number; s: number; twinkle: number }[] = [];
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random() * 0.5,
        s: Math.random() * 1.5 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    let catAliveTimer = 0;

    const handleInteract = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if (e.type === "touchstart") {
        clientX = (e as TouchEvent).touches[0].clientX;
        clientY = (e as TouchEvent).touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      const isDesktop = W > 800;
      const groundY = H * 0.7;
      const catX = isDesktop ? W * 0.55 : W * 0.25;
      const catY = groundY;

      if (
        Math.abs(clientX - catX) < 50 &&
        clientY > catY - 100 &&
        clientY < catY + 20
      ) {
        catAliveTimer = 180;
      }
    };
    window.addEventListener("mousedown", handleInteract);
    window.addEventListener("touchstart", handleInteract);

    const drawPyramids = (ctx: CanvasRenderingContext2D) => {

      const groundY = H * 0.7;

      const atmoGrad = ctx.createLinearGradient(0, groundY - 100, 0, groundY + 50);
      atmoGrad.addColorStop(0, "rgba(0,0,0,0)");
      atmoGrad.addColorStop(0.5, "rgba(194, 145, 70, 0.04)");
      atmoGrad.addColorStop(1, "rgba(194, 145, 70, 0.08)");
      ctx.fillStyle = atmoGrad;
      ctx.fillRect(0, groundY - 100, W, 200);

      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(W, groundY);
      ctx.strokeStyle = "rgba(212, 175, 55, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const gndGrad = ctx.createLinearGradient(0, groundY, 0, H);
      gndGrad.addColorStop(0, "rgba(139, 100, 50, 0.06)");
      gndGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gndGrad;
      ctx.fillRect(0, groundY, W, H - groundY);

      for (const star of stars) {
        const sx = star.x * W;
        const sy = star.y * H;
        const brightness =
          0.3 + Math.sin(time * 1.5 + star.twinkle) * 0.3;
        ctx.beginPath();
        ctx.arc(sx, sy, star.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 240, ${brightness})`;
        ctx.fill();
      }

      const isDesktop = W > 800;
      const offset = isDesktop ? W * 0.4 : 0;

      const moonX = isDesktop ? W * 0.85 : W * 0.8;
      const moonY = H * 0.15;
      const moonR = 18;
      const moonGlow = ctx.createRadialGradient(
        moonX, moonY, moonR * 0.5, moonX, moonY, moonR * 4
      );
      moonGlow.addColorStop(0, "rgba(255, 250, 220, 0.12)");
      moonGlow.addColorStop(0.3, "rgba(255, 250, 220, 0.04)");
      moonGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = moonGlow;
      ctx.fillRect(moonX - moonR * 4, moonY - moonR * 4, moonR * 8, moonR * 8);

      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 250, 220, 0.2)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(moonX + 5, moonY - 2, moonR * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(15, 12, 41, 0.2)";
      ctx.fill();

      const pyramids = [
        { cx: offset + W * 0.25, w: 180, h: 140, depth: 0.8 },
        { cx: offset + W * 0.55, w: 260, h: 200, depth: 1 },
        { cx: offset + W * 0.78, w: 140, h: 110, depth: 0.6 },
      ];

      pyramids.sort((a, b) => a.depth - b.depth);

      for (const pyr of pyramids) {
        const px = pyr.cx;
        const pw = pyr.w * Math.min(W / 1200, 1);
        const ph = pyr.h * Math.min(H / 700, 1);
        const py = groundY;
        const peakY = py - ph;

        ctx.beginPath();
        ctx.moveTo(px, peakY);
        ctx.lineTo(px + pw / 2 + pw * 0.3, py);
        ctx.lineTo(px + pw / 2, py);
        ctx.closePath();
        ctx.fillStyle = `rgba(0, 0, 0, ${0.08 * pyr.depth})`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(px, peakY);
        ctx.lineTo(px - pw / 2, py);
        ctx.lineTo(px, py);
        ctx.closePath();

        const leftGrad = ctx.createLinearGradient(px - pw / 2, py, px, peakY);
        leftGrad.addColorStop(0, `rgba(194, 155, 80, ${0.15 * pyr.depth})`);
        leftGrad.addColorStop(0.5, `rgba(212, 175, 100, ${0.2 * pyr.depth})`);
        leftGrad.addColorStop(1, `rgba(230, 195, 120, ${0.12 * pyr.depth})`);
        ctx.fillStyle = leftGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(px, peakY);
        ctx.lineTo(px + pw / 2, py);
        ctx.lineTo(px, py);
        ctx.closePath();

        const rightGrad = ctx.createLinearGradient(px + pw / 2, py, px, peakY);
        rightGrad.addColorStop(0, `rgba(150, 115, 55, ${0.12 * pyr.depth})`);
        rightGrad.addColorStop(0.5, `rgba(170, 130, 65, ${0.16 * pyr.depth})`);
        rightGrad.addColorStop(1, `rgba(190, 150, 80, ${0.1 * pyr.depth})`);
        ctx.fillStyle = rightGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(px - pw / 2, py);
        ctx.lineTo(px, peakY);
        ctx.lineTo(px + pw / 2, py);
        ctx.strokeStyle = `rgba(212, 175, 55, ${0.2 * pyr.depth})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        const pyrGlow = ctx.createRadialGradient(
          px, peakY + ph * 0.4, 10, px, peakY + ph * 0.4, pw
        );
        pyrGlow.addColorStop(0, `rgba(212, 175, 55, ${0.04 * pyr.depth})`);
        pyrGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = pyrGlow;
        ctx.fillRect(px - pw, peakY, pw * 2, ph);

        if (pyr.depth > 0.7) {
          const rows = 6;
          for (let r = 1; r < rows; r++) {
            const ry = peakY + (ph * r) / rows;
            const fraction = r / rows;
            const lw = pw * fraction;
            ctx.beginPath();
            ctx.moveTo(px - lw / 2, ry);
            ctx.lineTo(px + lw / 2, ry);
            ctx.strokeStyle = `rgba(212, 175, 55, ${0.06 * pyr.depth})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      const drawCat = () => {
        const cx = isDesktop ? W * 0.55 : W * 0.25;
        const cy = groundY;

        ctx.save();
        ctx.translate(cx, cy);

        const intensity = catAliveTimer > 0 ? 0.4 + Math.sin(time * 5) * 0.1 : 0.2;
        const catGlow = ctx.createRadialGradient(-2, -30, 0, -2, -30, 40);
        catGlow.addColorStop(0, `rgba(212, 175, 55, ${intensity})`);
        catGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = catGlow;
        ctx.fillRect(-45, -90, 90, 90);

        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.quadraticCurveTo(-10, -40, -5, -60);
        ctx.quadraticCurveTo(15, -40, 15, 0);
        ctx.fillStyle = "rgba(15, 12, 20, 1)"; 
        ctx.fill();

        ctx.beginPath();
        ctx.arc(-2, -65, 12, 0, Math.PI * 2);
        ctx.fill();

        if (catAliveTimer > 0) {

          ctx.beginPath();
          ctx.ellipse(-6, -67, 2, 4, Math.sin(time * 10) * 0.1, 0, Math.PI * 2);
          ctx.ellipse(2, -67, 2, 4, Math.sin(time * 10) * 0.1, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(167, 139, 250, 1)";
          ctx.fill();

          ctx.beginPath();
          ctx.arc(-6, -67, 6, 0, Math.PI * 2);
          ctx.arc(2, -67, 6, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(167, 139, 250, 0.4)";
          ctx.fill();
        }

        ctx.beginPath();
        ctx.moveTo(-10, -70);
        ctx.lineTo(-14, -85);
        ctx.lineTo(-2, -75);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(6, -70);
        ctx.lineTo(10, -85);
        ctx.lineTo(-2, -75);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-10, -55);
        ctx.lineTo(6, -55);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.9)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(12, -10);
        if (catAliveTimer > 0) {
           const swish = Math.sin(time * 8) * 10;
           ctx.quadraticCurveTo(25 + swish, -15, 20 + swish * 1.5, -5);
        } else {
           ctx.quadraticCurveTo(25, -5, 20, 0);
        }
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(15, 12, 20, 1)";
        ctx.stroke();

        if (catAliveTimer > 0 && Math.random() > 0.5) {
            ctx.beginPath();
            ctx.arc((Math.random() - 0.5) * 60, -90 + Math.random() * 80, Math.random() * 2 + 1, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(212, 175, 55, 0.8)";
            ctx.fill();
        }

        ctx.restore();
      };

      drawCat();
    };

    const animate = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, W, H);
      time += 0.016;
      if (catAliveTimer > 0) catAliveTimer--;

      drawPyramids(ctx);

      const windSpeed = 1 + Math.sin(time * 0.3) * 0.5;
      for (const p of sandParticles) {
        p.x += p.vx * windSpeed;
        p.y += p.vy + Math.sin(time * 2 + p.life * 10) * 0.15;
        p.a = 0.05 + Math.sin(time + p.life * 5) * 0.1 + 0.1;

        if (p.x > W + 10) {
          p.x = -5;
          p.y = Math.random() * H;
        }
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();

        ctx.ellipse(p.x, p.y, p.s * 1.5, p.s * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 100, ${Math.max(0, p.a)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    };

    resize();
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

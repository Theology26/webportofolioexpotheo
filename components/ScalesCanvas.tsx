import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";

export default function ScalesCanvas() {
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
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.3 - 0.1,
        s: Math.random() * 2 + 0.5,
        a: Math.random() * 0.2 + 0.05,
      });
    }

    let time = 0;
    let currentTilt = 0;
    let targetTilt = 0;

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

      if (Math.abs(clientX - cx) < 250 && Math.abs(clientY - cy) < 250) {
        if (clientX < cx) targetTilt = -0.25;
        else targetTilt = 0.25;
      }
    };
    window.addEventListener("mousedown", handleInteract);
    window.addEventListener("touchstart", handleInteract);

    const drawScales = (ctx: CanvasRenderingContext2D) => {
      const isDesktop = W > 800;
      const cx = isDesktop ? W * 0.75 : W / 2;
      const cy = H / 2;
      const scaleH = Math.min(H * 0.5, 320);
      const beamW = Math.min(W * 0.35, 220);

      ctx.save();
      ctx.translate(cx, cy);

      const glow = ctx.createRadialGradient(0, 0, 10, 0, 0, scaleH);
      glow.addColorStop(0, "rgba(212, 175, 55, 0.07)");
      glow.addColorStop(0.5, "rgba(124, 92, 252, 0.03)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(-scaleH, -scaleH, scaleH * 2, scaleH * 2);

      const tiltAngle = currentTilt + Math.sin(time * 0.3) * 0.035;

      const pillarH = scaleH * 0.85;
      const pillarW = 6;

      ctx.beginPath();
      ctx.ellipse(0, pillarH * 0.45, beamW * 0.3, 12, 0, 0, Math.PI * 2);
      const baseGrad = ctx.createRadialGradient(0, pillarH * 0.45, 2, 0, pillarH * 0.45, beamW * 0.3);
      baseGrad.addColorStop(0, "rgba(212, 175, 55, 0.25)");
      baseGrad.addColorStop(1, "rgba(212, 175, 55, 0.05)");
      ctx.fillStyle = baseGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const pilGrad = ctx.createLinearGradient(-pillarW, 0, pillarW, 0);
      pilGrad.addColorStop(0, "rgba(212, 175, 55, 0.15)");
      pilGrad.addColorStop(0.3, "rgba(212, 175, 55, 0.35)");
      pilGrad.addColorStop(0.7, "rgba(212, 175, 55, 0.25)");
      pilGrad.addColorStop(1, "rgba(212, 175, 55, 0.1)");
      ctx.fillStyle = pilGrad;
      ctx.fillRect(-pillarW / 2, -pillarH * 0.45, pillarW, pillarH * 0.9);

      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(-pillarW / 2 + 1, -pillarH * 0.45, 1.5, pillarH * 0.9);

      ctx.beginPath();
      ctx.arc(0, -pillarH * 0.45, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212, 175, 55, 0.3)";
      ctx.fill();
      ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -pillarH * 0.45 - 14);
      ctx.lineTo(5, -pillarH * 0.45 - 8);
      ctx.lineTo(0, -pillarH * 0.45 - 2);
      ctx.lineTo(-5, -pillarH * 0.45 - 8);
      ctx.closePath();
      ctx.fillStyle = "rgba(124, 92, 252, 0.4)";
      ctx.fill();
      ctx.strokeStyle = "rgba(167, 139, 250, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      ctx.rotate(tiltAngle);

      const beamY = -pillarH * 0.45;
      ctx.beginPath();
      ctx.moveTo(-beamW, beamY);
      ctx.lineTo(beamW, beamY);
      ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-beamW, beamY - 1);
      ctx.lineTo(beamW, beamY - 1);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const chainLen = scaleH * 0.35;
      const plateW = beamW * 0.28;
      const plateH = 8;
      const sides = [-1, 1];

      for (const side of sides) {
        const px = beamW * side;
        const plateY = beamY + chainLen;
        const plateSway = Math.sin(time * 0.7 + side * 1.5) * 2;

        const links = 8;
        for (let i = 0; i <= links; i++) {
          const ly = beamY + (chainLen * i) / links;
          const lx = px + plateSway * (i / links);
          ctx.beginPath();
          ctx.ellipse(lx, ly, 2, 4, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(212, 175, 55, ${0.2 + (i / links) * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        const psx = px + plateSway;
        ctx.beginPath();
        ctx.ellipse(psx, plateY, plateW, plateH, 0, 0, Math.PI * 2);

        const plateGrad = ctx.createRadialGradient(
          psx, plateY, 2, psx, plateY, plateW
        );
        plateGrad.addColorStop(0, "rgba(212, 175, 55, 0.25)");
        plateGrad.addColorStop(0.7, "rgba(212, 175, 55, 0.15)");
        plateGrad.addColorStop(1, "rgba(212, 175, 55, 0.05)");
        ctx.fillStyle = plateGrad;
        ctx.fill();
        ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(psx, plateY, plateW * 0.6, plateH * 0.6, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.15)";
        ctx.lineWidth = 0.5;
        ctx.stroke();

        const pglow = ctx.createRadialGradient(
          psx, plateY + 5, 0, psx, plateY + 5, plateW * 1.5
        );
        pglow.addColorStop(0, "rgba(212, 175, 55, 0.06)");
        pglow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = pglow;
        ctx.fillRect(
          psx - plateW * 1.5, plateY - plateW, plateW * 3, plateW * 2
        );
      }

      ctx.restore(); 

      ctx.restore(); 
    };

    const animate = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, W, H);
      time += 0.016;

      targetTilt *= 0.98;
      currentTilt += (targetTilt - currentTilt) * 0.08;

      drawScales(ctx);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) {
          p.y = H;
          p.x = Math.random() * W;
        }
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.a})`;
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

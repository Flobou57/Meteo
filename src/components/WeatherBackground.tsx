import { useEffect, useRef, useMemo } from "react";

interface WeatherBackgroundProps {
  weathercode: number;
  sunrise: string;
  sunset: string;
  temperature: number;
}

// Déterminer si c'est le jour ou la nuit
function isDay(sunrise: string, sunset: string): boolean {
  const now = new Date();
  const rise = new Date(sunrise);
  const set = new Date(sunset);
  return now >= rise && now <= set;
}

// Couleurs du ciel selon le moment et la météo
function getSkyGradient(code: number, day: boolean): string {
  if (!day) {
    // Nuit
    if (code >= 61) return "linear-gradient(180deg, #0a0e1a 0%, #151b30 40%, #1a2240 100%)";
    if (code >= 45) return "linear-gradient(180deg, #0c1020 0%, #1a1e35 50%, #252a40 100%)";
    return "linear-gradient(180deg, #0a0e1a 0%, #101530 30%, #0c1025 100%)";
  }

  // Jour
  if (code === 0) return "linear-gradient(180deg, #1a8aff 0%, #4da6ff 40%, #87c5ff 70%, #c0dfff 100%)";
  if (code <= 2) return "linear-gradient(180deg, #2a7ae0 0%, #5a9ae8 40%, #8ab8f0 70%, #b8d4f5 100%)";
  if (code === 3) return "linear-gradient(180deg, #4a5a6a 0%, #6a7a8a 40%, #8a9aaa 70%, #a0b0c0 100%)";
  if (code >= 45 && code <= 48) return "linear-gradient(180deg, #6a7080 0%, #8a909a 50%, #a0a5b0 100%)";
  if (code >= 51 && code <= 65) return "linear-gradient(180deg, #3a4555 0%, #4a5565 40%, #5a6575 70%, #6a7585 100%)";
  if (code >= 71 && code <= 77) return "linear-gradient(180deg, #7a8090 0%, #9aa0b0 50%, #b0b8c8 100%)";
  if (code >= 80 && code <= 82) return "linear-gradient(180deg, #2a3545 0%, #3a4555 40%, #4a5565 100%)";
  if (code >= 95) return "linear-gradient(180deg, #1a2030 0%, #2a3040 30%, #3a4050 60%, #2a3040 100%)";
  return "linear-gradient(180deg, #2a7ae0 0%, #5a9ae8 50%, #87c5ff 100%)";
}

export default function WeatherBackground({ weathercode, sunrise, sunset, temperature: _temperature }: WeatherBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const day = isDay(sunrise, sunset);
  const skyGradient = getSkyGradient(weathercode, day);

  // Déterminer le type de particules
  const particleType = useMemo(() => {
    if (weathercode >= 71 && weathercode <= 77) return "snow";
    if (weathercode >= 51 && weathercode <= 67) return "rain";
    if (weathercode >= 80 && weathercode <= 82) return "rain";
    if (weathercode >= 95) return "storm";
    if (weathercode >= 45 && weathercode <= 48) return "fog";
    return "none";
  }, [weathercode]);

  // Intensité des particules
  const intensity = useMemo(() => {
    if ([55, 65, 75, 82, 99].includes(weathercode)) return 3; // Fort
    if ([53, 63, 73, 81, 96].includes(weathercode)) return 2; // Modéré
    return 1; // Léger
  }, [weathercode]);

  // Animation canvas pour les particules
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || particleType === "none") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Particle {
      x: number;
      y: number;
      speed: number;
      size: number;
      opacity: number;
      drift: number;
    }

    const count = particleType === "snow" ? 80 * intensity : particleType === "fog" ? 15 : 120 * intensity;
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: particleType === "snow"
        ? 0.5 + Math.random() * 1.5
        : particleType === "fog"
          ? 0.2 + Math.random() * 0.3
          : 4 + Math.random() * 8 * intensity,
      size: particleType === "snow"
        ? 2 + Math.random() * 3
        : particleType === "fog"
          ? 80 + Math.random() * 120
          : 1 + Math.random() * 1.5,
      opacity: particleType === "fog"
        ? 0.03 + Math.random() * 0.06
        : 0.3 + Math.random() * 0.5,
      drift: particleType === "snow"
        ? (Math.random() - 0.5) * 0.8
        : particleType === "fog"
          ? (Math.random() - 0.5) * 0.5
          : (Math.random() - 0.5) * 1.5,
    }));

    let flash = 0;
    let animId = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Éclair d'orage
      if (particleType === "storm" && Math.random() < 0.005) {
        flash = 1;
      }
      if (flash > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flash * 0.3})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        flash -= 0.05;
      }

      for (const p of particles) {
        if (particleType === "rain" || particleType === "storm") {
          // Gouttes de pluie
          ctx.save();
          ctx.strokeStyle = `rgba(180, 210, 255, ${p.opacity})`;
          ctx.lineWidth = p.size * 0.6;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.drift * 2, p.y + p.speed * 2.5);
          ctx.stroke();
          ctx.restore();

          p.y += p.speed;
          p.x += p.drift;
        } else if (particleType === "snow") {
          // Flocons de neige
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.fill();

          p.y += p.speed;
          p.x += Math.sin(p.y * 0.01 + p.drift * 10) * 0.5 + p.drift;
        } else if (particleType === "fog") {
          // Brouillard
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, `rgba(200, 210, 220, ${p.opacity})`);
          grad.addColorStop(1, "rgba(200, 210, 220, 0)");
          ctx.fillStyle = grad;
          ctx.fill();

          p.x += p.drift;
          p.y += Math.sin(p.x * 0.005) * 0.2;
        }

        // Reset quand hors écran
        if (p.y > canvas.height + 10) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.x < -50) p.x = canvas.width + 50;
      }

      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [particleType, intensity]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        background: skyGradient,
        transition: "background 2s ease",
        overflow: "hidden",
      }}
    >
      {/* Soleil ou lune */}
      {day && weathercode <= 2 && (
        <div
          style={{
            position: "absolute",
            top: "8%",
            right: "15%",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #fff8e0 30%, #ffd040 70%, transparent 100%)",
            boxShadow: "0 0 60px 20px rgba(255, 210, 60, 0.3), 0 0 120px 40px rgba(255, 180, 40, 0.15)",
            animation: "pulse-sun 4s ease-in-out infinite",
          }}
        />
      )}
      {!day && (
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "20%",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #e8e4d8 0%, #c8c0b0 60%, #a8a090 100%)",
            boxShadow: "0 0 40px 10px rgba(200, 195, 180, 0.15), 0 0 80px 20px rgba(180, 175, 160, 0.08)",
          }}
        />
      )}

      {/* Étoiles la nuit */}
      {!day && (
        <div style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${(i * 37 + 13) % 100}%`,
                top: `${(i * 23 + 7) % 60}%`,
                width: `${1 + (i % 3)}px`,
                height: `${1 + (i % 3)}px`,
                borderRadius: "50%",
                background: "white",
                opacity: 0.3 + (i % 5) * 0.12,
                animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite ${(i % 7) * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Nuages */}
      {weathercode >= 2 && weathercode <= 3 && day && (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${10 + i * 8}%`,
                left: `-20%`,
                width: `${180 + i * 40}px`,
                height: `${60 + i * 15}px`,
                borderRadius: "50%",
                background: `rgba(255, 255, 255, ${0.6 - i * 0.15})`,
                filter: "blur(8px)",
                animation: `cloud-drift ${40 + i * 15}s linear infinite`,
                animationDelay: `${i * -12}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Canvas pour les particules */}
      {particleType !== "none" && (
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Animations CSS */}
      <style>{`
        @keyframes pulse-sun {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.9; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        @keyframes cloud-drift {
          0% { transform: translateX(-20vw); }
          100% { transform: translateX(120vw); }
        }
      `}</style>
    </div>
  );
}

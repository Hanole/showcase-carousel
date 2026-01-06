import { useMemo } from 'react';
import './ParticleBackground.css';

export default function ParticleBackground() {
const colors = [
  'hsl(200, 70%, 30%)', // Dark Blue
  'hsl(200, 70%, 40%)', // Medium Dark Blue
  'hsl(200, 70%, 50%)', // Blue
  'hsl(200, 70%, 60%)', // Light Blue
  'hsl(200, 70%, 70%)', // Lighter Blue
];


  const particleCount = 30;

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => {
      const size = Math.random() * 5 + 5;
      const opacity = Math.random() * 0.5 + 0.3;
      const color = colors[i % colors.length];
      
      const startX = Math.random() * 90;
      const startY = Math.random() * 90;
      const startZ = Math.random() * 100;
      const endX = Math.random() * 90;
      const endY = Math.random() * 90;
      const endZ = Math.random() * 100;
      const delay = -i * 0.2;

      return {
        size,
        opacity,
        color,
        startX,
        startY,
        startZ,
        endX,
        endY,
        endZ,
        delay,
      };
    });
  }, []); // Critical: empty dependency array

  return (
    <div id="particle-container">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="particle"
          style={{
            height: `${particle.size}px`,
            width: `${particle.size}px`,
            opacity: particle.opacity,
            background: particle.color,
            animationDelay: `${particle.delay}s`,
            '--start-x': `${particle.startX}vw`,
            '--start-y': `${particle.startY}vh`,
            '--start-z': `${particle.startZ}px`,
            '--end-x': `${particle.endX}vw`,
            '--end-y': `${particle.endY}vh`,
            '--end-z': `${particle.endZ}px`,
          }}
        ></div>
      ))}
    </div>
  );
}

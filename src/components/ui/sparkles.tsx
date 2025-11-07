"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SparklesProps {
  className?: string;
  size?: number;
  minSize?: number;
  density?: number;
  speed?: number;
  minSpeed?: number;
  opacity?: number;
  direction?: "top" | "bottom" | "left" | "right";
  opacitySpeed?: number;
  minOpacity?: number;
  color?: string;
  background?: string;
}

export const SparklesCore = (props: SparklesProps) => {
  const {
    className = "",
    size = 1.2,
    minSize = 0.4,
    density = 50,
    speed = 1.5,
    minSpeed = 0.5,
    opacity = 1,
    direction = "top",
    minOpacity = 0.1,
    color = "#FFF",
    background = "transparent",
  } = props;

  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    speedY: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < density; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * (size - minSize) + minSize,
          speedY: Math.random() * (speed - minSpeed) + minSpeed,
          opacity: Math.random() * (opacity - minOpacity) + minOpacity,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, [density, size, minSize, speed, minSpeed, opacity, minOpacity]);

  if (particles.length === 0) {
    return <div className={className} style={{ background }} />;
  }

  return (
    <div
      className={className}
      style={{
        background,
      }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={`${particle.x}%`}
            cy={`${particle.y}%`}
            r={particle.size}
            fill={color}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [particle.opacity, minOpacity, particle.opacity],
              cy: direction === "top" 
                ? [`${particle.y}%`, `${particle.y - 20}%`] 
                : [`${particle.y}%`, `${particle.y + 20}%`],
            }}
            transition={{
              duration: particle.speedY * 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
};

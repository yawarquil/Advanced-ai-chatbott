import React from 'react';
import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { ISourceOptions, MoveDirection } from 'tsparticles-engine';

export type ParticlePreset = 'geometric' | 'sparkles' | 'bubbles' | 'stars' | 'thunderstorm' | 'matrix' | 'fireflies' | 'snow' | 'neon' | 'galaxy' | 'rain' | 'electric';

interface ParticleBackgroundProps {
  preset?: ParticlePreset;
}

const getOptions = (preset: ParticlePreset): ISourceOptions => {
  switch (preset) {
    case 'sparkles':
      return {
        particles: {
          number: { value: 60 },
          color: { value: '#fff' },
          shape: { type: 'star' },
          opacity: { 
            value: 0.7,
            animation: { enable: true, speed: 2, minimumValue: 0.1 }
          },
          size: { value: 2, random: true },
          move: { enable: true, speed: 1.5, direction: 'none' as MoveDirection, outModes: { default: 'out' } },
        },
        background: { color: 'transparent' },
        fullScreen: { enable: false },
      };

    case 'bubbles':
      return {
        particles: {
          number: { value: 40 },
          color: { value: '#aee9f7' },
          shape: { type: 'circle' },
          opacity: { value: 0.3 },
          size: { value: 12, random: true },
          move: { enable: true, speed: 0.8, direction: 'top' as MoveDirection, outModes: { default: 'out' } },
        },
        background: { color: 'transparent' },
        fullScreen: { enable: false },
      };

    case 'stars':
      return {
        particles: {
          number: { value: 100 },
          color: { value: ['#ffffff', '#ffeb3b', '#03a9f4', '#ff5722'] },
          shape: { type: 'star' },
          opacity: { 
            value: 0.8,
            animation: { enable: true, speed: 3, minimumValue: 0.1, sync: false }
          },
          size: { 
            value: 3, 
            random: { enable: true, minimumValue: 1 },
            animation: { enable: true, speed: 2, minimumValue: 0.5 }
          },
          move: { enable: false },
          twinkle: {
            particles: {
              enable: true,
              frequency: 0.05,
              opacity: 1
            }
          }
        },
        background: { color: 'transparent' },
        fullScreen: { enable: false },
      };

    case 'thunderstorm':
      return {
        particles: {
          number: { value: 150 },
          color: { value: ['#87ceeb', '#4682b4', '#1e90ff'] },
          shape: { type: 'line' },
          opacity: { 
            value: 0.6,
            animation: { enable: true, speed: 8, minimumValue: 0.1 }
          },
          size: { value: 1, random: true },
          move: { 
            enable: true, 
            speed: 15, 
            direction: 'bottom' as MoveDirection, 
            straight: true,
            outModes: { default: 'out' } 
          },
          stroke: { width: 1, color: '#ffffff' }
        },
        background: { color: 'transparent' },
        fullScreen: { enable: false },
        emitters: {
          direction: 'bottom' as MoveDirection,
          life: { count: 0, duration: 0.1, delay: 2 },
          rate: { delay: 0.1, quantity: 10 },
          size: { width: 0, height: 0 }
        }
      };

    case 'matrix':
      return {
        particles: {
          number: { value: 80 },
          color: { value: '#00ff00' },
          shape: { type: 'char', options: { char: { value: ['0', '1', 'ﾊ', 'ﾐ', 'ﾋ', 'ｰ', 'ｳ', 'ｼ', 'ﾅ', 'ﾓ', 'ﾆ', 'ｻ', 'ﾜ'] } } },
          opacity: { 
            value: 0.8,
            animation: { enable: true, speed: 3, minimumValue: 0.2 }
          },
          size: { value: 16, random: true },
          move: { 
            enable: true, 
            speed: 5, 
            direction: 'bottom' as MoveDirection,
            straight: true,
            outModes: { default: 'out' } 
          },
        },
        background: { color: 'transparent' },
        fullScreen: { enable: false },
      };

    case 'fireflies':
      return {
        particles: {
          number: { value: 50 },
          color: { value: ['#ffff00', '#ffeb3b', '#ffc107', '#ff9800'] },
          shape: { type: 'circle' },
          opacity: { 
            value: 0.7,
            animation: { enable: true, speed: 4, minimumValue: 0.1, sync: false }
          },
          size: { 
            value: 4, 
            random: true,
            animation: { enable: true, speed: 3, minimumValue: 1 }
          },
          move: { 
            enable: true, 
            speed: 2, 
            direction: 'none' as MoveDirection,
            random: true,
            straight: false,
            outModes: { default: 'bounce' }
          },
        },
        background: { color: 'transparent' },
        fullScreen: { enable: false },
      };

    case 'snow':
      return {
        particles: {
          number: { value: 100 },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.7 },
          size: { value: 3, random: true },
          move: { 
            enable: true, 
            speed: 2, 
            direction: 'bottom' as MoveDirection,
            random: true,
            straight: false,
            outModes: { default: 'out' }
          },
        },
        background: { color: 'transparent' },
        fullScreen: { enable: false },
      };

    case 'neon':
      return {
        particles: {
          number: { value: 60 },
          color: { value: ['#ff0080', '#00ff80', '#8000ff', '#ff8000', '#0080ff'] },
          shape: { type: 'triangle' },
          opacity: { 
            value: 0.8,
            animation: { enable: true, speed: 5, minimumValue: 0.3 }
          },
          size: { 
            value: 6, 
            random: true,
            animation: { enable: true, speed: 4, minimumValue: 2 }
          },
          move: { 
            enable: true, 
            speed: 3, 
            direction: 'none' as MoveDirection,
            outModes: { default: 'bounce' }
          },
          stroke: { width: 2, color: '#ffffff' }
        },
        background: { color: 'transparent' },
        fullScreen: { enable: false },
      };

    case 'galaxy':
      return {
        particles: {
          number: { value: 200 },
          color: { value: ['#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4'] },
          shape: { type: 'circle' },
          opacity: { 
            value: 0.6,
            animation: { enable: true, speed: 1, minimumValue: 0.1 }
          },
          size: { value: 2, random: true },
          move: { 
            enable: true, 
            speed: 0.5, 
            direction: 'none' as MoveDirection,
            outModes: { default: 'out' }
          },
        },
        background: { color: 'transparent' },
        fullScreen: { enable: false },
      };

    case 'rain':
      return {
        particles: {
          number: { value: 120 },
          color: { value: ['#87ceeb', '#4682b4', '#1e90ff', '#00bfff'] },
          shape: { type: 'line' },
          opacity: { value: 0.6 },
          size: { value: 2, random: true },
          move: { 
            enable: true, 
            speed: 10, 
            direction: 'bottom-right' as MoveDirection,
            straight: true,
            outModes: { default: 'out' }
          },
          stroke: { width: 1, color: '#ffffff' }
        },
        background: { color: 'transparent' },
        fullScreen: { enable: false },
      };

    case 'electric':
      return {
        particles: {
          number: { value: 40 },
          color: { value: ['#00ffff', '#ffff00', '#ff00ff', '#ffffff'] },
          shape: { type: 'star' },
          opacity: { 
            value: 0.9,
            animation: { enable: true, speed: 10, minimumValue: 0.1, sync: false }
          },
          size: { 
            value: 5, 
            random: true,
            animation: { enable: true, speed: 8, minimumValue: 1 }
          },
          move: { 
            enable: true, 
            speed: 6, 
            direction: 'none' as MoveDirection,
            random: true,
            straight: false,
            outModes: { default: 'bounce' }
          },
          stroke: { width: 2, color: '#ffffff' }
        },
        background: { color: 'transparent' },
        fullScreen: { enable: false },
      };

    case 'geometric':
    default:
      return {
        particles: {
          number: { value: 50 },
          color: { value: ['#3b82f6', '#f59e42', '#a78bfa', '#f472b6', '#34d399'] },
          shape: { type: ['polygon', 'triangle', 'edge'] },
          opacity: { value: 0.5 },
          size: { value: 8, random: true },
          move: { enable: true, speed: 1.2, direction: 'none' as MoveDirection, outModes: { default: 'out' } },
        },
        background: { color: 'transparent' },
        fullScreen: { enable: false },
      };
  }
};

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ preset = 'geometric' }) => {
  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Particles
        id="tsparticles-bg"
        init={particlesInit}
        options={getOptions(preset)}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ParticleBackground; 
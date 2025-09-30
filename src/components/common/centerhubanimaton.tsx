'use client'

/**
 * CenterHubAnimation — Premium Hub with Icons (Animated)
 * Fills its parent (left column) and resizes responsively with powerful hover effects.
 * Tailwind used only for layout & typography.
 */

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { IconType } from 'react-icons'
import {
  FiBell,
  FiClock,
  FiMapPin,
  FiArchive,
  FiCode,
  FiTruck,
  FiUserCheck,
  FiCpu,
  FiBarChart2,
} from 'react-icons/fi'

type NodeSpec = { label: string; icon: IconType }

const NODES: NodeSpec[] = [
  { label: 'Alerts', icon: FiBell },
  { label: 'Reminders', icon: FiClock },
  { label: 'Live Tracking', icon: FiMapPin },
  { label: 'History Tracking', icon: FiArchive },
  { label: 'Developers / API', icon: FiCode },
  { label: 'Logistics', icon: FiTruck },
  { label: 'Drivers Behaviour', icon: FiUserCheck },
  { label: 'Sensors', icon: FiCpu },
  { label: 'Reports', icon: FiBarChart2 },
]

const NODE_DIAM = 64 // px
const NODE_R = NODE_DIAM / 2

export default function CenterHubAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 900, h: 600 })
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [centerHovered, setCenterHovered] = useState(false)

  // Responsive measurement of the parent box
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setDims({
        w: Math.max(360, r.width),
        h: Math.max(360, r.height),
      })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const layout = useMemo(() => computeLayout(NODES, dims), [dims])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[50vh] md:min-h-[70vh] rounded-3xl text-neutral-900 overflow-hidden "
    >
      {/* SVG connectors + moving orbs */}
      <svg
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      >
        {layout.map((p, i) => (
          <g key={i}>
            <path 
              d={p.path} 
              className={`link ${i % 3 === 0 ? 'delayed' : ''} ${hoveredNode === i ? 'active' : ''}`} 
              stroke={hoveredNode === i ? "#151516ff" : "#111"} 
              strokeWidth={hoveredNode === i ? "3" : "1.6"}
            />
            {/* signal orb traveling along the path (forth & back) */}
            <circle 
              r={hoveredNode === i ? 6 : 4} 
              fill={hoveredNode === i ? "#0f0f0fff" : "#111"} 
              className="orb"
            >
              <animateMotion
                dur={`${hoveredNode === i ? 1.5 : (2.2 + (i % 4) * 0.35).toFixed(2)}s`}
                repeatCount="indefinite"
                keyPoints="0;1;0"
                keyTimes="0;0.6;1"
                calcMode="spline"
                keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1"
                path={p.path}
                begin={`${i * 0.16}s`}
              />
            </circle>
          </g>
        ))}
        {/* center disc with glow effect */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle 
          cx={dims.w / 2} 
          cy={dims.h / 2} 
          r={centerHovered ? 45 : 38} 
          fill={centerHovered ? "#1f2937" : "#111"}
          filter={centerHovered ? "url(#glow)" : "none"}
          className="transition-all duration-300"
        />
      </svg>

      {/* Center widget with icon + label */}
      <div
        className="absolute grid place-items-center select-none cursor-pointer"
        style={{ left: dims.w / 2, top: dims.h / 2, transform: 'translate(-50%,-50%)' }}
        onMouseEnter={() => setCenterHovered(true)}
        onMouseLeave={() => setCenterHovered(false)}
      >
        <div 
          className={`relative rounded-full bg-neutral-900 text-white grid place-items-center shadow-[0_22px_60px_-10px_rgba(0,0,0,0.55)] transition-all duration-500 ${
            centerHovered 
              ? 'size-[140px] shadow-[0_30px_80px_-10px_rgba(0,0,0,0.7)] bg-gradient-to-br from-gray-800 via-gray-900 to-black' 
              : 'size-[120px]'
          }`}
        >
          <FiMapPin className={`transition-all duration-300 ${centerHovered ? 'text-4xl scale-110' : 'text-3xl'}`} />
          <div className={`absolute -bottom-12 text-neutral-800 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
            centerHovered ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-2'
          }`}>
            {/* Fleet Tracking Hub */}
          </div>
        </div>
      </div>

      {/* Icon nodes with enhanced hover effects */}
      {layout.map((p, i) => {
        const Icon = NODES[i].icon
        const isHovered = hoveredNode === i
        return (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 select-none text-center cursor-pointer group"
            style={{ left: p.x, top: p.y }}
            onMouseEnter={() => setHoveredNode(i)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div className={`rounded-full bg-white shadow-md ring-1 ring-black/10 flex items-center justify-center mx-auto transition-all duration-500 ${
              isHovered 
                ? 'w-20 h-20 shadow-xl ring-2 ring-black-500/30 bg-gradient-to-br from-white via-black-50 to-black-100 scale-110 -translate-y-2' 
                : 'w-16 h-16 hover:shadow-lg hover:scale-105'
            }`}>
              <Icon className={`text-neutral-800 transition-all duration-300 ${
                isHovered ? 'text-2xl text-black-600' : 'text-xl group-hover:text-black-500'
              }`} />
            </div>
            <div className={`mt-2 text-sm font-medium text-neutral-800 whitespace-nowrap transition-all duration-300 ${
              isHovered 
                ? 'text-black-600 font-semibold transform -translate-y-1 scale-105' 
                : 'group-hover:text-black-500'
            }`}>
              {NODES[i].label}
            </div>
            
            {/* Hover description tooltip */}
            {/* {isHovered && (
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 animate-fade-in z-10 whitespace-nowrap">
                Click to explore {NODES[i].label}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )} */}
          </div>
        )
      })}

      <style jsx>{`
        .link {
          fill: none;
          stroke-linecap: round;
          stroke-dasharray: 0 10;
          animation: dash 2.3s linear infinite;
          opacity: 0.86;
          transition: all 0.3s ease;
        }
        .link.active {
          stroke-dasharray: 0 8;
          animation: dash-fast 1.5s linear infinite;
          opacity: 1;
          filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.6));
        }
        .link.delayed {
          animation-delay: 0.35s;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -150;
          }
        }
        @keyframes dash-fast {
          to {
            stroke-dashoffset: -120;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px) translateX(-50%);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

/**
 * Compute perfectly aligned radial positions, and build curved dotted paths
 * that terminate on the edge of each circular node (not the center).
 */
function computeLayout(nodes: NodeSpec[], dims: { w: number; h: number }) {
  const { w, h } = dims
  const cx = w / 2
  const cy = h / 2
  const radius = Math.min(w, h) * 0.36 // distance to node centers (increased for better spacing)
  const step = (Math.PI * 2) / nodes.length
  const startAngle = -Math.PI / 2 // start at top

  return nodes.map((n, i) => {
    const angle = startAngle + i * step
    const nx = cx + radius * Math.cos(angle)
    const ny = cy + radius * Math.sin(angle)

    // Endpoint on circle edge along the ray center→node
    const ux = Math.cos(angle)
    const uy = Math.sin(angle)
    const ex = nx - ux * NODE_R
    const ey = ny - uy * NODE_R

    // Gentle curve via quadratic control point (perpendicular offset)
    const midX = (cx + ex) / 2
    const midY = (cy + ey) / 2
    const ctrlX = midX + Math.cos(angle - Math.PI / 2) * 60 * (i % 2 ? 1 : -1)
    const ctrlY = midY + Math.sin(angle - Math.PI / 2) * 60 * (i % 2 ? 1 : -1)

    const path = `M ${cx} ${cy} Q ${ctrlX} ${ctrlY}, ${ex} ${ey}`

    return { label: n.label, x: nx, y: ny, path }
  })
}
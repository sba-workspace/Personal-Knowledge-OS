
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface GraphViewProps {
  onNodeClick: (id: string) => void;
}

interface Node {
  id: string;
  title: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tags: string[];
}

interface Link {
  source: string;
  target: string;
}

export const GraphView = ({ onNodeClick }: GraphViewProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Mock graph data
  const nodes: Node[] = [
    { id: '1', title: 'React Architecture', x: 300, y: 200, vx: 0, vy: 0, tags: ['React'] },
    { id: '2', title: 'Knowledge Graphs', x: 500, y: 300, vx: 0, vy: 0, tags: ['AI'] },
    { id: '3', title: 'Database Design', x: 200, y: 400, vx: 0, vy: 0, tags: ['Database'] },
    { id: '4', title: 'TypeScript Patterns', x: 600, y: 150, vx: 0, vy: 0, tags: ['TypeScript'] },
    { id: '5', title: 'API Architecture', x: 400, y: 450, vx: 0, vy: 0, tags: ['Backend'] },
  ];

  const links: Link[] = [
    { source: '1', target: '4' },
    { source: '1', target: '5' },
    { source: '2', target: '3' },
    { source: '3', target: '5' },
    { source: '4', target: '5' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let isDragging = false;
    let dragNode: Node | null = null;
    let zoom = 1;
    let panX = 0;
    let panY = 0;

    const simulate = () => {
      // Simple force simulation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Apply forces
      nodes.forEach(node => {
        // Center force
        const dx = centerX - node.x;
        const dy = centerY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
          node.vx += dx * 0.001;
          node.vy += dy * 0.001;
        }

        // Repulsion between nodes
        nodes.forEach(other => {
          if (node !== other) {
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0 && distance < 150) {
              const force = 100 / (distance * distance);
              node.vx += (dx / distance) * force;
              node.vy += (dy / distance) * force;
            }
          }
        });

        // Damping
        node.vx *= 0.9;
        node.vy *= 0.9;

        // Update position
        if (!isDragging || dragNode !== node) {
          node.x += node.vx;
          node.y += node.vy;
        }
      });

      // Link forces
      links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const targetDistance = 100;
          
          if (distance > 0) {
            const force = (distance - targetDistance) * 0.1;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            
            source.vx += fx;
            source.vy += fy;
            target.vx -= fx;
            target.vy -= fy;
          }
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      ctx.save();
      ctx.translate(panX, panY);
      ctx.scale(zoom, zoom);

      // Draw links
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach(node => {
        // Node circle
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
        ctx.fill();

        // Node border
        ctx.strokeStyle = '#1d4ed8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node text
        ctx.fillStyle = 'white';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);

        // Node title
        ctx.fillStyle = '#374151';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.title, node.x, node.y + 45);
      });

      ctx.restore();
    };

    const animate = () => {
      simulate();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - panX) / zoom;
      const y = (e.clientY - rect.top - panY) / zoom;

      const clickedNode = nodes.find(node => {
        const dx = x - node.x;
        const dy = y - node.y;
        return Math.sqrt(dx * dx + dy * dy) < 25;
      });

      if (clickedNode) {
        isDragging = true;
        dragNode = clickedNode;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragNode) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - panX) / zoom;
        const y = (e.clientY - rect.top - panY) / zoom;
        
        dragNode.x = x;
        dragNode.y = y;
        dragNode.vx = 0;
        dragNode.vy = 0;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging && dragNode) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - panX) / zoom;
        const y = (e.clientY - rect.top - panY) / zoom;

        const dx = x - dragNode.x;
        const dy = y - dragNode.y;
        
        if (Math.sqrt(dx * dx + dy * dy) < 5) {
          onNodeClick(dragNode.id);
        }
      }
      isDragging = false;
      dragNode = null;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onNodeClick]);

  return (
    <div className="p-6 h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Graph</h2>
          <p className="text-gray-600">
            Visual representation of connections between your notes
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="relative h-[600px] overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          style={{ width: '100%', height: '100%' }}
        />
        
        <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium mb-2">Legend</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Note</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-gray-300"></div>
              <span>Connection</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

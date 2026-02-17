
import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

interface Props {
  value?: string;
  onChange: (dataUrl: string) => void;
}

const SignaturePad: React.FC<Props> = ({ value, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (value && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = value;
      }
    }
  }, [value]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      onChange(canvasRef.current.toDataURL());
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';

    if (isDrawing) {
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const clear = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      onChange('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden aspect-[16/6] touch-none">
        <canvas
          ref={canvasRef}
          width={360}
          height={135}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
        <button 
          onClick={clear}
          className="absolute bottom-2 right-2 bg-white/80 p-2 rounded-full text-slate-500 hover:text-red-500 shadow-sm"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <p className="text-[10px] text-center text-slate-400 font-medium">Assine acima utilizando o dedo ou caneta touch</p>
    </div>
  );
};

export default SignaturePad;

import { Canvas } from './components/Canvas';
import { ColorPicker } from './components/ColorPicker';
import { BrushSelector } from './components/BrushSelector';
import { ActionButtons } from './components/ActionButtons';
import { RegistrationLog } from './components/RegistrationLog';
import { CompletedWorks } from './components/CompletedWorks';

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-[#1A1A1A]">      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-4">
            <ColorPicker />
            <BrushSelector />
          </div>
          
          <Canvas />
          
          <ActionButtons />
        </div>
        
        <div className="space-y-4">
          <RegistrationLog />
          <CompletedWorks />
        </div>
      </div>
    </div>
  );
}
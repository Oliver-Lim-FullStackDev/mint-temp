import React, { useEffect, useRef } from 'react';
import SlotMachine from './slot-machine';
import type { SlotMachineInstance, ReelSymbolConfig, ReelConfig } from './slot-machine';
import './react-slot-machine.scss';

export interface ReactSlotMachineProps {
  id?: string;
  play?: boolean;
  reels: ReelConfig[];
  callback?: (results: ReelSymbolConfig[]) => void;
  options?: Partial<{
    reelHeight: number;
    reelWidth: number;
    reelOffset: number;
    slotYAxis: number;
    animSpeed: number;
    click2Spin: boolean;
    sounds: {
      reelsBegin?: string;
      reelsEnd?: string;
      [key: string]: string | undefined;
    };
    rngFunc: () => number;
  }>;
}

export const ReactSlotMachine: React.FC<ReactSlotMachineProps> = ({
  id = 'slot-machine',
  play = false,
  reels,
  callback,
  options
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const machineRef = useRef<SlotMachineInstance | null>(null);

  useEffect(() => {
    if (wrapperRef.current && !machineRef.current) {
      machineRef.current = new SlotMachine(
        wrapperRef.current,
        reels,
        callback,
        options
      );
    }
  }, []);

  useEffect(() => {
    if (play && machineRef.current) {
      machineRef.current.play();
    }
  }, [play]);

  return <div id={id} className="slot-machine" ref={wrapperRef}></div>;
};

export default ReactSlotMachine;


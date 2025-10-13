import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import SlotMachine from '../src/react-slot-machine';
import './index.scss';

const imageUrl = './images';
const soundUrl = './sounds';

const options = {
  reelHeight: 1200,
  reelWidth: 120,
  sounds: {
    reelsBegin: `${soundUrl}/reelsBegin.mp3`,
    reelsEnd: `${soundUrl}/reelsEnd.mp3`
  }
};

const reels = [
  {
    imageSrc: `${imageUrl}/reel-strip1.png`,
    symbols: [
      {
        title: 'XP',
        position: 100,
        weight: 5
      },
      {
        title: 'Coin',
        position: 300,
        weight: 6
      },
      {
        title: 'Raffle',
        position: 500,
        weight: 4
      },
      {
        title: 'Skull',
        position: 700,
        weight: 1
      },
      {
        title: 'Minty',
        position: 900,
        weight: 3
      },
      {
        title: 'Shamrock',
        position: 1100,
        weight: 2
      }
    ]
  },
  {
    imageSrc: `${imageUrl}/reel-strip2.png`,
    symbols: [{
      title: 'Shamrock',
      position: 100,
        weight: 2
      },
      {
        title: 'Skull',
          position: 300,
        weight: 1
      },
      {
        title: 'Minty',
          position: 500,
        weight: 3
      },
      {
        title: 'XP',
          position: 700,
        weight: 5
      },
      {
        title: 'Coin',
          position: 900,
        weight: 6
      },
      {
        title: 'Raffle',
        position: 1100,
        weight: 4,
      }
    ]
  },
  {
    imageSrc: `${imageUrl}/reel-strip3.png`,
    symbols: [{
      title: 'Minty',
      position: 100,
      weight: 3
    },
    {
      title: 'Coin',
        position: 300,
      weight: 6
    },
    {
      title: 'XP',
        position: 500,
      weight: 5
    },
    {
      title: 'Raffle',
        position: 700,
      weight: 4
    },
    {
      title: 'Skull',
        position: 900,
      weight: 1
    },
    {
      title: 'Shamrock',
        position: 1100,
      weight: 2
    }]
  }
];

const callback = (payLine: any[]) => {
  console.log(`${payLine[0].title} | ${payLine[1].title} | ${payLine[2].title}`);
  if (payLine.every((s) => s.title === payLine[0].title)) {
    new Audio(`${soundUrl}/winner.mp3`).play();
  }
};

const SlotDemo: React.FC = () => {
  const [play, setPlay] = useState(false);

  return (
    <>
      <SlotMachine reels={reels} options={options} callback={callback} play={play} />

      <button id="play-button" onClick={() => setPlay(!play)}>PLAY</button>

      <div id="slot-credits">
        <strong>5</strong> Spins Remaining
      </div>
    </>
  );
};

const container = document.getElementById('main');
if (container) {
  createRoot(container).render(<SlotDemo />);
}

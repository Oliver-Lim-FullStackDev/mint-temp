"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var client_1 = require("react-dom/client");
var react_slot_machine_1 = require("../src/react-slot-machine");
require("./index.scss");
var imageUrl = './images';
var soundUrl = './sounds';
var options = {
    reelHeight: 1200,
    reelWidth: 120,
    sounds: {
        reelsBegin: "".concat(soundUrl, "/reelsBegin.mp3"),
        reelsEnd: "".concat(soundUrl, "/reelsEnd.mp3")
    }
};
var reels = [
    {
        imageSrc: "".concat(imageUrl, "/reel-strip1.png"),
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
        imageSrc: "".concat(imageUrl, "/reel-strip2.png"),
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
        imageSrc: "".concat(imageUrl, "/reel-strip3.png"),
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
var callback = function (payLine) {
    console.log("".concat(payLine[0].title, " | ").concat(payLine[1].title, " | ").concat(payLine[2].title));
    if (payLine.every(function (s) { return s.title === payLine[0].title; })) {
        new Audio("".concat(soundUrl, "/winner.mp3")).play();
    }
};
var SlotDemo = function () {
    var _a = (0, react_1.useState)(false), play = _a[0], setPlay = _a[1];
    return (<>
      <react_slot_machine_1.default reels={reels} options={options} callback={callback} play={play}/>

      <button id="play-button" onClick={function () { return setPlay(!play); }}>PLAY</button>

      <div id="slot-credits">
        <strong>5</strong> Spins Remaining
      </div>
    </>);
};
var container = document.getElementById('main');
if (container) {
    (0, client_1.createRoot)(container).render(<SlotDemo />);
}

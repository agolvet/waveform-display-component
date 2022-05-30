import "core-js/stable";
import "regenerator-runtime/runtime";
import { render, html } from 'lit/html.js';

import WaveformDisplay from './WaveformDisplay.js'

console.info('> self.crossOriginIsolated', self.crossOriginIsolated);

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

document.body.style.backgroundColor = "black"; 

(async function main() {
  const sr = audioContext.sampleRate;
  const f0 = 5;
  const duration = 3;
  const buffer = audioContext.createBuffer(1, sr * duration, sr);
  for (var c = 0; c < buffer.numberOfChannels; c++) {
    var data = buffer.getChannelData(c);
    for (var i = 0; i < buffer.length/2; i++) {
      data[i] = Math.sin(2*Math.PI*f0*i/sr);
      // data[i] = Math.random() * 2 - 1;
    }
    for (var i = buffer.length / 2; i < buffer.length; i++) {
      data[i] = 0.5*Math.sin(2 * Math.PI * 4*f0 * i / sr);
    }
  }

  const waveformDisplay = new WaveformDisplay(150,800, true, true, false);
  waveformDisplay.setBuffer(buffer);
  waveformDisplay.setSelectionLength(1);  
  waveformDisplay.setSelectionStartTime(1);
  waveformDisplay.setCursorTime(2.7);
  waveformDisplay.setCallbackSelectionChange((start, end) => {
    console.log(start, end);
  })

  // setTimeout(() => {
  //   waveformDisplay.setStartTime(2);
  //   waveformDisplay.setSelectionStart(1.5);
  //   waveformDisplay.setSelectionEnd(2.7);
  // }, 1000);


  render(html`
    <h2>js-prototyping-template</h2>
    ${waveformDisplay.render()}
  `, document.body);
}());

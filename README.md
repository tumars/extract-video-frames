# extract-video-frames
extract video frames to canvas

## Usage
```js
import extractVideoFrames from 'extract-video-frames';

// use width appointed times
extractVideoFrames('http://xxx.mp4', {
    frames: [5, 10, 15],
}).then(canvas => {
    document.querySelector('#app').appendChild(canvas);
});

// use width appointed canvas size
extractVideoFrames('http://xxx.mp4', {
    canvasWidth: 800,
    canvasHeight: 80
}).then(canvas => {
    document.querySelector('#app').appendChild(canvas);
});
```
import {delay, once} from './utils';

async function extractVideoFrames(videoUrl, {frames, canvasWidth, canvasHeight}) {
    const videoMeta = await getVideoMetaByUrl(videoUrl);

    if (canvasWidth && canvasHeight) {
        videoMeta.width = canvasHeight * videoMeta.width / videoMeta.height;
        videoMeta.height = canvasHeight;
        frames = getFramesByCanvasWidth(videoMeta, canvasWidth)
    }

    return createCanvasByFrames(videoMeta, frames);
}


function getFramesByCanvasWidth(videoMeta, canvasWidth) {
    const timeDelta = videoMeta.width / canvasWidth * videoMeta.duration;
    const frames = [];
    let time = 0; 
    
    while (time < videoMeta.duration) {
        frames.push(time);
        time = time + timeDelta;
    }

    return frames;
}


function createCanvasByFrames(videoMeta, frames) {
    const {url, width, height} = videoMeta;
    const video = createVideoEl(width, height);
    const canvas = createCanvasEl(width * frames.length, height);
    const ctx = canvas.getContext('2d');

    const handleVideoCanPlay = once(async () => {
        let index = 0;
        let xDelta = 0;
        while (index < frames.length) {
            const time = frames[index];
            video.currentTime = time;
            await video.play();
            video.pause();
            ctx.drawImage(video, xDelta, 0, width, height);

            // 等待视频刷新(30 FPS (NTSC) or 25 FPS (PAL), ie 1000 / 30)
            // https://stackoverflow.com/questions/21197707/html5-video-to-canvas-playing-very-slow
            await delay(34);
            xDelta += width;
            index++;
        }
    });

    video.addEventListener('canplaythrough', handleVideoCanPlay);

    video.src = url;
    return canvas;
}


function createVideoEl(width, height) {
    const video = document.createElement('video');
    video.width = width;
    video.height = height;
    video.muted = true;
    return video;
}

function createCanvasEl(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function getVideoMetaByUrl(videoUrl) {
    return new Promise(resolve => {
        const el = document.createElement('video');
        el.src = videoUrl;
        el.addEventListener( "loadedmetadata", function () {
            resolve({
                duration: this.duration,
                height: this.videoHeight,
                width: this.videoWidth,
                url: videoUrl,
            });
        }, false);
    });
}

export default extractVideoFrames;

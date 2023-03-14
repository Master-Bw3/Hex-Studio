//TODO: generate an animated gif instead of an image

var gif_encoder = window.gif_encoder;

const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

function get_trim_bounds(c) {
    var ctx = c.getContext('2d'),
        copy = document.createElement('canvas').getContext('2d'),
        pixels = ctx.getImageData(0, 0, c.width, c.height),
        l = pixels.data.length,
        i,
        bound = {
            top: null,
            left: null,
            right: null,
            bottom: null,
        },
        x,
        y;

    // Iterate over every pixel to find the highest
    // and where it ends on every axis ()
    for (i = 0; i < l; i += 4) {
        if (pixels.data[i + 3] !== 0) {
            x = (i / 4) % c.width;
            y = ~~(i / 4 / c.width);

            if (bound.top === null) {
                bound.top = y;
            }

            if (bound.left === null) {
                bound.left = x;
            } else if (x < bound.left) {
                bound.left = x;
            }

            if (bound.right === null) {
                bound.right = x;
            } else if (bound.right < x) {
                bound.right = x;
            }

            if (bound.bottom === null) {
                bound.bottom = y;
            } else if (bound.bottom < y) {
                bound.bottom = y;
            }
        }
    }
    bound.left -= 10
    bound.top -= 10

    return bound
}

function trim_canvas(c, bound) {
    var ctx = c.getContext('2d'),
        copy = document.createElement('canvas').getContext('2d')

    var trimHeight = bound.bottom - bound.top + 10;
    var trimWidth = bound.right - bound.left + 10;
    if (trimHeight == 0) {
        return c;
    }

    var trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

    copy.canvas.width = trimWidth;
    copy.canvas.height = trimHeight;
    copy.putImageData(trimmed, 0, 0);

    // Return trimmed canvas
    return copy.canvas;
}

async function grid_to_gif() {
    let encoder;

    n = 10;
    let bounds;

    for (let i = 0; i < n; i++) {
        const input = document.querySelector('#grid_drawing');

        const svgData = new XMLSerializer().serializeToString(input);
        const svgDataBase64 = btoa(svgData);
        const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`;
        let dataUrl;

        await sleep(100);
        const image = new Image();
        image.src = svgDataUrl;

        await new Promise(function (resolve, reject) {
            image.addEventListener('load', () => {
                const width = input.getAttribute('width');
                const height = input.getAttribute('height');
                let canvas = document.createElement('canvas');

                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                const context = canvas.getContext('2d');

                context.drawImage(image, 10, 10, width, height);

                if (typeof bounds === 'undefined') {
                    bounds = get_trim_bounds(canvas)
                }

                const trimmedCanvas = trim_canvas(canvas, bounds);
                const tc_context = trimmedCanvas.getContext('2d');

                if (typeof encoder === 'undefined') {
                    encoder = new gif_encoder(trimmedCanvas.width, trimmedCanvas.height, "octree");
                    encoder.setDelay(100);
                    encoder.setTransparent(true);
                    encoder.setQuality(30)
                    encoder.start();
                }

                encoder.addFrame(tc_context);

                resolve();
            });
        });
    }
    encoder.finish();

    var blob = new Blob([encoder.out.getData()], {'type': 'image/gif'});
    var url = URL.createObjectURL(blob)
    console.log(url)
    return url;
}

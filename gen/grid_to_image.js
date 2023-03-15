//TODO: generate an animated gif instead of an image
// MIT http://rem.mit-license.org
function trimCanvas(c) {
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

    // Calculate the height and width of the content

    var trimHeight = bound.bottom - bound.top;
    var trimWidth = bound.right - bound.left;
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

async function grid_to_image() {
    const input = document.querySelector('#grid_drawing');
    const output = document.querySelector('#grid_drawing_gif');
    function get_svg_height_width() {
        const paths = Array.from(document.querySelectorAll('#grid_drawing > path'));

        const path_points = paths
            .map((path) => {
                let CoordsList = path
                    .getAttribute('d')
                    .slice(1)
                    .split(' ')
                    .map((point) => parseFloat(point));

                let YCoordsList = CoordsList;
                CoordsList.forEach((_, index) => {
                    if (index % 2 == 0) {
                        YCoordsList.splice(index, 1);
                    }
                });

                return YCoordsList;
            })
            .flat();
    }
    get_svg_height_width();

    const svgData = new XMLSerializer().serializeToString(input);
    const svgDataBase64 = btoa(svgData);
    const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`;
    let dataUrl;
    let trimmedCanvas;

    // console.log(svgData)
    // console.log(encodeURIComponent(svgData))
    // console.log(decodeURIComponent(encodeURIComponent(svgData)))
    // console.log(btoa(decodeURIComponent(encodeURIComponent(svgData))))

    const image = new Image();
    image.src = svgDataUrl;

    await new Promise(function (resolve, reject) {
        image.addEventListener('load', () => {
            const width = input.getAttribute('width');
            const height = input.getAttribute('height');
            const canvas = document.createElement('canvas');

            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0, width, height);
            trimmedCanvas = trimCanvas(canvas);

            resolve();
        });
    });
    await new Promise(function (resolve, reject) {
        trimmedCanvas.toBlob(function (blob) {
            dataUrl = URL.createObjectURL(blob);

            resolve();
        });
    });

    return dataUrl;
}

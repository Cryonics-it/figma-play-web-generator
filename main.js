let companyName = document.getElementById("companyName");
let prototypeLink = document.getElementById("prototypeLink");
let clientLogo = document.getElementById("clientLogo");
let collabLogo = document.getElementById("collabLogo");

var imageSrc = null;
clientLogo.addEventListener("change", () => {
	const selectedFile = clientLogo.files[0];
	const reader = new FileReader();
	if (selectedFile) reader.readAsDataURL(selectedFile);
	// FileReader will emit the load event when the data URL is ready
	// Access the string using result property inside the callback function
	reader.addEventListener("load", () => {
		// Get the data URL string
		imageSrc = reader.result;
	});
});

function getBase64Image(img) {
	// Create an empty canvas element
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;

	// Copy the image contents to the canvas
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	// Get the data-URL formatted image
	// Firefox supports PNG and JPEG. You could check img.src to
	// guess the original format, but be aware the using "image/jpg"
	// will re-encode the image.
	var dataURL = canvas.toDataURL();
	console.log(dataURL);
	return dataURL;
}

const createFigmaPlay = () => {
	let figmaPlayHTML = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${companyName.value} X Cryonics</title>
        <meta property="og:title" content="Prototype UI for ${
			companyName.value
		} Application" />
        <meta property="og:type" content="UI/UX" />
        <meta property="og:image" content="${imageSrc ?? ""}" />
        <style>
            body {
                margin: 0;
                padding: 0;
                overflow: hidden;
                box-sizing: border-box;
                width: 100vw;
                height: 100vh;
                background-color: #0e1012;
            }
            div {
                position: absolute;
                left: 10px;
                top: 0;
                height: 60px;
                width: 150px;
                background-color: #000;
            }
            @media screen and (orientation:portrait) {
                img {
                    display: none;
                }
            }
            @media screen and (orientation:landscape) {
                img {
                    display: block;
                }
            }
        </style>
    </head>

    <body>
        <div style="position: absolute; left: 10px; top: 10px;display:flex;">
            <img src="${getBase64Image(
				collabLogo
			)}" alt="Cryonics Collab Logo" height="60px">
            <img src="${imageSrc}" alt="${companyName}" height="60px">
        </div>
        <iframe id="show" style="border: 1px solid rgba(0, 0, 0, 0.1);" width="100%" height="100%"
            src="https://www.figma.com/embed?embed_host=share&url=${
				prototypeLink.value
			}"
            allowfullscreen></iframe>

    </body>
</html>
`;

	let textFile = null,
		makeTextFile = function (text) {
			let data = new Blob([text], { type: "text/html" });

			// If we are replacing a previously generated file we need to
			// manually revoke the object URL to avoid memory leaks.
			if (textFile !== null) {
				window.URL.revokeObjectURL(textFile);
			}

			textFile = window.URL.createObjectURL(data);

			return textFile;
		};

	let link = document.createElement("a");
	link.setAttribute("download", "index.html");
	link.href = makeTextFile(figmaPlayHTML);
	document.body.appendChild(link);

	// wait for the link to be added to the document
	window.requestAnimationFrame(function () {
		let event = new MouseEvent("click");
		link.dispatchEvent(event);
		document.body.removeChild(link);
	});
};

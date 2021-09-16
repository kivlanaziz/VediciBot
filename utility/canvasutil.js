const Canvas = require('canvas');

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');
	let fontSize = 70;

	do {
		ctx.font = `${fontSize -= 10}px Arial`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};

async function generateWelcomeCanvas(member) {
	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	// Since the image takes time to load, you should await it
	const background = await Canvas.loadImage('./assets/images/welcome-background.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#000530';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = '28px Arial';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

	ctx.font = applyText(canvas, `${member.displayName}!`);
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
		format: 'jpg'
	}));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	return canvas;
}

module.exports = {
	generateWelcomeCanvas: generateWelcomeCanvas,
}
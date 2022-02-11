import Phaser from 'phaser'

import Game from './scenes/Game'
import Preloader from './scenes/Preloader'


export default new Phaser.Game({
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			//debug: true
		}
	},
	scene: [Preloader, Game],
	scale: {
		zoom: 1,
		autoCenter: Phaser.Scale.CENTER_BOTH
	}
})

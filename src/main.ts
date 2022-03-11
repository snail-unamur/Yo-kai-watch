import Phaser from 'phaser'

import Game from './scenes/Game'
import Preloader from './scenes/Preloader'
import Map from './scenes/Map'
import GameUI from './scenes/GameUI'
import MenuProjects from './scenes/MenuProjects'
import PauseOverlay from './scenes/PauseOverlay'
import Tutorial from './scenes/Tutorial'

import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import PreloaderAssets from './scenes/PreloaderAssets'
import SetupTutorial from './scenes/SetupTutorial'
import InfoOverlay from './scenes/InfoOverlay'


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
	scene: [PreloaderAssets, SetupTutorial, MenuProjects, Preloader, Map, Game, Tutorial, GameUI, InfoOverlay, PauseOverlay],
	parent: 'phaser-container',
	scale: {
		zoom: 1,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
    dom: {
        createContainer: true
    },
	plugins: {
		scene: [
			{
				key: 'rexUI',
				plugin: RexUIPlugin,
				mapping: 'rexUI'
			}
		]
    }
})

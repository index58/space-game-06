import * as Phaser from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#0d0d15',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: function(this: Phaser.Scene): void {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x4a9eff, 1);
      graphics.fillTriangle(0, -20, 15, 20, -15, 20);
      graphics.generateTexture('ship', 40, 40);
      
      graphics.clear();
      graphics.fillStyle(0xff6600, 1);
      graphics.fillCircle(5, 5, 3);
      graphics.generateTexture('engine', 10, 10);
    },
    create: function(this: Phaser.Scene): void {
      playerShip = this.physics.add.image(0, 0, 'ship') as Phaser.Physics.Arcade.Image;
      playerShip.setVelocityY(-100);
      
      camera = this.cameras.main;
      camera.setZoom(1);
      
      createWorldObjects(this);
    },
    update: function(this: Phaser.Scene, _time: number, _delta: number): void {
      if (!playerShip || !camera) return;
      camera.scrollX = playerShip.x - camera.width / 2;
      camera.scrollY = playerShip.y - camera.height * 0.6;
    },
  },
};

let playerShip: Phaser.Physics.Arcade.Image | null = null;
let camera: Phaser.Cameras.Scene2D.Camera | null = null;

function createWorldObjects(scene: Phaser.Scene): void {
  for (let i = 0; i < 50; i++) {
    const x = (Math.random() - 0.5) * 10000;
    const y = (Math.random() - 0.5) * 10000;
    scene.add.circle(x, y, Math.random() * 3 + 1, 0x8888aa);
  }
}

window.addEventListener('load', () => {
  new Phaser.Game(config);
});

import * as Phaser from 'phaser';
import { ParallaxBackground } from './ParallaxBackground';

const SHIP_THRUST = 150; // N
const SHIP_TORQUE = 200; // N·m

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
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
    preload: function (this: Phaser.Scene): void {
      this.load.image('spaceBg', 'images/space-background.jpg');

      const graphics = this.add.graphics();
      graphics.fillStyle(0x4a9eff, 1);
      graphics.fillTriangle(0, -20, 15, 20, -15, 20);
      graphics.generateTexture('ship', 40, 40);

      graphics.clear();
      graphics.fillStyle(0xff6600, 1);
      graphics.fillCircle(5, 5, 3);
      graphics.generateTexture('engine', 10, 10);
    },
    create: function (this: Phaser.Scene): void {
      const bg = new ParallaxBackground(this, 0, 0, 800, 'spaceBg');

      playerShip = this.physics.add.image(0, 0, 'ship') as Phaser.Physics.Arcade.Image;
      (playerShip.body as Phaser.Physics.Arcade.Body).setDrag(0.98);
      (playerShip.body as Phaser.Physics.Arcade.Body).setAngularDrag(0.95);

      camera = this.cameras.main;
      camera.setZoom(1);

      cursors = this.input.keyboard.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;

      createWorldObjects(this);

      (this as any)._parallaxBg = bg;
    },
    update: function (this: Phaser.Scene, _time: number, delta: number): void {
      if (!playerShip || !camera || !cursors) return;

      handleInput(cursors, delta);

      const screenX = playerShip.x - camera.width / 2;
      const screenY = playerShip.y - camera.height * 0.6;

      camera.scrollX = screenX;
      camera.scrollY = screenY;

      const bg = (this as any)._parallaxBg as ParallaxBackground;
      bg?.updateOffset(screenX, screenY);
    },
  },
};

let playerShip: Phaser.Physics.Arcade.Image | null = null;
let camera: Phaser.Cameras.Scene2D.Camera | null = null;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

function handleInput(cursor: Phaser.Types.Input.Keyboard.CursorKeys, delta: number): void {
  if (!playerShip) return;

  const body = playerShip.body as Phaser.Physics.Arcade.Body;
  const thrustPower = SHIP_THRUST * (delta / 1000);

  // Стрелка вверх — смещение вверх
  if (cursor.up?.isDown) {
    body.setVelocityY(body.velocityY - thrustPower);
  }
  // Стрелка вниз — смещение вниз
  if (cursor.down?.isDown) {
    body.setVelocityY(body.velocityY + thrustPower);
  }
  // Стрелка влево — смещение влево
  if (cursor.left?.isDown) {
    body.setVelocityX(body.velocityX - thrustPower);
  }
  // Стрелка вправо — смещение вправо
  if (cursor.right?.isDown) {
    body.setVelocityX(body.velocityX + thrustPower);
  }
}

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

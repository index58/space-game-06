import * as Phaser from 'phaser';
import { ParallaxBackground } from './ParallaxBackground';

const SHIP_THRUST = 150; // N

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
      // Рисуем треугольный кораблик (нос направлен вверх)
      graphics.fillStyle(0x4a9eff, 1);
      graphics.fillTriangle(0, -30, -25, 18, 25, 18); // Основной корпус (треугольник)
      graphics.fillStyle(0x6ab0ff, 1);
      graphics.fillTriangle(-12, 18, 12, 18, 0, 30);   // Двигатель снизу
      graphics.generateTexture('ship', 50, 60);

      graphics.clear();
      graphics.fillStyle(0xff6600, 1);
      graphics.fillCircle(5, 5, 3);
      graphics.generateTexture('engine', 10, 10);
    },
    create: function (this: Phaser.Scene): void {
      const bg = new ParallaxBackground(this, 800, 'spaceBg');

      playerShip = this.physics.add.image(0, 0, 'ship') as Phaser.Physics.Arcade.Image;
      (playerShip.body as Phaser.Physics.Arcade.Body).setDrag(0.98);
      (playerShip.body as Phaser.Physics.Arcade.Body).setAngularDrag(0.95);

      const cam = this.cameras.main!;
      camera = cam;
      cam.setZoom(1);

      const cursorsLocal = this.input.keyboard!.createCursorKeys();
      if (cursorsLocal !== null) {
        cursors = cursorsLocal as Phaser.Types.Input.Keyboard.CursorKeys;
      }

      createWorldObjects(this);

      (this as any)._parallaxBg = bg;
    },
    update: function (this: Phaser.Scene, deltaTime: number): void {
      if (!playerShip || !camera || !cursors) return;

      handleInput(cursors, deltaTime);

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
    body.velocity.y -= thrustPower;
  }
  // Стрелка вниз — смещение вниз
  if (cursor.down?.isDown) {
    body.velocity.y += thrustPower;
  }
  // Стрелка влево — смещение влево
  if (cursor.left?.isDown) {
    body.velocity.x -= thrustPower;
  }
  // Стрелка вправо — смещение вправо
  if (cursor.right?.isDown) {
    body.velocity.x += thrustPower;
  }
}

function createWorldObjects(scene: Phaser.Scene): void {
  for (let i = 0; i < 50; i++) {
    const x = (Math.random() - 0.5) * 10000;
    const y = (Math.random() - 0.5) * 10000;
    const star = scene.add.circle(x, y, Math.random() * 3 + 1, 0x8888aa);
    if (star !== null) {
      star.setDepth(0);
    }
  }
}

window.addEventListener('load', () => {
  new Phaser.Game(config);
});

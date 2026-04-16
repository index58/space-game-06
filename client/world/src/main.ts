import Phaser from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#0d0d15',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

let game: Phaser.Game;
let playerShip: Phaser.Physics.Arcade.Image | null = null;
let camera: Phaser.Cameras.Scene2D.Camera | null = null;

function preload(): void {
  // Загрузка текстур (заглушки для прототипа)
  this.load.setBaseURL('');
  
  // Создаём простые графические объекты программно
  const graphics = this.make.graphics({ x: 0, y: 0, add: false });
  
  // Текстура корабля (треугольник)
  graphics.fillStyle(0x4a9eff, 1);
  graphics.beginPath();
  graphics.moveTo(0, -20);
  graphics.lineTo(15, 20);
  graphics.lineTo(0, 15);
  graphics.lineTo(-15, 20);
  graphics.closePath();
  graphics.fillPath();
  graphics.generateTexture('ship', 40, 40);
  
  // Текстура двигателя (частицы)
  graphics.clear();
  graphics.fillStyle(0xff6600, 1);
  graphics.fillCircle(5, 5, 3);
  graphics.generateTexture('engine', 10, 10);
}

function create(): void {
  const scene = this;
  
  // Создаём игрока (стартовый корабль)
  playerShip = scene.add.image(0, 0, 'ship') as Phaser.Physics.Arcade.Image;
  scene.physics.add.existing(playerShip);
  playerShip.setCollideWorldBounds(true);
  playerShip.body.setDrag(0.95); // Инерция
  
  // Настраиваем камеру
  camera = scene.cameras.main;
  camera.follow(playerShip, 0.1, 0.1);
  camera.setZoom(1);
  
  // Добавляем несколько объектов для визуальной ориентации
  createWorldObjects(scene);
}

function update(_time: number, _delta: number): void {
  if (!playerShip || !camera) return;
  
  // Управление двигателем (заглушка - постоянное движение вверх)
  playerShip.setVelocityY(-100);
  
  // Камера всегда центрирует корабль в нижней половине экрана
  camera.scrollX = playerShip.x - camera.width / 2;
  camera.scrollY = playerShip.y - camera.height * 0.6;
}

function createWorldObjects(scene: Phaser.Scene): void {
  // Создаём несколько объектов для ориентации в пространстве
  for (let i = 0; i < 50; i++) {
    const x = (Math.random() - 0.5) * 10000;
    const y = (Math.random() - 0.5) * 10000;
    
    // Звёзды/астероиды
    const star = scene.add.circle(x, y, Math.random() * 3 + 1, 0x8888aa);
    scene.physics.add.existing(star);
    star.body.setStatic(true);
  }
}

// Инициализация игры при загрузке страницы
window.addEventListener('load', () => {
  game = new Phaser.Game(config);
});

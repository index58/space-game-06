import * as Phaser from 'phaser';
import { ParallaxBackground } from './ParallaxBackground';

// Сила тяги корабля (в ньютонах)
const SHIP_THRUST = 150;

/**
 * Конфигурация игры Phaser
 */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL, // Рендеринг через WebGL
  width: window.innerWidth, // Ширина канваса на весь экран
  height: window.innerHeight, // Высота канваса на весь экран
  backgroundColor: '#0d0d15', // Тёмно-синий фон космоса
  physics: {
    default: 'arcade', // Используем аркадную физику
    arcade: {
      gravity: { x: 0, y: 0 }, // Гравитация отсутствует (космос)
      debug: false, // Отладка физики отключена
    },
  },
  scene: {
    /**
     * Загрузка ресурсов и создание текстур
     */
    preload: function (this: Phaser.Scene): void {
      // Загрузка фона космоса
      this.load.image('spaceBg', 'images/space-background.jpg');

      // Загрузка спрайта корабля из SVG-файла
      this.load.image('ship', 'images/ship.svg');
    },
    /**
     * Инициализация игровых объектов
     */
    create: function (this: Phaser.Scene): void {
      // Создание параллакс-фона
      const bg = new ParallaxBackground(this, 800, 'spaceBg');

      // Создание корабля игрока в центре сцены
      playerShip = this.physics.add.image(0, 0, 'ship') as Phaser.Physics.Arcade.Image;
      // Настройка затухания скорости (сопротивление)
      (playerShip.body as Phaser.Physics.Arcade.Body).setDrag(0.98);
      // Настройка затухания вращения
      (playerShip.body as Phaser.Physics.Arcade.Body).setAngularDrag(0.95);

      // Настройка камеры
      const cam = this.cameras.main!;
      camera = cam;
      cam.setZoom(1); // Масштаб 1:1

      // Создание обработчика клавиш управления (стрелки)
      const cursorsLocal = this.input.keyboard!.createCursorKeys();
      if (cursorsLocal !== null) {
        cursors = cursorsLocal as Phaser.Types.Input.Keyboard.CursorKeys;
      }

      // Сохранение ссылки на фон для обновления в update
      (this as any)._parallaxBg = bg;
    },
    /**
     * Обновление состояния игры каждый кадр
     * @param deltaTime Время в миллисекундах с последнего кадра
     */
    update: function (this: Phaser.Scene, deltaTime: number): void {
      if (!playerShip || !camera || !cursors) return;

      // Обработка ввода пользователя
      handleInput(cursors, deltaTime);

      // Вычисление позиции скролла камеры относительно корабля
      const screenX = playerShip.x - camera.width / 2;
      const screenY = playerShip.y - camera.height * 0.6;

      // Прокрутка камеры за кораблём
      camera.scrollX = screenX;
      camera.scrollY = screenY;

      // Обновление параллакс-фона
      const bg = (this as any)._parallaxBg as ParallaxBackground;
      bg?.updateOffset(screenX, screenY);
    },
  },
};

// Глобальные переменные сцены
let playerShip: Phaser.Physics.Arcade.Image | null = null;
let camera: Phaser.Cameras.Scene2D.Camera | null = null;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

/**
 * Обработка ввода с клавиатуры для управления кораблём
 * @param cursor Объект с состоянием клавиш-стрелок
 * @param delta Время в миллисекундах с последнего кадра
 */
function handleInput(cursor: Phaser.Types.Input.Keyboard.CursorKeys, delta: number): void {
  if (!playerShip) return;

  const body = playerShip.body as Phaser.Physics.Arcade.Body;
  // Расчёт силы тяги с учётом времени между кадрами
  const thrustPower = SHIP_THRUST * (delta / 1000);

  // Стрелка вверх — ускорение вверх
  if (cursor.up?.isDown) {
    body.velocity.y -= thrustPower;
  }
  // Стрелка вниз — ускорение вниз
  if (cursor.down?.isDown) {
    body.velocity.y += thrustPower;
  }
  // Стрелка влево — ускорение влево
  if (cursor.left?.isDown) {
    body.velocity.x -= thrustPower;
  }
  // Стрелка вправо — ускорение вправо
  if (cursor.right?.isDown) {
    body.velocity.x += thrustPower;
  }
}

// Запуск игры после загрузки страницы
window.addEventListener('load', () => {
  new Phaser.Game(config);
});

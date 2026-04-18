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
      // Настройка затухания скорости (сопротивление) — линейное торможение
      (playerShip.body as Phaser.Physics.Arcade.Body).setDrag(50);
      // Отключаем damping для линейного торможения
      (playerShip.body as Phaser.Physics.Arcade.Body).useDamping = false;
      // Настройка затухания вращения
      (playerShip.body as Phaser.Physics.Arcade.Body).setAngularDrag(0.95);

      // Настройка камеры
      const cam = this.cameras.main!;
      camera = cam;
      const syncCameraToShip = (): void => {
        if (!playerShip || !camera) return;

        const screenX = playerShip.x - camera.width / 2;
        const screenY = playerShip.y - camera.height * 0.6;

        camera.scrollX = screenX;
        camera.scrollY = screenY;

        bg.updateOffset(screenX, screenY);
      };

      // Arcade Physics copies Body coordinates to the GameObject during POST_UPDATE.
      // Camera scroll must run after that sync, otherwise the camera is one frame behind.
      this.events.on(Phaser.Scenes.Events.POST_UPDATE, syncCameraToShip);
      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.events.off(Phaser.Scenes.Events.POST_UPDATE, syncCameraToShip);
      });
      cam.setZoom(1); // Масштаб 1:1

      // Создание обработчика клавиш управления (стрелки)
      const cursorsLocal = this.input.keyboard!.createCursorKeys();
      if (cursorsLocal !== null) {
        cursors = cursorsLocal as Phaser.Types.Input.Keyboard.CursorKeys;
      }

    },
    /**
     * Обновление состояния игры каждый кадр
     * @param deltaTime Время в миллисекундах с последнего кадра
     */
    update: function (this: Phaser.Scene, _deltaTime: number): void {
      if (!playerShip || !cursors) return;

      // Обработка ввода пользователя
      handleInput(cursors);
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
 */
function handleInput(cursor: Phaser.Types.Input.Keyboard.CursorKeys): void {
  if (!playerShip) return;

  const body = playerShip.body as Phaser.Physics.Arcade.Body;

  // Сбрасываем все ускорения перед применением новых
  body.setAcceleration(0, 0);

  // Стрелка вверх — тяга вверх
  if (cursor.up?.isDown) {
    body.acceleration.y = -SHIP_THRUST;
  }
  // Стрелка вниз — тяга вниз
  else if (cursor.down?.isDown) {
    body.acceleration.y = SHIP_THRUST;
  }
  // Стрелка влево — тяга влево (инвертировано, т.к. камера следует за кораблём)
  if (cursor.left?.isDown) {
    body.acceleration.x = SHIP_THRUST;
  }
  // Стрелка вправо — тяга вправо (инвертировано, т.к. камера следует за кораблём)
  else if (cursor.right?.isDown) {
    body.acceleration.x = -SHIP_THRUST;
  }
}

// Запуск игры после загрузки страницы
window.addEventListener('load', () => {
  new Phaser.Game(config);
});

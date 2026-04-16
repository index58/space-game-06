import * as Phaser from 'phaser';

const fragmentShader = `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_offset;

varying vec2 outTexCoord;

void main(void)
{
    vec2 uv = mod(outTexCoord - u_offset, 1.0);
    vec4 color = texture2D(u_texture, uv);
    gl_FragColor = color;
}
`;

class ParallaxBackground {
  private shader: Phaser.GameObjects.Shader;
  private tileSize: number;

  constructor(scene: Phaser.Scene, tileSize: number, textureKey: string) {
    this.tileSize = tileSize;

    const width = scene.cameras.main.width || window.innerWidth;
    const height = scene.cameras.main.height || window.innerHeight;

    this.shader = scene.add.shader(
      {
        name: 'spaceShader',
        fragmentSource: fragmentShader,
        initialUniforms: {
          u_offset: [0, 0],
          u_texture: 0,
        },
      },
      scene.cameras.main.midPoint.x - width / 2,
      scene.cameras.main.midPoint.y - height / 2,
      width,
      height,
      [textureKey]
    );

    this.shader.setOrigin(0, 0);
    this.shader.setPosition(0, 0);
    this.shader.setSize(width + 100, height + 100);

    this.shader.setScrollFactor(0);
    this.shader.setDepth(-1000);
  }

  public updateOffset(scrollX: number, scrollY: number): void {
    const uvX = (scrollX % this.tileSize) / this.tileSize;
    const uvY = (scrollY % this.tileSize) / this.tileSize;
    this.shader.setUniform('u_offset', [uvX, uvY]);
  }
}

export { ParallaxBackground };

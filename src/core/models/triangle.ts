import { Vector } from "./vector";

export class Triangle {
  points: Array<Vector>;
  constructor(points: Array<Vector>) {
    this.points = points;
  }

  createCopy = () => {
    return new Triangle([
      new Vector(this.points[0].x, this.points[0].y, this.points[0].z),
      new Vector(this.points[1].x, this.points[1].y, this.points[1].z),
      new Vector(this.points[2].x, this.points[2].y, this.points[2].z),
    ]);
  };

  draw = (ctx: CanvasRenderingContext2D | null, intensity: number = 1) => {
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(Math.round(this.points[0].x), Math.round(this.points[0].y));
      ctx.lineTo(Math.round(this.points[1].x), Math.round(this.points[1].y));
      ctx.lineTo(Math.round(this.points[2].x), Math.round(this.points[2].y));
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 165, 0, ${intensity})`;
      ctx.fill();
      //   ctx.fillStyle = "blue";
      //   ctx.fill();
      //   ctx.font = "15px Comic Sans MS";
      //   ctx.fillStyle = "red";
      //   ctx.textAlign = "center";
      //   ctx.fillText(
      //     `x=${Math.round(this.points[0].x)}, y=${Math.round(
      //       this.points[0].y
      //     )}, z=${Math.round(this.points[0].z)}`,
      //     Math.round(this.points[0].x),
      //     Math.round(this.points[0].y)
      //   );
      //   ctx.stroke();
    }
  };
}

import { Triangle } from "./triangle";
import { Vector } from "./vector";

export class Mesh {
  triangles: Array<Triangle>;
  constructor(triangles: Array<Triangle>) {
    this.triangles = triangles;
  }
  static loadFromObjectFile = (obj: string) => {
    console.log(obj, typeof obj);

    const vfA = obj.split("s off");
    const vArray = vfA[0].split("v");
    const fArray = vfA[1].split("\nf");

    let cVArray: Array<number>[] = [];

    vArray.forEach((f) => {
      let g = f.trim();
      let a_g = g.split(" ");
      if (a_g.length === 3) {
        cVArray.push([
          parseFloat(a_g[0]),
          parseFloat(a_g[1]),
          parseFloat(a_g[2]),
        ]);
      }
    });

    let finalMesh: Triangle[] = [];
    fArray.forEach((f) => {
      let g = f.trim();
      let a_g = g.split(" ");
      if (a_g.length === 3) {
        try {
          const p1 = cVArray[parseInt(a_g[0]) - 1];
          const p2 = cVArray[parseInt(a_g[1]) - 1];
          const p3 = cVArray[parseInt(a_g[2]) - 1];

          finalMesh.push(
            new Triangle([
              new Vector(p1[0], p1[1], p1[2]),
              new Vector(p2[0], p2[1], p2[2]),
              new Vector(p3[0], p3[1], p3[2]),
            ])
          );
        } catch (error) {
          console.log({ error });
        }
      }
    });
    return finalMesh;
  };
}

import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { Triangle } from "./core/models/triangle";
import { Matrix4x4 } from "./core/models/matrix4x4";
import { Vector } from "./core/models/vector";
import { Car } from "./assets/Car";
import { Mesh } from "./core/models/mesh";

const fAspectRatio = window.innerHeight / window.innerWidth;
const fNear = 0.4;
const fFar = 1200.0;
const fFOV = 10.0;
const fTheta = 1.0;
const fFovRad = 1 / Math.tan((fFOV * Math.PI) / 180);

function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function App() {
  const canvasRef = useRef(null);
  const [ctx, setCTX] = useState<CanvasRenderingContext2D | null>(null);
  const vCamera = new Vector(0.0, 0.0, 0.0);

  const triangles = useRef(Mesh.loadFromObjectFile(Car));

  const triangles2 = useRef([
    //south
    new Triangle([
      new Vector(0.0, 0.0, 0.0),
      new Vector(0.0, 1.0, 0.0),
      new Vector(1.0, 1.0, 0.0),
    ]),
    new Triangle([
      new Vector(0.0, 0.0, 0.0),
      new Vector(1.0, 1.0, 0.0),
      new Vector(1.0, 0.0, 0.0),
    ]),
    //east
    new Triangle([
      new Vector(1.0, 0.0, 0.0),
      new Vector(1.0, 1.0, 0.0),
      new Vector(1.0, 1.0, 1.0),
    ]),
    new Triangle([
      new Vector(1.0, 0.0, 0.0),
      new Vector(1.0, 1.0, 1.0),
      new Vector(1.0, 0.0, 1.0),
    ]),
    //north
    new Triangle([
      new Vector(1.0, 0.0, 1.0),
      new Vector(1.0, 1.0, 1.0),
      new Vector(0.0, 1.0, 1.0),
    ]),
    new Triangle([
      new Vector(1.0, 0.0, 1.0),
      new Vector(0.0, 1.0, 1.0),
      new Vector(0.0, 0.0, 1.0),
    ]),
    //west
    new Triangle([
      new Vector(0.0, 0.0, 1.0),
      new Vector(0.0, 1.0, 1.0),
      new Vector(0.0, 1.0, 0.0),
    ]),
    new Triangle([
      new Vector(0.0, 0.0, 1.0),
      new Vector(0.0, 1.0, 0.0),
      new Vector(0.0, 0.0, 0.0),
    ]),

    //top
    new Triangle([
      new Vector(0.0, 1.0, 0.0),
      new Vector(0.0, 1.0, 1.0),
      new Vector(1.0, 1.0, 1.0),
    ]),
    new Triangle([
      new Vector(0.0, 1.0, 0.0),
      new Vector(1.0, 1.0, 1.0),
      new Vector(1.0, 1.0, 0.0),
    ]),

    //bottom
    new Triangle([
      new Vector(1.0, 0.0, 1.0),
      new Vector(0.0, 0.0, 1.0),
      new Vector(0.0, 0.0, 0.0),
    ]),
    new Triangle([
      new Vector(1.0, 0.0, 1.0),
      new Vector(0.0, 0.0, 0.0),
      new Vector(1.0, 0.0, 0.0),
    ]),
  ]);
  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const _ctx = canvas.getContext("2d");
      canvas.focus();
      setCTX(_ctx);
      // if (_ctx) {
      //   drawCube(_ctx);
      // }
    }
  }, [canvasRef, canvasRef.current]);

  useEffect(() => {
    let reqID: number;

    if (triangles && triangles.current && canvasRef && canvasRef.current) {
      reqID = requestAnimationFrame(mainLoop);
    }

    return () => {
      if (reqID) {
        cancelAnimationFrame(reqID);
      }
    };
  }, [triangles, triangles.current, canvasRef, canvasRef.current]);

  function mainLoop() {
    if (ctx) {
      clearCanvas(ctx);
      drawCube(ctx);
    }
    setTimeout(() => {
      requestAnimationFrame(mainLoop);
    }, 1000 / 30);

    return;
  }

  const multiplyMatrixvector = (i: Vector, m: Matrix4x4) => {
    const o = new Vector(0.0, 0.0, 0.0);
    o.x = i.x * m.m[0][0] + i.y * m.m[1][0] + i.z * m.m[2][0] + m.m[3][0];
    o.y = i.x * m.m[0][1] + i.y * m.m[1][1] + i.z * m.m[2][1] + m.m[3][1];
    o.z = i.x * m.m[0][2] + i.y * m.m[1][2] + i.z * m.m[2][2] + m.m[3][2];

    let w = i.x * m.m[0][3] + i.y * m.m[1][3] + i.z * m.m[2][3] + m.m[3][3];
    if (w !== 0.0) {
      o.x = o.x / w;
      o.y = o.y / w;
      o.z = o.z / w;
    }
    return new Vector(o.x, o.y, o.z);
  };

  const drawCube = (ctx: CanvasRenderingContext2D) => {
    const matProj = new Matrix4x4();
    const matRotX = new Matrix4x4();
    const matRotZ = new Matrix4x4();

    matRotZ.m[0][0] = Math.cos((fTheta * Math.PI) / 180);
    matRotZ.m[0][1] = Math.sin((fTheta * Math.PI) / 180);
    matRotZ.m[1][0] = -Math.sin((fTheta * Math.PI) / 180);
    matRotZ.m[1][1] = Math.cos((fTheta * Math.PI) / 180);
    matRotZ.m[2][2] = 1;
    matRotZ.m[3][3] = 1;

    matRotX.m[0][0] = 1;
    matRotX.m[1][1] = Math.cos((fTheta * 0.5 * Math.PI) / 180);
    matRotX.m[1][2] = Math.sin((fTheta * 0.5 * Math.PI) / 180);
    matRotX.m[2][1] = -Math.sin((fTheta * 0.5 * Math.PI) / 180);
    matRotX.m[2][2] = Math.cos((fTheta * 0.5 * Math.PI) / 180);
    matRotX.m[3][3] = 1;

    matProj.m[0][0] = fFovRad;
    matProj.m[1][1] = fFovRad / fAspectRatio;
    matProj.m[2][2] = fFar / (fFar - fNear);
    matProj.m[3][2] = (-fFar * fNear) / (fFar - fNear);
    matProj.m[2][3] = 1.0;
    matProj.m[3][3] = 0.0;

    // Triangle.draw(ctx);
    for (let i = 0; i < triangles.current.length; i++) {
      let triProjected = new Triangle([
        new Vector(0.0, 0.0, 0.0),
        new Vector(0.0, 0.0, 0.0),
        new Vector(0.0, 0.0, 0.0),
      ]);

      const triRotatedZ = new Triangle([
        new Vector(0.0, 0.0, 0.0),
        new Vector(0.0, 0.0, 0.0),
        new Vector(0.0, 0.0, 0.0),
      ]);
      const triRotatedZX = new Triangle([
        new Vector(0.0, 0.0, 0.0),
        new Vector(0.0, 0.0, 0.0),
        new Vector(0.0, 0.0, 0.0),
      ]);

      triRotatedZ.points[0] = multiplyMatrixvector(
        triangles.current[i].points[0],
        matRotZ
      );
      triRotatedZ.points[1] = multiplyMatrixvector(
        triangles.current[i].points[1],
        matRotZ
      );
      triRotatedZ.points[2] = multiplyMatrixvector(
        triangles.current[i].points[2],
        matRotZ
      );

      triRotatedZX.points[0] = multiplyMatrixvector(
        triRotatedZ.points[0],
        matRotX
      );
      triRotatedZX.points[1] = multiplyMatrixvector(
        triRotatedZ.points[1],
        matRotX
      );
      triRotatedZX.points[2] = multiplyMatrixvector(
        triRotatedZ.points[2],
        matRotX
      );

      const triTranslated = triRotatedZX.createCopy();

      triangles.current[i] = triTranslated.createCopy();

      triTranslated.points[0].z = triRotatedZX.points[0].z + 50.0;
      triTranslated.points[1].z = triRotatedZX.points[1].z + 50.0;
      triTranslated.points[2].z = triRotatedZX.points[2].z + 50.0;

      const line1 = new Vector(0.0, 0.0, 0.0);
      const line2 = new Vector(0.0, 0.0, 0.0);
      const normal = new Vector(0.0, 0.0, 0.0);

      line1.x = triTranslated.points[1].x - triTranslated.points[0].x;
      line1.y = triTranslated.points[1].y - triTranslated.points[0].y;
      line1.z = triTranslated.points[1].z - triTranslated.points[0].z;

      line2.x = triTranslated.points[2].x - triTranslated.points[0].x;
      line2.y = triTranslated.points[2].y - triTranslated.points[0].y;
      line2.z = triTranslated.points[2].z - triTranslated.points[0].z;

      normal.x = line1.y * line2.z - line1.z * line2.y;
      normal.y = line1.z * line2.x - line1.x * line2.z;
      normal.z = line1.x * line2.y - line1.y * line2.x;

      const l = Math.sqrt(
        Math.pow(normal.x, 2) + Math.pow(normal.y, 2) + Math.pow(normal.z, 2)
      );

      normal.x = normal.x / l;
      normal.y = normal.y / l;
      normal.z = normal.z / l;

      const relativeNormal =
        (triTranslated.points[0].x - vCamera.x) * normal.x +
        (triTranslated.points[0].y - vCamera.y) * normal.y +
        (triTranslated.points[0].z - vCamera.z) * normal.z;

      if (relativeNormal < 0) {
        // console.log({ tr: triangles[i], triTranslated });

        const illumination = new Vector(0.0, 0.0, -1.0);
        const l = Math.sqrt(
          Math.pow(illumination.x, 2) +
            Math.pow(illumination.y, 2) +
            Math.pow(illumination.z, 2)
        );
        illumination.x = illumination.x / l;
        illumination.y = illumination.y / l;
        illumination.z = illumination.z / l;

        const lightIntensity =
          normal.x * illumination.x +
          normal.y * illumination.y +
          normal.z * illumination.z;

        triProjected.points[0] = multiplyMatrixvector(
          triTranslated.points[0],
          matProj
        );
        // console.log({ "triProjected.points[0]": triProjected.points[0] });

        triProjected.points[1] = multiplyMatrixvector(
          triTranslated.points[1],
          matProj
        );

        triProjected.points[2] = multiplyMatrixvector(
          triTranslated.points[2],
          matProj
        );

        triProjected.points[0].x = triProjected.points[0].x + 1.0;
        triProjected.points[0].y = triProjected.points[0].y + 1.0;

        triProjected.points[1].x = triProjected.points[1].x + 1.0;
        triProjected.points[1].y = triProjected.points[1].y + 1.0;

        triProjected.points[2].x = triProjected.points[2].x + 1.0;
        triProjected.points[2].y = triProjected.points[2].y + 1.0;

        triProjected.points[0].x =
          triProjected.points[0].x * 0.5 * window.innerWidth;
        triProjected.points[1].x =
          triProjected.points[1].x * 0.5 * window.innerWidth;
        triProjected.points[2].x =
          triProjected.points[2].x * 0.5 * window.innerWidth;

        triProjected.points[0].y =
          triProjected.points[0].y * 0.5 * window.innerHeight;
        triProjected.points[1].y =
          triProjected.points[1].y * 0.5 * window.innerHeight;
        triProjected.points[2].y =
          triProjected.points[2].y * 0.5 * window.innerHeight;

        triProjected.draw(ctx, lightIntensity);
      }

      // triangles.current[i] = triProjected;
    }
  };

  return (
    <div className="flex justify-center items-center bg-black  w-screen h-screen">
      <canvas
        ref={canvasRef}
        id="canvas"
        tabIndex={1}
        className=" bg-slate-800  overflow-hidden w-screen h-screen"
        height={window.innerHeight}
        width={window.innerWidth}
      ></canvas>
    </div>
  );
}

export default App;

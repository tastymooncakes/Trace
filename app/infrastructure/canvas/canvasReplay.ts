import { DrawingAction, Point } from "@/app/domain/entities";
import {
  drawLine,
  drawEraseLine,
  beginDrawing,
  clearCanvas as clearCanvasAdapter,
} from "./canvasAdapter";

export class CanvasReplay {
  static async replayActions(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    actions: DrawingAction[]
  ): Promise<void> {
    clearCanvasAdapter(canvas, ctx);

    for (const action of actions) {
      switch (action.type) {
        case "stroke":
          if (action.params.points && action.params.points.length > 0) {
            beginDrawing(ctx, action.params.points[0]);
            for (let i = 1; i < action.params.points.length; i++) {
              drawLine(
                ctx,
                action.params.points[i],
                action.params.color!,
                action.params.brushSize!
              );
            }
          }
          break;

        case "erase":
          if (action.params.points && action.params.points.length > 0) {
            beginDrawing(ctx, action.params.points[0]);
            for (let i = 1; i < action.params.points.length; i++) {
              drawEraseLine(
                ctx,
                action.params.points[i],
                action.params.brushSize!
              );
            }
          }
          break;

        case "clear":
          clearCanvasAdapter(canvas, ctx);
          break;

        case "import":
          if (action.params.imageData) {
            // Make image loading synchronous with a Promise
            await new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve();
              };
              img.onerror = () => {
                console.error("Failed to load image");
                resolve(); // Still resolve to continue replay
              };
              img.src = action.params.imageData!;
            });
          }
          break;

        case "undo":
        case "redo":
          break;
      }
    }
  }

  static getVisibleActions(allActions: DrawingAction[]): DrawingAction[] {
    const undoneActionIds = new Set<number>();

    for (const action of allActions) {
      if (action.type === "undo" && action.params.undoActionId) {
        undoneActionIds.add(action.params.undoActionId);
      } else if (action.type === "redo" && action.params.undoActionId) {
        undoneActionIds.delete(action.params.undoActionId);
      }
    }

    const visibleActions: DrawingAction[] = [];

    for (const action of allActions) {
      if (action.type === "undo" || action.type === "redo") {
        continue;
      }

      if (undoneActionIds.has(action.id!)) {
        continue;
      }

      visibleActions.push(action);
    }

    return visibleActions;
  }
}

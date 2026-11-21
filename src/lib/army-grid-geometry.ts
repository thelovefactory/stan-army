/** Viewport-independent document rectangles captured at the start of a gesture. */
export type PanelRect = { x:number; y:number; width:number; height:number };

function nearby(value:number, edges:number[], threshold:number) {
  let best=value, distance=threshold;
  for (const edge of edges) {
    const delta=Math.abs(edge-value);
    if (delta<=distance) { best=edge; distance=delta; }
  }
  return best;
}

/** Follow the pointer continuously; magnetise only the edge the user is moving. */
export function resizeRect(start:PanelRect, neighbours:PanelRect[], dx:number, dy:number, fromLeft=false, gap=16, threshold=10):PanelRect {
  const right=start.x+start.width;
  const x=fromLeft ? start.x+dx : start.x;
  let movingX=fromLeft ? x : right+dx;
  let bottom=start.y+start.height+dy;
  if (Math.abs(dx)>=2) movingX=nearby(movingX,neighbours.flatMap((item)=>fromLeft ? [item.x,item.x+item.width+gap] : [item.x+item.width,item.x-gap]),threshold);
  if (Math.abs(dy)>=2) bottom=nearby(bottom,neighbours.flatMap((item)=>[item.y+item.height,item.y-gap]),threshold);
  return {x:fromLeft ? movingX : start.x,y:start.y,width:fromLeft ? right-movingX : movingX-start.x,height:bottom-start.y};
}

/** Scroll only toward the edge the user is deliberately approaching. */
export function edgeScrollSpeed(y:number, viewportHeight:number, direction:-1|0|1, edge=56, maxSpeed=14):number {
  if (direction === -1 && y >= 0 && y < edge) return -Math.ceil(maxSpeed*(edge-y)/edge);
  if (direction === 1 && y > viewportHeight-edge && y <= viewportHeight) return Math.ceil(maxSpeed*(y-viewportHeight+edge)/edge);
  return 0;
}

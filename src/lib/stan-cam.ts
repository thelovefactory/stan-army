/** Prototype sample snaps use existing local assets; they are not external social posts. */
export type StanCamSnap = {id:string;src:string;alt:string;position:string};
export const SAMPLE_SNAPS: readonly StanCamSnap[] = [
  {id:"crowd",src:"/images/crowd.jpg",alt:"Example StanCam snap: hands raised in a concert crowd.",position:"center"},
  {id:"sneakers",src:"/images/sneakers.jpg",alt:"Example StanCam snap: well-loved sneakers.",position:"center"},
  {id:"room",src:"/images/room.jpg",alt:"Example StanCam snap: a place to hang out and listen.",position:"center"},
];
export function nextSnap(current:number,count:number,direction:1|-1):number {
  return count>0 ? ((current+direction)%count+count)%count : 0;
}
export function shuffleSnap(current:number,count:number,random=Math.random()):number {
  if(count<2)return 0;
  const choice=Number.isFinite(random) ? Math.min(1-Number.EPSILON,Math.max(0,random)) : 0;
  return (current+1+Math.floor(choice*(count-1)))%count;
}

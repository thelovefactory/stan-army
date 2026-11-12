"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Shuffle } from "lucide-react";
import { readImage } from "@/lib/image-upload";
import { nextSnap, SAMPLE_SNAPS, shuffleSnap } from "@/lib/stan-cam";
import type { StanCamSnap } from "@/lib/stan-cam";
import s from "./stan-cam.module.css";

export function StanCam() {
  const [snaps,setSnaps]=useState<StanCamSnap[]>([...SAMPLE_SNAPS]);
  const [index,setIndex]=useState(0),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState(false);
  const input=useRef<HTMLInputElement>(null),sequence=useRef(0);
  useEffect(()=>()=>{sequence.current+=1;},[]);
  async function upload(file?:File) {
    if(!file)return;
    const request=++sequence.current;setBusy(true);setMessage("");setError(false);
    try {
      const image=await readImage(file);
      if(request!==sequence.current)return;
      setSnaps(previous=>[{id:`upload-${request}`,src:image.dataUrl,alt:"Your uploaded StanCam snap.",position:"center"},...previous].slice(0,12));
      setIndex(0);setMessage("Added for this demo visit.");
    }catch(reason){if(request===sequence.current){setError(true);setMessage(reason instanceof Error ? reason.message : "Could not add this snap.");}}
    finally{if(request===sequence.current)setBusy(false);}
  }
  const snap=snaps[index];
  return <section className={s.camera} data-window-body="stancam" aria-label="StanCam photos" tabIndex={0} onKeyDown={(event)=>{
    if(event.target instanceof HTMLInputElement)return;
    if(event.key==="ArrowLeft" || event.key==="ArrowRight"){event.preventDefault();setIndex(current=>nextSnap(current,snaps.length,event.key==="ArrowLeft" ? -1 : 1));}
  }}>
    <Image className={s.photo} src={snap.src} alt={snap.alt} fill sizes="(max-width: 999px) 100vw, 420px" unoptimized style={{objectPosition:snap.position}} />
    <p className="sr-only">Example snaps and your own uploads. Uploaded photos stay in this demo visit until refresh. Use arrows or shuffle to browse.</p>
    <div className={s.overlay}>
      <button className={s.upload} onClick={()=>input.current?.click()} disabled={busy}><Plus size={15} />{busy ? "Adding…" : "Upload your own"}</button>
      <div className={s.browse}>
        <button aria-label="Previous StanCam snap" title="Previous" onClick={()=>setIndex(current=>nextSnap(current,snaps.length,-1))}><ChevronLeft size={17} /></button>
        <button aria-label="Shuffle StanCam snap" title="Shuffle" onClick={()=>setIndex(current=>shuffleSnap(current,snaps.length))}><Shuffle size={15} /></button>
        <button aria-label="Next StanCam snap" title="Next" onClick={()=>setIndex(current=>nextSnap(current,snaps.length,1))}><ChevronRight size={17} /></button>
      </div>
    </div>
    <input ref={input} type="file" hidden aria-label="Upload your own StanCam snap" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event)=>{void upload(event.target.files?.[0]);event.target.value="";}} />
    {message && <p className={`${s.message} ${error ? s.error : ""}`} role={error ? "alert" : "status"}>{message}</p>}
  </section>;
}

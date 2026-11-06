"""Original instrumental prototype sketches. No recordings, samples or artist catalogue.
Requires Python standard library + FFmpeg. Do not label these as Nova Reign tracks.
"""
import array
import math
import subprocess
import tempfile
import wave
from pathlib import Path

RATE = 22050
DURATION = 24
OUT = Path(__file__).resolve().parent.parent / 'public' / 'audio'
OUT.mkdir(exist_ok=True)

def synth(name, bpm, root, minor):
    beat = 60 / bpm
    tones = [0, 3 if minor else 4, 7, 10 if minor else 11, 12, 7, 3 if minor else 4, 2]
    output = array.array('h')
    for i in range(RATE * DURATION):
        t = i / RATE
        step = int(t / (beat / 2))
        phase = t % (beat / 2)
        frequency = root * 2 ** (tones[step % len(tones)] / 12)
        envelope = math.exp(-phase * 9) * min(1, phase * 160)
        pluck = (math.sin(2 * math.pi * frequency * t) + .2 * math.sin(4 * math.pi * frequency * t)) * envelope * .15
        bass = math.sin(2 * math.pi * root / 4 * t) * .09 * (1 - min(1, (t % beat) / beat))
        kicktime = t % beat
        kick = math.sin(2 * math.pi * (48 * kicktime + 5 * (1 - math.exp(-kicktime * 25)))) * math.exp(-kicktime * 22) * .13
        pad = sum(math.sin(2 * math.pi * root / 2 * 2 ** (n / 12) * t) for n in [0, 3 if minor else 4, 7]) * .025
        fade = min(1, t / .4, (DURATION-t) / .9)
        value = max(-.85, min(.85, (pluck + bass + kick + pad) * fade))
        output.append(int(value * 32767))
    with tempfile.NamedTemporaryFile(suffix='.wav') as temp:
        with wave.open(temp.name, 'wb') as wav:
            wav.setnchannels(1); wav.setsampwidth(2); wav.setframerate(RATE); wav.writeframes(output.tobytes())
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',temp.name,'-codec:a','libmp3lame','-b:a','96k',str(OUT / name)],check=True)
    print(name, 'original 24-second synthesis', flush=True)

synth('midnight-circuit.mp3', 90, 220, True)
synth('window-seat.mp3', 100, 261.6256, False)

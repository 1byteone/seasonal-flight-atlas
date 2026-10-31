import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ChevronLeft, ChevronRight, GitFork, Plane } from 'lucide-react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { PixelFaithfulVideo, type PixelFaithfulVideoHandle } from './components/PixelFaithfulVideo'
import { atlasScenes } from './data/atlasScenes'

const sceneMusic: Record<string, string> = {
  'la-pampa': '/assets/audio/sunset-plains.mp3',
  niigata: '/assets/audio/meditation-impromptu-03.mp3',
  allgau: '/assets/audio/avec-soin.mp3',
  serengeti: '/assets/audio/exploration-theme.mp3',
  'punjab-main': '/assets/audio/sunset-plains.mp3',
  lapland: '/assets/audio/first-light-particles.mp3',
  'punjab-alt': '/assets/audio/avec-soin.mp3',
  normandy: '/assets/audio/first-light-particles.mp3',
}
const MUSIC_VOLUME = 0.42
const REPOSITORY_URL = 'https://github.com/1byteone/seasonal-flight-atlas'

function ScenePreview({ scene, index, isActive, onSelect }: { scene: (typeof atlasScenes)[number], index: number, isActive: boolean, onSelect: () => void }) {
  const previewRef = useRef<HTMLVideoElement>(null)
  const [previewing, setPreviewing] = useState(false)
  const start = scene.segmentStart ?? 0
  const end = scene.segmentEnd

  const startPreview = () => {
    setPreviewing(true)
    const video = previewRef.current
    if (!video) return
    if (video.readyState < 1) {
      video.load()
      return
    }
    video.currentTime = start
    void video.play()
  }

  const stopPreview = () => {
    setPreviewing(false)
    const video = previewRef.current
    if (!video) return
    video.pause()
    video.currentTime = start
  }

  const handleMetadata = () => {
    const video = previewRef.current
    if (!video) return
    video.currentTime = Math.min(start, Math.max(0, video.duration - 0.05))
    if (previewing) void video.play()
  }

  const handleTimeUpdate = () => {
    const video = previewRef.current
    if (!video || !end || video.currentTime < end) return
    video.currentTime = start
    if (previewing) void video.play()
  }

  return <button
    type="button"
    className={`filmstrip-item ${isActive ? 'is-active' : ''} ${previewing ? 'is-previewing' : ''}`}
    onClick={onSelect}
    onMouseEnter={startPreview}
    onMouseLeave={stopPreview}
    onFocus={startPreview}
    onBlur={stopPreview}
    aria-label={`播放 ${scene.placeZh}`}
    aria-current={isActive ? 'true' : undefined}
  >
    <span className="filmstrip-thumb">
      <span className="filmstrip-poster" style={{ backgroundImage: `url("${scene.poster}")` }} aria-hidden="true" />
      <video ref={previewRef} muted playsInline preload="none" onLoadedMetadata={handleMetadata} onTimeUpdate={handleTimeUpdate} aria-hidden="true">
        <source src={scene.videoSrc} type="video/mp4" />
      </video>
    </span>
    <span className="filmstrip-label">{String(index + 1).padStart(2, '0')} / {scene.placeZh}</span>
  </button>
}

function App() {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [chapterFlash, setChapterFlash] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'previous'>('next')
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [musicEnabled, setMusicEnabled] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const videoRef = useRef<PixelFaithfulVideoHandle>(null)
  const audioARef = useRef<HTMLAudioElement>(null)
  const audioBRef = useRef<HTMLAudioElement>(null)
  const activeAudioRef = useRef<HTMLAudioElement | null>(null)
  const fadeFrameRef = useRef<number | null>(null)
  const scene = atlasScenes[sceneIndex]
  const musicTrack = sceneMusic[scene.id] ?? '/assets/audio/sunset-plains.mp3'

  useEffect(() => {
    const current = activeAudioRef.current
    const nextAudio = current === audioARef.current ? audioBRef.current : audioARef.current
    if (!nextAudio) return
    if (fadeFrameRef.current !== null) window.cancelAnimationFrame(fadeFrameRef.current)
    nextAudio.src = musicTrack
    nextAudio.volume = 0
    nextAudio.load()
    activeAudioRef.current = nextAudio
    if (!musicEnabled || !videoPlaying) {
      current?.pause()
      if (current) { current.currentTime = 0; current.volume = 0 }
      setMusicPlaying(false)
      return
    }
    void nextAudio.play().then(() => {
      const startedAt = performance.now()
      const fade = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / 620)
        if (current) current.volume = MUSIC_VOLUME * (1 - progress)
        nextAudio.volume = MUSIC_VOLUME * progress
        if (progress < 1) fadeFrameRef.current = window.requestAnimationFrame(fade)
        else { current?.pause(); if (current) { current.currentTime = 0; current.volume = 0 }; setMusicPlaying(true) }
      }
      fadeFrameRef.current = window.requestAnimationFrame(fade)
    }).catch(() => setMusicPlaying(false))
  }, [musicTrack])

  useEffect(() => () => {
    if (fadeFrameRef.current !== null) window.cancelAnimationFrame(fadeFrameRef.current)
    audioARef.current?.pause()
    audioBRef.current?.pause()
  }, [])

  const handleVideoPlayback = (playing: boolean) => {
    setVideoPlaying(playing)
    const audio = activeAudioRef.current
    if (!audio || !musicEnabled) return
    if (playing) {
      audio.volume = MUSIC_VOLUME
      void audio.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false))
    } else { audio.pause(); setMusicPlaying(false) }
  }

  const toggleMusic = () => {
    const nextEnabled = !musicEnabled
    setMusicEnabled(nextEnabled)
    const audio = activeAudioRef.current
    if (!nextEnabled) {
      if (fadeFrameRef.current !== null) window.cancelAnimationFrame(fadeFrameRef.current)
      audio?.pause()
      if (audio) { audio.currentTime = 0; audio.volume = 0 }
      setMusicPlaying(false)
      return
    }
    if (!audio || !videoPlaying) return
    audio.volume = MUSIC_VOLUME
    void audio.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false))
  }

  const changeScene = (nextIndex: number, direction: 'next' | 'previous' = 'next') => {
    if (transitioning) return
    const resolvedIndex = (nextIndex + atlasScenes.length) % atlasScenes.length
    if (resolvedIndex === sceneIndex) return
    setTransitionDirection(direction)
    setTransitioning(true)
    setChapterFlash(true)
    window.setTimeout(() => {
      setSceneIndex(resolvedIndex)
      setTransitioning(false)
      window.setTimeout(() => setChapterFlash(false), 560)
    }, 280)
  }
  const next = () => changeScene(sceneIndex + 1, 'next')
  const previous = () => changeScene(sceneIndex - 1, 'previous')

  return <div className="cinematic-page">
    <header className="cinematic-header">
      <div className="cinematic-brand"><span className="minimal-plane" aria-hidden="true"><Plane size={13} strokeWidth={1.5} /></span><span>四季航迹<br /><b>空中田野志 / 2026</b></span></div>
      <div className="cinematic-header-actions">
        <a className="repository-link" href={REPOSITORY_URL} target="_blank" rel="noreferrer" aria-label="打开 GitHub 仓库" title="打开 GitHub 仓库"><GitFork size={13} strokeWidth={1.6} /><span>GitHub</span></a>
        <div className="cinematic-counter"><span>{String(sceneIndex + 1).padStart(2, '0')}</span><i />{String(atlasScenes.length).padStart(2, '0')}</div>
      </div>
    </header>

    <main className="cinematic-main">
      <svg className="visual-filters" aria-hidden="true" focusable="false"><defs><filter id="watercolor-displace" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency="0.018 0.035" numOctaves="2" seed="8" result="paperNoise" /><feDisplacementMap in="SourceGraphic" in2="paperNoise" scale="13" xChannelSelector="R" yChannelSelector="G" /></filter></defs></svg>
      <section
        className={`cinematic-stage scene-${scene.id} ${transitioning ? 'is-transitioning' : ''} is-${transitionDirection}`}
        style={{ '--scene-accent': scene.accent } as CSSProperties}
        aria-label="季节航迹视频播放器"
      >
        <div className={`chapter-stamp ${chapterFlash ? 'is-visible' : ''}`} aria-hidden={!chapterFlash}>
          <span>章节 {scene.chapter}</span>
          <strong>{scene.placeZh}</strong>
          <small>{scene.seasonLabelZh} · 现场记录</small>
        </div>
        <div className="stage-note stage-note--left"><span>流动的土地</span><strong>第 {scene.chapter} 段</strong><small>原始航拍记录</small></div>
        <button type="button" className="stage-arrow stage-arrow--left" onClick={previous} aria-label="上一个场景" title="上一个场景"><ChevronLeft size={21} /></button>
        <PixelFaithfulVideo ref={videoRef} scene={scene} autoplay onSegmentEnd={next} onPlaybackChange={handleVideoPlayback} musicEnabled={musicEnabled} musicPlaying={musicPlaying} onToggleMusic={toggleMusic} />
        <button type="button" className="stage-arrow stage-arrow--right" onClick={next} aria-label="下一个场景" title="下一个场景"><ChevronRight size={21} /></button>
        <div className="stage-note stage-note--right"><span>{scene.countryZh} · {scene.seasonLabelZh}</span><strong>{scene.placeZh}</strong><small>{scene.storyTitle}</small><small>{scene.storyLine}</small><small>{Math.abs(scene.latitude).toFixed(3)}° {scene.latitude >= 0 ? 'N' : 'S'} / {Math.abs(scene.longitude).toFixed(3)}° {scene.longitude >= 0 ? 'E' : 'W'}</small></div>
      </section>

      <nav className="filmstrip" aria-label="场景选择">
        {atlasScenes.map((item, index) => <ScenePreview key={item.id} scene={item} index={index} isActive={index === sceneIndex} onSelect={() => changeScene(index, index > sceneIndex ? 'next' : 'previous')} />)}
      </nav>
    </main>
    <audio ref={audioARef} loop preload="metadata" aria-hidden="true" />
    <audio ref={audioBRef} loop preload="metadata" aria-hidden="true" />
    <footer className="cinematic-footer"><span>沿着景观前行</span><span>当前片段 / {scene.storyTitle}</span><span>第 {String(sceneIndex + 1).padStart(2, '0')} 段</span></footer>
  </div>
}

type RootHost = HTMLElement & { __seasonAtlasRoot?: ReturnType<typeof createRoot> }

const rootHost = document.getElementById('root') as RootHost
const appRoot = rootHost.__seasonAtlasRoot ?? createRoot(rootHost)
rootHost.__seasonAtlasRoot = appRoot
appRoot.render(<App />)

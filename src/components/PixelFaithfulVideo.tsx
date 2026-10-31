import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { AlertCircle, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import type { AtlasScene } from '../data/atlasScenes'

export type PixelFaithfulVideoHandle = {
  play: () => Promise<void>
  pause: () => void
  seek: (progress: number) => void
}

type PixelFaithfulVideoProps = {
  scene: AtlasScene
  autoplay?: boolean
  playNonce?: number
  loopSegment?: boolean
  compact?: boolean
  onSegmentEnd?: () => void
  onProgress?: (progress: number, seconds: number) => void
  onPlaybackChange?: (isPlaying: boolean) => void
  musicEnabled?: boolean
  musicPlaying?: boolean
  onToggleMusic?: () => void
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${rest.toString().padStart(2, '0')}`
}

export const PixelFaithfulVideo = forwardRef<PixelFaithfulVideoHandle, PixelFaithfulVideoProps>(function PixelFaithfulVideo(
  { scene, autoplay = false, playNonce = 0, loopSegment = false, compact = false, onSegmentEnd, onProgress, onPlaybackChange, musicEnabled = false, musicPlaying = false, onToggleMusic },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [progress, setProgress] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [duration, setDuration] = useState(0)
  const start = scene.segmentStart ?? 0
  const end = scene.segmentEnd

  useImperativeHandle(ref, () => ({
    play: async () => { await videoRef.current?.play() },
    pause: () => videoRef.current?.pause(),
    seek: (value) => {
      const video = videoRef.current
      if (!video) return
      const segmentDuration = (end ?? video.duration) - start
      video.currentTime = start + Math.max(0, Math.min(1, value)) * segmentDuration
    },
  }), [end, start])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    setIsReady(false)
    setHasError(false)
    setProgress(0)
    setSeconds(0)
    setDuration(0)
    video.pause()
    video.load()
  }, [scene.videoSrc, scene.id])

  useEffect(() => {
    if (!playNonce || !isReady) return
    void videoRef.current?.play()
  }, [playNonce, isReady])

  const handleMetadata = () => {
    const video = videoRef.current
    if (!video) return
    const resolvedEnd = end ?? video.duration
    setDuration(Math.max(0, resolvedEnd - start))
    video.currentTime = Math.min(start, Math.max(0, video.duration - 0.05))
    setIsReady(true)
    if (autoplay) void video.play()
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video) return
    const resolvedEnd = end ?? video.duration
    if (!Number.isFinite(resolvedEnd) || resolvedEnd <= start) return
    if (end && video.currentTime >= resolvedEnd - 0.06) {
      if (loopSegment) {
        video.currentTime = start
        void video.play()
      } else {
        video.pause()
        onSegmentEnd?.()
      }
    }
    const nextSeconds = Math.max(0, video.currentTime - start)
    const nextDuration = Math.max(0.01, resolvedEnd - start)
    const nextProgress = Math.min(1, nextSeconds / nextDuration)
    setSeconds(nextSeconds)
    setProgress(nextProgress)
    onProgress?.(nextProgress, nextSeconds)
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video || !isReady) return
    if (video.paused) void video.play()
    else video.pause()
  }

  const handleSeek = (value: string) => {
    const video = videoRef.current
    if (!video) return
    const next = Number(value)
    const resolvedEnd = end ?? video.duration
    video.currentTime = start + next * Math.max(0, resolvedEnd - start)
    setProgress(next)
  }

  return (
    <div className={`faithful-video ${compact ? 'faithful-video--compact' : ''}`}>
      <div className="video-frame">
        <video
          ref={videoRef}
          src={scene.videoSrc}
          poster={scene.poster}
          muted
          playsInline
          preload="metadata"
          onLoadedMetadata={handleMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => { setIsPlaying(true); onPlaybackChange?.(true) }}
          onPause={() => { setIsPlaying(false); onPlaybackChange?.(false) }}
          onEnded={() => onSegmentEnd?.()}
          onError={() => setHasError(true)}
          aria-label={`${scene.place}, ${scene.country} video`}
        />
        {hasError && <div className="video-error"><AlertCircle size={18} /><strong>素材暂时无法播放</strong><span>场景文字仍可继续浏览</span><button type="button" onClick={() => { setHasError(false); videoRef.current?.load() }}>重新加载</button></div>}
        {!hasError && !isReady && <div className="video-loading"><span className="loading-line" /><span className="loading-line loading-line--short" /></div>}
      </div>
      <div className="video-controls" aria-label="视频控制">
        <button type="button" className="control-button control-button--main" onClick={togglePlay} aria-label={isPlaying ? '暂停视频' : '播放视频'} title={isPlaying ? '暂停' : '播放'} disabled={!isReady}>
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>
        <button type="button" className="control-button" onClick={() => { if (videoRef.current) { videoRef.current.currentTime = start; setProgress(0); void videoRef.current.play() } }} aria-label="重播" title="重播" disabled={!isReady}><RotateCcw size={15} /></button>
        <input className="video-scrubber" type="range" min="0" max="1" step="0.001" value={progress} onChange={(event) => handleSeek(event.target.value)} aria-label="视频进度" disabled={!isReady} />
        <span className="video-time">{formatTime(seconds)} / {formatTime(duration)}</span>
        <button type="button" className={`control-button control-button--sound ${musicPlaying ? 'is-audible' : ''}`} onClick={onToggleMusic} aria-pressed={musicEnabled} aria-label={musicEnabled ? '关闭背景音乐' : '开启背景音乐'} title={musicEnabled ? '关闭背景音乐' : '开启背景音乐'}>
          {musicEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>
      </div>
    </div>
  )
})

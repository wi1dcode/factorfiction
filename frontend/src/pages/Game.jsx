import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import GameLayout from '../components/layout/GameLayout'
import EmojiBar from '../components/game/EmojiBar'
import WritingStage     from './game/WritingStage'
import VotingStage      from './game/VotingStage'
import RoundResultStage from './game/RoundResultStage'
import FinishedStage    from './game/FinishedStage'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useSocket } from '../hooks/useSocket'
import { useToast } from '../components/ui/Toast'
import { joinRoom, submitStories, voteStory, nextRound, sendEmoji } from '../services/socket'
import { SOCKET_EVENTS as E, C } from '../utils/constants'

const STAGES = {
  WRITING: 'writing',
  WAITING: 'waitingStories',
  VOTING:  'voting',
  RESULT:  'roundResult',
  FINISHED:'finished',
}

export default function Game() {
  const { code }  = useParams()
  const navigate  = useNavigate()
  const toast     = useToast()

  const [nickname]  = useLocalStorage('ff_nickname', 'Гость')
  const [avatarIdx] = useLocalStorage('ff_avatar', 0)

  const creator   = localStorage.getItem(`ff_creator_${code}`) || ''
  const isCreator = nickname === creator

  const [stage,        setStage]        = useState(STAGES.WRITING)
  const [intervalSec,  setIntervalSec]  = useState(60)
  const [submitted,    setSubmitted]    = useState(false)
  const [submitInfo,   setSubmitInfo]   = useState(null)
  const [currentRound, setCurrentRound] = useState(null)
  const [myVote,       setMyVote]       = useState(null)
  const [votes,        setVotes]        = useState([])
  const [voteSec,      setVoteSec]      = useState(30)
  const [roundResult,  setRoundResult]  = useState(null)
  const [results,      setResults]      = useState([])
  const [emojiFlash,   setEmojiFlash]   = useState(null)
  const [players,      setPlayers]      = useState([])
  const [roundAuthor,  setRoundAuthor]  = useState('')
  // Live scoreboard (nickname → score)
  const [scores,       setScores]       = useState([])

  useEffect(() => {
    joinRoom({ roomCode: code, nickname, avatarIdx })
  }, [])

  // Helper: rebuild scores from players + accumulated votes
  function rebuildScores(ps) {
    setScores(ps.map(p => ({ nickname: p.nickname, score: p.score ?? 0 })))
  }

  useSocket({
    [E.JOINED_ROOM]: (room) => {
      if (room.creator) localStorage.setItem(`ff_creator_${code}`, room.creator)
      if (room.intervalSec || room.interval_sec) setIntervalSec(room.intervalSec || room.interval_sec)
      if (room.players) { setPlayers(room.players); rebuildScores(room.players) }

      const rs = room.reconnectState
      if (!rs) return

      if (rs.stage === STAGES.WRITING) {
        setIntervalSec(rs.intervalSec || 60)
        setStage(STAGES.WRITING)
      } else if (rs.stage === STAGES.WAITING) {
        setSubmitted(true)
        setStage(STAGES.WAITING)
      } else if (rs.stage === STAGES.VOTING && rs.currentRound) {
        setCurrentRound(rs.currentRound)
        setRoundAuthor(rs.currentRound.author)
        setVotes(rs.votes || [])
        setVoteSec(rs.voteSec || 30)
        setMyVote(rs.votes?.find(v => v.voter === nickname)?.storyId ?? null)
        setStage(STAGES.VOTING)
      }
    },

    [E.GAME_STARTED]: ({ intervalSec: sec }) => {
      setIntervalSec(sec || 60)
      setSubmitted(false)
      setScores([])
      setStage(STAGES.WRITING)
    },

    [E.PLAYER_JOINED]: ({ players: ps }) => { setPlayers(ps); rebuildScores(ps) },
    [E.PLAYER_LEFT]:   ({ players: ps }) => { setPlayers(ps); rebuildScores(ps) },

    [E.PLAYER_SUBMITTED]: (info) => setSubmitInfo(info),

    [E.ROUND_STARTED]: (payload) => {
      setCurrentRound(payload)
      setRoundAuthor(payload.author)
      setVotes([])
      setMyVote(null)
      setRoundResult(null)
      setVoteSec(payload.voteSec || 30)
      setStage(STAGES.VOTING)
    },

    [E.VOTE_RECEIVED]: ({ voter, storyId }) => {
      setVotes(prev => prev.find(v => v.voter === voter) ? prev : [...prev, { voter, storyId }])
    },

    [E.ROUND_FINISHED]: (payload) => {
      setRoundResult(payload)
      setStage(STAGES.RESULT)
      // Update scores from votes: +1 per correct vote
      setScores(prev => {
        const next = prev.map(s => ({ ...s }))
        payload.votes.filter(v => v.correct).forEach(v => {
          const entry = next.find(s => s.nickname === v.voter)
          if (entry) entry.score += 1
        })
        return next
      })
    },

    [E.GAME_ENDED]: ({ results: r }) => {
      setResults(r)
      setScores(r.map(x => ({ nickname: x.nickname, score: x.score })))
      setStage(STAGES.FINISHED)
    },

    [E.EMOJI_RECEIVED]: ({ nickname: from, emoji }) => {
      setEmojiFlash({ from, emoji, key: Date.now() })
      setTimeout(() => setEmojiFlash(null), 2500)
    },

    [E.GAME_ERROR]: ({ message }) => toast(message, 'error'),
  })

  function handleSubmit(truthText, lieText) {
    submitStories({ roomCode: code, nickname, stories: [{ text: truthText, truth: true }, { text: lieText, truth: false }] })
    setSubmitted(true)
    setStage(STAGES.WAITING)
  }

  function handleVote(storyId) {
    if (myVote) return
    setMyVote(storyId)
    voteStory({ roomCode: code, nickname, storyId })
  }

  const showEmoji = [STAGES.VOTING, STAGES.RESULT].includes(stage)

  return (
    <GameLayout
      showHome
      players={players}
      nickname={nickname}
      stage={stage}
      roundAuthor={roundAuthor}
      scores={scores}
    >
      {(stage === STAGES.WRITING || stage === STAGES.WAITING) && (
        <WritingStage
          nickname={nickname}
          intervalSec={intervalSec}
          submitted={submitted}
          submitInfo={submitInfo}
          onSubmit={handleSubmit}
        />
      )}

      {stage === STAGES.VOTING && currentRound && (
        <VotingStage
          nickname={nickname}
          currentRound={currentRound}
          votes={votes}
          myVote={myVote}
          voteSec={voteSec}
          onVote={handleVote}
        />
      )}

      {stage === STAGES.RESULT && roundResult && (
        <RoundResultStage
          roundResult={roundResult}
          isCreator={isCreator}
          onNext={() => nextRound({ roomCode: code, nickname })}
          scores={scores}
        />
      )}

      {stage === STAGES.FINISHED && (
        <FinishedStage
          results={results}
          nickname={nickname}
          onHome={() => navigate('/')}
        />
      )}

      {/* Loading fallback */}
      {![STAGES.WRITING, STAGES.WAITING, STAGES.VOTING, STAGES.RESULT, STAGES.FINISHED].includes(stage) && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full border-[3px] border-t-transparent animate-spin"
            style={{ borderColor: `${C.purple}55`, borderTopColor: C.purple }} />
          <p className="font-display font-black text-sm tracking-widest" style={{ color: C.muted }}>ЗАГРУЗКА…</p>
        </div>
      )}

      {showEmoji && (
        <EmojiBar
          onEmoji={emoji => sendEmoji({ roomCode: code, nickname, emoji })}
          flash={emojiFlash}
        />
      )}
    </GameLayout>
  )
}

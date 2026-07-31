'use client'

import { memo, useCallback, useState, useRef, useEffect, useId } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  Bot,
  User,
  Send,
  Loader2,
  FileText,
  Lightbulb,
  StickyNote,
  Clock,
  Sparkles,
  Paperclip,
  RotateCw,
  X,
  Sigma
} from 'lucide-react'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import {
  SourceChatMessage,
  SourceChatContextIndicator,
  BaseChatSession
} from '@/lib/types/api'
import { ModelSelector } from './ModelSelector'
import { ContextIndicator } from '@/components/common/ContextIndicator'
import { SessionManager } from '@/components/sources/SessionManager'
import { MessageActions } from '@/components/sources/MessageActions'
import { convertReferencesToCompactMarkdown, createCompactReferenceLinkComponent } from '@/lib/utils/source-references'
import { useModalManager } from '@/lib/hooks/use-modal-manager'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/hooks/use-translation'

interface NotebookContextStats {
  sourcesInsights: number
  sourcesFull: number
  notesCount: number
  tokenCount?: number
  charCount?: number
}

interface ChatPanelProps {
  messages: SourceChatMessage[]
  isStreaming: boolean
  contextIndicators: SourceChatContextIndicator | null
  onSendMessage: (message: string, modelOverride?: string) => void
  modelOverride?: string
  onModelChange?: (model?: string) => void
  sessions?: BaseChatSession[]
  currentSessionId?: string | null
  onCreateSession?: (title: string) => void
  onSelectSession?: (sessionId: string) => void
  onDeleteSession?: (sessionId: string) => void
  onUpdateSession?: (sessionId: string, title: string) => void
  loadingSessions?: boolean
  title?: string
  contextType?: 'source' | 'notebook'
  notebookContextStats?: NotebookContextStats
  notebookId?: string
}

export function ChatPanel({
  messages,
  isStreaming,
  contextIndicators,
  onSendMessage,
  modelOverride,
  onModelChange,
  sessions = [],
  currentSessionId,
  onCreateSession,
  onSelectSession,
  onDeleteSession,
  onUpdateSession,
  loadingSessions = false,
  title,
  contextType = 'source',
  notebookContextStats,
  notebookId
}: ChatPanelProps) {
  const { t } = useTranslation()
  const [sessionManagerOpen, setSessionManagerOpen] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { openModal } = useModalManager()

  const handleReferenceClick = useCallback((type: string, id: string) => {
    const modalType = type === 'source_insight' ? 'insight' : type as 'source' | 'note' | 'insight'
    try {
      openModal(modalType, id)
    } catch {
      toast.error(t('common.noResults'))
    }
  }, [openModal, t])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  return (
    <>
      <Card className="h-full flex flex-col flex-1 overflow-hidden border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm bg-card relative">
        
        {/* Header Bar matching Target UI */}
        <CardHeader className="!py-1 px-4 border-b flex-shrink-0 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <CardTitle className="text-sm font-bold truncate text-slate-800 dark:text-slate-200">
                {title || 'Notebook AI Assistant'}
              </CardTitle>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-500 hover:text-slate-800"
                onClick={() => setSessionManagerOpen(true)}
                title="Lịch sử trò chuyện"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Quick Suggestion Chips matching Target UI */}
        <div className="flex items-center gap-2 overflow-x-auto p-3 border-b bg-slate-50/30 dark:bg-slate-900/30 no-scrollbar flex-shrink-0">
          <button
            onClick={() => onSendMessage("Tóm tắt tài liệu")}
            className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm"
          >
            Tóm tắt tài liệu
          </button>
          <button
            onClick={() => onSendMessage("Thông tin tổng quan về buổi học")}
            className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm"
          >
            Thông tin về buổi học
          </button>
          <button
            onClick={() => onSendMessage("Những điều cần lưu ý")}
            className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm"
          >
            Những điểm cần lưu ý 
          </button>
        </div>

        {/* Chat Messages Stream Area */}
        <CardContent className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4 min-h-0">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3 my-auto">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-1 max-w-[280px]">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Chào bạn! Tôi đã phân tích tài liệu này.</p>
                <p className="text-xs text-muted-foreground">
                  Bạn có thể hỏi tôi bất kỳ điểm nào về kiến trúc hoặc yêu cầu tóm tắt các phát kiến chính.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, idx) => (
              <ChatMessage
                key={message.id || idx}
                message={message}
                notebookId={notebookId}
                onReferenceClick={handleReferenceClick}
              />
            ))
          )}

          {isStreaming && (
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-medium p-2 bg-indigo-50/50 rounded-xl max-w-xs animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin" />
              AI đang suy nghĩ & phân tích tài liệu...
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Composer Box */}
        <ChatComposer
          onSendMessage={onSendMessage}
          isStreaming={isStreaming}
          modelOverride={modelOverride}
          onModelChange={onModelChange}
        />

        {/* Floating Quick Action Pill on bottom right matching Target UI */}
        <div className="absolute bottom-16 right-4 z-10 pointer-events-none">
          <div className="pointer-events-auto p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-indigo-600 animate-bounce" />
          </div>
        </div>
      </Card>
    </>
  )
}

interface ChatComposerProps {
  onSendMessage: (message: string, modelOverride?: string) => void
  isStreaming: boolean
  modelOverride?: string
  onModelChange?: (model?: string) => void
}

function ChatComposer({
  onSendMessage,
  isStreaming,
  modelOverride,
  onModelChange
}: ChatComposerProps) {
  const { t } = useTranslation()
  const chatInputId = useId()
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim() && !isStreaming) {
      onSendMessage(input.trim(), modelOverride)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const isMac = typeof navigator !== 'undefined' && navigator.userAgent.toUpperCase().indexOf('MAC') >= 0
    const isModifierPressed = isMac ? e.metaKey : e.ctrlKey

    if (e.key === 'Enter' && isModifierPressed) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-3 border-t bg-slate-50/40 dark:bg-slate-900/40 space-y-2 flex-shrink-0">
      {onModelChange && (
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-semibold text-muted-foreground">Mô hình AI:</span>
          <ModelSelector
            currentModel={modelOverride}
            onModelChange={onModelChange}
            disabled={isStreaming}
          />
        </div>
      )}

      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 rounded-2xl p-2.5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
        <Textarea
          id={chatInputId}
          name="chat-message"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Hỏi AI về tài liệu này..."
          disabled={isStreaming}
          className="flex-1 min-h-[36px] max-h-[80px] border-none shadow-none focus-visible:ring-0 resize-none py-1 px-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
          rows={1}
        />

        <div className="flex items-center gap-1.5 shrink-0">
          <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg" title="Đính kèm">
            <Paperclip className="h-4 w-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg" title="Công thức Toán">
            <Sigma className="h-4 w-4" />
          </button>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            size="icon"
            className="h-8 w-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
          >
            {isStreaming ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

interface ChatMessageProps {
  message: SourceChatMessage
  notebookId?: string
  onReferenceClick: (type: string, id: string) => void
}

const ChatMessage = memo(function ChatMessage({
  message,
  onReferenceClick
}: ChatMessageProps) {
  const isUser = message.type === 'human'

  return (
    <div className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Bot className="h-3.5 w-3.5" />
        </div>
      )}

<div className={`flex flex-col gap-1 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-3.5 px-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
            isUser
              // USER BUBBLE: Added [&_*]:text-white to force all markdown text to be white
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white [&_*]:text-white rounded-2xl rounded-tr-sm font-medium'
              // AI BUBBLE: Removed the extra text-white so it stays dark gray (text-slate-800 dark:text-slate-200)
              : 'bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm'
          }`}
        >
          <MarkdownRenderer>
            {message.content}
          </MarkdownRenderer>
        </div>

        <span className="text-[10px] text-muted-foreground px-1">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
})

'use client'

import { useState } from 'react'
import { NotebookResponse } from '@/lib/types/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Archive,
  ArchiveRestore,
  Trash2,
  BookOpen,
  Columns,
  MessageSquare,
  Sparkles,
  Shield,
  ShieldAlert,
  Share2,
  Download,
  RotateCcw
} from 'lucide-react'
import { useUpdateNotebook } from '@/lib/hooks/use-notebooks'
import { NotebookDeleteDialog } from './NotebookDeleteDialog'
import { formatDistanceToNow } from 'date-fns'
import { getDateLocale } from '@/lib/utils/date-locale'
import { InlineEdit } from '@/components/common/InlineEdit'
import { useTranslation } from '@/lib/hooks/use-translation'
import { useNotebookColumnsStore } from '@/lib/stores/notebook-columns-store'

interface NotebookHeaderProps {
  notebook: NotebookResponse
  isAdmin?: boolean
  onToggleAdmin?: () => void
}

export function NotebookHeader({ notebook, isAdmin = false, onToggleAdmin }: NotebookHeaderProps) {
  const { t, language } = useTranslation()
  const dfLocale = getDateLocale(language)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [activeTab, setActiveTab] = useState<'split' | 'pdf' | 'chat' | 'breakthrough'>('split')
  const { setPresetSplit, setPresetPdfFocus, setPresetChatFocus } = useNotebookColumnsStore()
  
  const updateNotebook = useUpdateNotebook()

  const handleUpdateName = async (name: string) => {
    if (!name || name === notebook.name) return
    
    await updateNotebook.mutateAsync({
      id: notebook.id,
      data: { name }
    })
  }

  const handleArchiveToggle = () => {
    updateNotebook.mutate({
      id: notebook.id,
      data: { archived: !notebook.archived }
    })
  }

  return (
    <>
      <div className="w-full bg-background border-b px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* Left: Icon, Title, Metadata & Role Badge */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-3">
              <InlineEdit
                id="notebook-name"
                name="notebook-name"
                value={notebook.name}
                onSave={handleUpdateName}
                className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground truncate max-w-xs sm:max-w-md"
                inputClassName="font-display text-lg sm:text-xl font-bold tracking-tight"
                placeholder={t('notebooks.namePlaceholder')}
              />
              {notebook.archived && (
                <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                  {t('notebooks.archived')}
                </Badge>
              )}

              {/* Permission Role Badge */}
              <button
                onClick={onToggleAdmin}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isAdmin
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800'
                }`}
                title="Bấm để chuyển đổi quyền Admin / Học viên"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-emerald-500' : 'bg-teal-500'} animate-pulse`} />
                {isAdmin ? 'Quyền: Admin (Được up bài)' : 'Quyền: Học viên (Xem)'}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>Cập nhật {formatDistanceToNow(new Date(notebook.updated), { addSuffix: true, locale: dfLocale })}</span>
              <span>•</span>
              <span>47 trang tài liệu</span>
            </div>
          </div>
        </div>

        {/* Center: Mode Control Tabs (As in target UI image) */}
        <div className="hidden xl:flex items-center bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-inner gap-1">
          <button
            onClick={() => { setActiveTab('split'); setPresetSplit(); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'split'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Columns className="h-3.5 w-3.5 text-indigo-500" />
            Chia đôi màn hình
          </button>

          <button
            onClick={() => { setActiveTab('pdf'); setPresetPdfFocus(); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'pdf'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
            Tập trung đọc PDF
          </button>

          <button
            onClick={() => { setActiveTab('chat'); setPresetChatFocus(); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
            Trợ lý AI Chat
          </button>

          <button
            onClick={() => { setActiveTab('breakthrough'); setPresetSplit(); }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800 border border-indigo-200/80 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-spin" />
            Phân tích Đột phá UI
          </button>
        </div>

        {/* Right: Quick Action Buttons & Avatar */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleArchiveToggle}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title={notebook.archived ? t('notebooks.unarchive') : t('notebooks.archive')}
          >
            {notebook.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            title={t('common.delete')}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 border border-slate-300/80 dark:border-slate-600 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200 shadow-sm ml-1">
            {isAdmin ? 'AD' : 'HV'}
          </div>
        </div>
      </div>

      <NotebookDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        notebookId={notebook.id}
        notebookName={notebook.name}
        redirectAfterDelete
      />
    </>
  )
}
'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { SourceListResponse } from '@/lib/types/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, FileText, Link2, ChevronDown, Loader2, ListChecks } from 'lucide-react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { AddSourceDialog } from '@/components/sources/AddSourceDialog'
import { AddExistingSourceDialog } from '@/components/sources/AddExistingSourceDialog'
import { SourceCard } from '@/components/sources/SourceCard'
import { useDeleteSource, useRetrySource, useRemoveSourceFromNotebook } from '@/lib/hooks/use-sources'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useModalManager } from '@/lib/hooks/use-modal-manager'
import { ContextMode } from '../[id]/page'
import type { SourceBulkAction } from '@/lib/utils/source-context'
import { CollapsibleColumn, createCollapseButton } from '@/components/notebooks/CollapsibleColumn'
import { useNotebookColumnsStore } from '@/lib/stores/notebook-columns-store'
import { useTranslation } from '@/lib/hooks/use-translation'

interface SourcesColumnProps {
  sources?: SourceListResponse[]
  isLoading: boolean
  notebookId: string
  notebookName?: string
  onRefresh?: () => void
  contextSelections?: Record<string, ContextMode>
  onContextModeChange?: (sourceId: string, mode: ContextMode) => void
  onBulkContextModeChange?: (action: SourceBulkAction) => void
  selectedSourceId?: string | null
  onSelectSource?: (sourceId: string) => void
  isAdmin?: boolean
  // Pagination props
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => void
}

export function SourcesColumn({
  sources,
  isLoading,
  notebookId,
  onRefresh,
  contextSelections,
  onContextModeChange,
  onBulkContextModeChange,
  selectedSourceId,
  onSelectSource,
  isAdmin = true,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: SourcesColumnProps) {
  const { t } = useTranslation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addExistingDialogOpen, setAddExistingDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sourceToDelete, setSourceToDelete] = useState<string | null>(null)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [sourceToRemove, setSourceToRemove] = useState<string | null>(null)

  const { openModal } = useModalManager()
  const deleteSource = useDeleteSource()
  const retrySource = useRetrySource()
  const removeFromNotebook = useRemoveSourceFromNotebook()

  // Collapsible column state
  const { sourcesCollapsed, toggleSources } = useNotebookColumnsStore()
  const collapseButton = useMemo(
    () => createCollapseButton(toggleSources, t('navigation.sources')),
    [toggleSources, t('navigation.sources')]
  )

  // Scroll container ref for infinite scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Handle scroll for infinite loading
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container || !hasNextPage || isFetchingNextPage || !fetchNextPage) return

    const { scrollTop, scrollHeight, clientHeight } = container
    // Load more when user scrolls within 200px of the bottom
    if (scrollHeight - scrollTop - clientHeight < 200) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Attach scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])
  
  const handleDeleteClick = (sourceId: string) => {
    setSourceToDelete(sourceId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!sourceToDelete) return

    try {
      await deleteSource.mutateAsync(sourceToDelete)
      setDeleteDialogOpen(false)
      setSourceToDelete(null)
      onRefresh?.()
    } catch (error) {
      console.error('Failed to delete source:', error)
    }
  }

  const handleRemoveFromNotebook = (sourceId: string) => {
    setSourceToRemove(sourceId)
    setRemoveDialogOpen(true)
  }

  const handleRemoveConfirm = async () => {
    if (!sourceToRemove) return

    try {
      await removeFromNotebook.mutateAsync({
        notebookId,
        sourceId: sourceToRemove
      })
      setRemoveDialogOpen(false)
      setSourceToRemove(null)
    } catch (error) {
      console.error('Failed to remove source from notebook:', error)
      // Error toast is handled by the hook
    }
  }

  const handleRetry = async (sourceId: string) => {
    try {
      await retrySource.mutateAsync(sourceId)
    } catch (error) {
      console.error('Failed to retry source:', error)
    }
  }

  const handleSourceClick = (sourceId: string) => {
    onSelectSource?.(sourceId)
  }

  return (
    <>
      <CollapsibleColumn
        isCollapsed={sourcesCollapsed}
        onToggle={toggleSources}
        collapsedIcon={FileText}
        collapsedLabel={t('navigation.sources')}
      >
        <Card className="h-full flex flex-col flex-1 overflow-hidden border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm bg-card">
          <CardHeader className="!py-1 px-4 border-b flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <FileText className="h-4 w-4 text-indigo-500" />
                NGUỒN TÀI LIỆU ({sources?.length || 0})
              </CardTitle>
              <div className="flex items-center gap-1.5">
                {onBulkContextModeChange && sources && sources.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" title={t('sources.bulkContext')}>
                        <ListChecks className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onBulkContextModeChange('insights')}>
                        {t('sources.includeAllInsights')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onBulkContextModeChange('full')}>
                        {t('sources.includeAllFull')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onBulkContextModeChange('exclude')}>
                        {t('sources.excludeAllFromContext')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {collapseButton}
              </div>
            </div>
          </CardHeader>

          <CardContent ref={scrollContainerRef} className="flex-1 p-2 overflow-y-auto min-h-0 space-y-2">
            {/* Primary Add Source Button - Dashed border pill matching target UI */}
            {isAdmin ? (
              <button
                onClick={() => setAddDialogOpen(true)}
                className="w-full py-2.5 px-4 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/30 hover:bg-indigo-50 dark:bg-indigo-950/20 dark:hover:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold text-xs flex items-center justify-center gap-2 transition-all group"
              >
                <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                + Thêm nguồn mới
              </button>
            ) : (
              <button
                disabled
                className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 bg-slate-100 text-slate-400 text-xs font-medium flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
              >
                <Plus className="h-4 w-4" />
                Chỉ Admin mới được thêm nguồn
              </button>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : !sources || sources.length === 0 ? (
              <EmptyState
                icon={FileText}
                title={t('sources.noSourcesYet')}
                description={t('sources.createFirstSource')}
              />
            ) : (
              <div className="space-y-1">
                {sources.map((source) => {
                  const isSelected = selectedSourceId === source.id
                  return (
                    <SourceCard
                      key={source.id}
                      source={source}
                      onClick={handleSourceClick}
                      onDelete={handleDeleteClick}
                      onRetry={handleRetry}
                      onRefreshContent={handleRetry}
                      onRemoveFromNotebook={handleRemoveFromNotebook}
                      onRefresh={onRefresh}
                      showRemoveFromNotebook={true}
                      className={isSelected ? 'ring-2 ring-indigo-500/80 bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 shadow-sm' : ''}
                      contextMode={contextSelections?.[source.id]}
                      onContextModeChange={onContextModeChange
                        ? (mode) => onContextModeChange(source.id, mode)
                        : undefined
                      }
                    />
                  )
                })}
                {/* Loading indicator for infinite scroll */}
                {isFetchingNextPage && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            )}
          </CardContent>

          {/* Footer Bar matching target UI */}
          <div className="p-3 px-4 border-t bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-muted-foreground flex-shrink-0">
            <span>Tổng bộ nhớ: 18.4 MB</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Đã indexed</span>
          </div>
        </Card>
      </CollapsibleColumn>

      <AddSourceDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        defaultNotebookId={notebookId}
      />

      <AddExistingSourceDialog
        open={addExistingDialogOpen}
        onOpenChange={setAddExistingDialogOpen}
        notebookId={notebookId}
        onSuccess={onRefresh}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('sources.delete')}
        description={t('sources.deleteConfirm')}
        confirmText={t('common.delete')}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteSource.isPending}
        confirmVariant="destructive"
      />

      <ConfirmDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        title={t('sources.removeFromNotebook')}
        description={t('sources.removeConfirm')}
        confirmText={t('common.remove')}
        onConfirm={handleRemoveConfirm}
        isLoading={removeFromNotebook.isPending}
        confirmVariant="default"
      />
    </>
  )
}

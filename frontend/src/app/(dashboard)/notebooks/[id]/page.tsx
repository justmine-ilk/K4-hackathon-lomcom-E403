'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { NotebookHeader } from '../components/NotebookHeader'
import { SourcesColumn } from '../components/SourcesColumn'
import { SlidePreviewColumn } from '../components/SlidePreviewColumn'
import { ChatColumn } from '../components/ChatColumn'
import { useNotebook } from '@/lib/hooks/use-notebooks'
import { useNotebookSources } from '@/lib/hooks/use-sources'
import { useNotes } from '@/lib/hooks/use-notes'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { useNotebookColumnsStore } from '@/lib/stores/notebook-columns-store'
import { useIsDesktop } from '@/lib/hooks/use-media-query'
import { useTranslation } from '@/lib/hooks/use-translation'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Presentation, MessageSquare, Shield, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  applyBulkSourceContext,
  applyBulkNoteContext,
  computeSourceSelections,
  computeNoteSelections,
  type SourceContextDefault,
  type SourceBulkAction,
  type NoteContextDefault,
} from '@/lib/utils/source-context'

// Re-exported from the shared types module for backward compatibility; several
// components historically import these from this route file.
import type { ContextMode, ContextSelections, NoteContextMode } from '@/lib/types/notebook-context'
export type { ContextMode, ContextSelections, NoteContextMode }

export default function NotebookPage() {
  const { t } = useTranslation()
  const params = useParams()

  // Ensure the notebook ID is properly decoded from URL
  const notebookId = params?.id ? decodeURIComponent(params.id as string) : ''

  const { data: notebook, isLoading: notebookLoading } = useNotebook(notebookId)
  const {
    sources,
    isLoading: sourcesLoading,
    refetch: refetchSources,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useNotebookSources(notebookId)
  const { data: notes, isLoading: notesLoading } = useNotes(notebookId)

  // Get collapse states for dynamic layout
  const { sourcesCollapsed, notesCollapsed, chatCollapsed } = useNotebookColumnsStore()

  // Detect desktop to avoid double-mounting ChatColumn
  const isDesktop = useIsDesktop()

  // Mobile tab state (Sources, Notes, or Chat)
  const [mobileActiveTab, setMobileActiveTab] = useState<'sources' | 'notes' | 'chat'>('chat')

  // Context selection state
  const [contextSelections, setContextSelections] = useState<ContextSelections>({
    sources: {},
    notes: {}
  })

  // The default context mode applied to sources as they load. A bulk
  // include/exclude updates this so sources loaded later via pagination follow
  // the same intent instead of reverting to "included" (#223/#915).
  const [sourceContextDefault, setSourceContextDefault] = useState<SourceContextDefault>('include')

  // Same idea for notes loaded later (notes are binary: included/off).
  const [noteContextDefault, setNoteContextDefault] = useState<NoteContextDefault>('include')

  // Initialize and update selections when sources load or change
  useEffect(() => {
    if (sources && sources.length > 0) {
      setContextSelections(prev => ({
        ...prev,
        sources: computeSourceSelections(prev.sources, sources, sourceContextDefault),
      }))
    }
  }, [sources, sourceContextDefault])

  useEffect(() => {
    if (notes && notes.length > 0) {
      setContextSelections(prev => ({
        ...prev,
        notes: computeNoteSelections(prev.notes, notes, noteContextDefault),
      }))
    }
  }, [notes, noteContextDefault])

  const handleSourceContextModeChange = (sourceId: string, mode: ContextMode) => {
    setContextSelections(prev => ({
      ...prev,
      sources: {
        ...prev.sources,
        [sourceId]: mode
      }
    }))
  }

  const handleNoteContextModeChange = (noteId: string, mode: NoteContextMode) => {
    setContextSelections(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [noteId]: mode
      }
    }))
  }

  // Bulk-apply a context action (insights-only / full / exclude) to every
  // source at once (#223). Also records the action as the default for sources
  // loaded later (#915).
  const handleBulkSourceContext = (action: SourceBulkAction) => {
    setSourceContextDefault(action)
    setContextSelections(prev => ({
      ...prev,
      sources: applyBulkSourceContext(prev.sources, sources ?? [], action),
    }))
  }

  // Bulk include/exclude every note from the chat context at once (#223).
  const handleBulkNoteContext = (action: NoteContextDefault) => {
    setNoteContextDefault(action)
    setContextSelections(prev => ({
      ...prev,
      notes: applyBulkNoteContext(prev.notes, notes ?? [], action),
    }))
  }

  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(true)

  // Auto-select first source when loaded
  useEffect(() => {
    if (sources && sources.length > 0 && !selectedSourceId) {
      setSelectedSourceId(sources[0].id)
    }
  }, [sources, selectedSourceId])

  if (notebookLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!notebook) {
    return (
      <AppShell>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{t('notebooks.notFound')}</h1>
          <p className="text-muted-foreground">{t('notebooks.notFoundDesc')}</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-shrink-0">
          <NotebookHeader
            notebook={notebook}
            isAdmin={isAdmin}
            onToggleAdmin={() => setIsAdmin(!isAdmin)}
          />
        </div>

        <div className="flex-1 p-6 pt-6 overflow-x-auto flex flex-col">
          {/* Mobile: Tabbed interface */}
          {!isDesktop && (
            <>
              <div className="lg:hidden mb-4">
                <Tabs value={mobileActiveTab} onValueChange={(value) => setMobileActiveTab(value as 'sources' | 'notes' | 'chat')}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="sources" className="gap-2">
                      <FileText className="h-4 w-4" />
                      {t('navigation.sources')}
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="gap-2">
                      <Presentation className="h-4 w-4 text-amber-500" />
                      Slide / Preview
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      {t('common.chat')}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Mobile: Show only active tab */}
              <div className="flex-1 overflow-hidden lg:hidden">
                {mobileActiveTab === 'sources' && (
                  <SourcesColumn
                    sources={sources}
                    isLoading={sourcesLoading}
                    notebookId={notebookId}
                    notebookName={notebook?.name}
                    onRefresh={refetchSources}
                    contextSelections={contextSelections.sources}
                    onContextModeChange={handleSourceContextModeChange}
                    onBulkContextModeChange={handleBulkSourceContext}
                    selectedSourceId={selectedSourceId}
                    onSelectSource={(id) => setSelectedSourceId(id)}
                    isAdmin={isAdmin}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                  />
                )}
                {mobileActiveTab === 'notes' && (
                  <SlidePreviewColumn
                    selectedSourceId={selectedSourceId}
                    sources={sources}
                    isLoading={sourcesLoading}
                  />
                )}
                {mobileActiveTab === 'chat' && (
                  <ChatColumn
                    notebookId={notebookId}
                    contextSelections={contextSelections}
                    sources={sources}
                    sourcesLoading={sourcesLoading}
                  />
                )}
              </div>
            </>
          )}

          {/* Desktop: Collapsible columns layout */}
          <div className={cn(
            'hidden lg:flex h-full min-h-0 gap-6 transition-all duration-150',
            'flex-row'
          )}>
            {/* Sources Column (20%) */}
            <div className={cn(
              'transition-all duration-200',
              sourcesCollapsed ? 'w-12 flex-shrink-0' : 'w-1/5 min-w-[220px] max-w-[300px] flex-shrink-0'
            )}>
              <SourcesColumn
                sources={sources}
                isLoading={sourcesLoading}
                notebookId={notebookId}
                notebookName={notebook?.name}
                onRefresh={refetchSources}
                contextSelections={contextSelections.sources}
                onContextModeChange={handleSourceContextModeChange}
                onBulkContextModeChange={handleBulkSourceContext}
                selectedSourceId={selectedSourceId}
                onSelectSource={(id) => setSelectedSourceId(id)}
                isAdmin={isAdmin}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
              />
            </div>

            {/* Slide / PDF Preview Column (Main 50%) */}
            <div className={cn(
              'transition-all duration-200 flex-1 min-w-0'
            )}>
              <SlidePreviewColumn
                selectedSourceId={selectedSourceId}
                sources={sources}
                isLoading={sourcesLoading}
              />
            </div>

            {/* Chat Column (30%) */}
            <div className={cn(
              'transition-all duration-200',
              chatCollapsed ? 'w-12 flex-shrink-0' : 'w-[30%] min-w-[320px] max-w-[440px] flex-shrink-0'
            )}>
              <ChatColumn
                notebookId={notebookId}
                contextSelections={contextSelections}
                sources={sources}
                sourcesLoading={sourcesLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { SourceListResponse } from '@/lib/types/api'
import { sourcesApi } from '@/lib/api/sources'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import {
  Presentation,
  Maximize2,
  Minimize2,
  AlertCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Search,
  Maximize
} from 'lucide-react'
import { CollapsibleColumn, createCollapseButton } from '@/components/notebooks/CollapsibleColumn'
import { useNotebookColumnsStore } from '@/lib/stores/notebook-columns-store'
import { useTranslation } from '@/lib/hooks/use-translation'

interface SlidePreviewColumnProps {
  selectedSourceId: string | null
  sources?: SourceListResponse[]
  isLoading?: boolean
}

export function SlidePreviewColumn({ selectedSourceId, sources, isLoading }: SlidePreviewColumnProps) {
  const { t } = useTranslation()
  const { notesCollapsed, toggleNotes } = useNotebookColumnsStore()
  
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentPage, setCurrentPage] = useState(2)
  const [totalPages, setTotalPages] = useState(47)
  const [zoomLevel, setZoomLevel] = useState(100)

  const collapseButton = useMemo(
    () => createCollapseButton(toggleNotes, 'SLIDE / PREVIEW'),
    [toggleNotes]
  )

  const source = useMemo(() => {
    if (!selectedSourceId || !sources) return null
    return sources.find(s => s.id === selectedSourceId) || null
  }, [selectedSourceId, sources])

  const sourceLoading = isLoading && !source

  // Detect if source is PDF
  const isPdf = useMemo(() => {
    if (!source) return false
    const titleLower = source.title?.toLowerCase() || ''
    const filePathLower = source.asset?.file_path?.toLowerCase() || ''
    return titleLower.endsWith('.pdf') || filePathLower.endsWith('.pdf')
  }, [source])

  // Download PDF Blob for embedded iframe viewer
  const loadPdf = useCallback(async (sourceId: string) => {
    setLoadingPdf(true)
    setPdfError(null)

    try {
      const blob = await sourcesApi.downloadFile(sourceId)
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (err) {
      console.error('Failed to load PDF file:', err)
      setPdfError(t('sources.downloadError') || 'Không thể tải tập tin PDF.')
    } finally {
      setLoadingPdf(false)
    }
  }, [t])

  useEffect(() => {
    if (isPdf && source?.id) {
      loadPdf(source.id)
    } else {
      setPdfUrl(null)
      setLoadingPdf(false)
      setPdfError(null)
    }
  }, [isPdf, source?.id, loadPdf])

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  return (
    <CollapsibleColumn
      isCollapsed={notesCollapsed}
      onToggle={toggleNotes}
      collapsedIcon={Presentation}
      collapsedLabel="SLIDE / PREVIEW"
    >
      <Card className={`h-full flex flex-col transition-all duration-200 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm bg-card overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl bg-background' : ''}`}>
        
        {/* PDF / Slide Toolbar matching target UI */}
        <CardHeader className="py-2.5 px-4 border-b flex flex-row items-center justify-between space-y-0 flex-shrink-0 bg-slate-50/70 dark:bg-slate-900/70">
          {/* Pagination Toolbar `< 2 / 47 >` */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 px-2 rounded-xl border shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-200">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-800"
              title="Trang trước"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-1 min-w-[50px] text-center font-mono">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500 hover:text-slate-800"
              title="Trang tiếp"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Zoom Controls `- 100% +` */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 px-2 rounded-xl border shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-200">
            <button
              onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500"
              title="Thu nhỏ"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="px-1 font-mono min-w-[42px] text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(200, prev + 10))}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500"
              title="Phóng to"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Search, Fullscreen & Collapse Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-800" title="Tìm kiếm">
              <Search className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-500 hover:text-slate-800"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
            </Button>
            {collapseButton}
          </div>
        </CardHeader>

        {/* Main Document Canvas Window */}
        <CardContent className="flex-1 p-6 overflow-y-auto flex flex-col bg-[#F4F6FB] dark:bg-slate-950 items-center">
          {!selectedSourceId ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <BookOpen className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Chưa chọn bài học / slide</p>
                <p className="text-xs text-muted-foreground max-w-[260px]">
                  Bấm vào một Nguồn (Source) ở cột bên trái để hiển thị Slide hoặc Tài liệu tại đây.
                </p>
              </div>
            </div>
          ) : sourceLoading || loadingPdf ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 p-8">
              <LoadingSpinner size="lg" />
              <span className="text-xs text-muted-foreground font-medium">Đang tải Slide / Tài liệu...</span>
            </div>
          ) : isPdf && pdfUrl ? (
            <div className="flex-1 w-full h-full rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-lg bg-zinc-900 min-h-[450px]">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0 min-h-[450px]"
                title={source?.title || 'Slide PDF'}
              />
            </div>
          ) : (
            /* Styled Floating Document Canvas Matching Target UI */
            <div
              className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-6 text-slate-800 dark:text-slate-200 transition-transform"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* Header Title Metadata */}
              <div className="flex items-center justify-between border-b pb-4 text-[11px] font-mono tracking-wider uppercase text-slate-400 font-semibold">
                <span>KIMI K3 TECHNICAL REPORT</span>
                <span>PAGE 02 OF 47</span>
              </div>

              {/* Styled Highlight Callout Quote matching target UI */}
              <div className="bg-amber-50/90 dark:bg-amber-950/40 border-l-4 border-amber-400 p-4 rounded-r-2xl my-4 text-amber-900 dark:text-amber-200 font-medium text-xs sm:text-sm leading-relaxed italic shadow-sm">
                &quot;We introduce Kimi K3, a native multimodal Mixture-of-Experts model with 2.8 trillion total parameters and 104 billion activated parameters per token.&quot;
              </div>

              {/* Main Text Content */}
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <MarkdownRenderer>
                  {source?.full_text || `reasoning behaviors from strong pre-trained models, and Kimi K2.5 Agent Swarm further extends test-time scaling from sequential reasoning to parallel agent coordination. These architectural advances provide efficient long-context processing with Kimi Delta Attention (KDA).`}
                </MarkdownRenderer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </CollapsibleColumn>
  )
}

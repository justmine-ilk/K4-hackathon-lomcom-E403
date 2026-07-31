'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { SourceListResponse, SourceDetailResponse } from '@/lib/types/api'
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
  Maximize,
  FileText
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
  const [sourceDetail, setSourceDetail] = useState<SourceDetailResponse | null>(null)
  const [loadingContent, setLoadingContent] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(100)

  const collapseButton = useMemo(
    () => createCollapseButton(toggleNotes, 'SLIDE / PREVIEW'),
    [toggleNotes]
  )

  const baseSource = useMemo(() => {
    if (!selectedSourceId || !sources) return null
    return sources.find(s => s.id === selectedSourceId) || null
  }, [selectedSourceId, sources])

  // Fetch full detail content when selectedSourceId changes
  useEffect(() => {
    if (!selectedSourceId) {
      setSourceDetail(null)
      return
    }

    setLoadingContent(true)
    sourcesApi.get(selectedSourceId)
      .then((detail) => {
        setSourceDetail(detail)
      })
      .catch((err) => {
        console.warn('Failed to load source detail:', err)
      })
      .finally(() => {
        setLoadingContent(false)
      })
  }, [selectedSourceId])

  // Download PDF Blob for embedded iframe viewer
  const loadPdf = useCallback(async (sourceId: string) => {
    try {
      const response = await sourcesApi.downloadFile(sourceId)
      if (response && response.data) {
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
      }
    } catch (err) {
      console.warn('PDF download error:', err)
      setPdfUrl(null)
    }
  }, [])

  useEffect(() => {
    if (selectedSourceId) {
      loadPdf(selectedSourceId)
    } else {
      setPdfUrl(null)
    }
  }, [selectedSourceId, loadPdf])

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  const activeTitle = sourceDetail?.title || baseSource?.title || 'Slide tài liệu'
  const realTextContent = sourceDetail?.full_text || sourceDetail?.overview || baseSource?.full_text || ''

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
          {/* Pagination Toolbar `< 1 / 47 >` */}
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
        <CardContent className="flex-1 p-6 overflow-y-auto flex flex-col bg-[#F4F6FB] dark:bg-slate-950 items-center justify-start">
          {!selectedSourceId ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3 my-auto">
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
          ) : isLoading || loadingContent ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 p-8 my-auto">
              <LoadingSpinner size="lg" />
              <span className="text-xs text-muted-foreground font-medium">Đang nạp nội dung bài học...</span>
            </div>
          ) : pdfUrl ? (
            /* Render Live PDF File Iframe Viewer */
            <div className="w-full h-full min-h-[550px] flex-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xl bg-white dark:bg-slate-900">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0 min-h-[550px] bg-white"
                title={activeTitle}
              />
            </div>
          ) : (
            /* Render Real Extracted Document Text in Styled Paper View */
            <div
              className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-6 text-slate-800 dark:text-slate-200 transition-transform"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* Header Title Metadata */}
              <div className="flex items-center justify-between border-b pb-4 text-[11px] font-mono tracking-wider uppercase text-slate-400 font-semibold">
                <span className="truncate max-w-[280px]">{activeTitle}</span>
                <span>DOC PREVIEW</span>
              </div>

              {/* Main Text Content */}
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {realTextContent ? (
                  <MarkdownRenderer>
                    {realTextContent}
                  </MarkdownRenderer>
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center py-6">
                    Không tìm thấy nội dung văn bản thô của tài liệu này. Hãy kiểm tra trạng thái xử lý ở cột bên trái.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </CollapsibleColumn>
  )
}

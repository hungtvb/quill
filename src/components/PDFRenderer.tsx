'use client'

import { ChevronDown, ChevronUp, Loader, Search, ZoomIn, ZoomInIcon } from 'lucide-react'
import React, { useState } from 'react'
import {Document, Page, pdfjs} from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { useToast } from './ui/use-toast'
import { Button } from './ui/button'
import { useResizeDetector } from 'react-resize-detector'
import PDFPageControl from './PDFPageControl'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenu, DropdownMenuTrigger} from './ui/dropdown-menu'
import SimpleBar from 'simplebar-react'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
 
type PDFRendererProps =  {
  url: string
}

const PDFLoading = () => {
  return (
    <div className='flex justify-center items-center flex-col'>
      <Loader className='mt-24 w-8 h-8 animate-spin text-red-500' />
      <p className='text-xs mt-2 mb-24 text-zinc-600'>Loading your PDF file...</p>
    </div>
  )
}

const PDFLoadError = () => {
  return (
    <div className='my-24 text-center'>
      <p className='text-md font-bold text-red-500'>Failed to load your PDF.</p> 
      <p className=' text-xs'>Please reload to try again!</p>
    </div>
  )
}

const scaleOptions = [1, 1.5, 2, 2.5];

const PDFRenderer = ({url} : PDFRendererProps) => {

  const {toast} = useToast();
  const [numberPages, setNumberPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);

  const { width, ref } = useResizeDetector()

  return (
    <div className='w-full bg-white rounded-md shadow flex flex-col items-center'>
        <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
            <PDFPageControl currentPage={currentPage} setCurrentPage={setCurrentPage} numberOfPages={numberPages} />
            <div className='space-x-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='gap-1.5' aria-label='zoom' variant='ghost'>
                    <Search className='w-5 h-5'/>
                    <span>{scale * 100}%</span>
                    <ChevronDown className='w-4 h-4'/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {scaleOptions.map((s) => (
                    <DropdownMenuItem key={s} onSelect={() => setScale(s)} className='cursor-pointer'>
                      {s *100}%
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </div>
        <div className='flex-1 w-full max-h-screen'>
          <SimpleBar autoHide={true} className='max-h-[calc(100vh-10rem)]'>
            <div ref={ref}>
              <Document file={url} 
                  className="max-w-full"
                  onLoadSuccess={({numPages}) => setNumberPages(numPages)} 
                  loading={<PDFLoading/>}  
                  error={<PDFLoadError/>}>
                    <Page pageNumber={currentPage} scale={scale} width={width} />
              </Document>
            </div>
          </SimpleBar>
        </div>
    </div>
  )
}

export default PDFRenderer
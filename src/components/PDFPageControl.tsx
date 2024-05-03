import React from 'react'
import { Button } from './ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from './ui/input'
import { z } from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'

type PDFPageControlProps = {
    numberOfPages: number,
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

const PDFPageControl = ({numberOfPages, currentPage, setCurrentPage} : PDFPageControlProps) => {

    const CustomInputValidator = z.object({
        page: z.string().refine((num) => Number(num) >= 1 && Number(num) <= numberOfPages!)
      })
    
      type TCustomInputValidator = z.infer<typeof CustomInputValidator>
    
      const {
        register,
        setValue,
        handleSubmit,
        formState: {errors}
      } = useForm<TCustomInputValidator>({
        defaultValues:{
          page: "1"
        },
        resolver: zodResolver(CustomInputValidator)
      });
    
      const handlePageSubmit = ({
        page,
      }: TCustomInputValidator) => {
        setCurrentPage(Number(page))
        setValue('page', String(page))
      }

  return (
    <div className='flex items-center gap-1.5'>
              <Button variant="ghost" 
                aria-label='previous-button' 
                disabled={currentPage<=1} 
                onClick={() => {
                  setCurrentPage(prev => prev > 1 ? prev - 1 : prev)
                  setValue('page', String(currentPage - 1))
                  }}>
                <ChevronDown className='w-4 h-4' />
              </Button>
              <div className='flex items-center gap-1.5'>
                <Input {...register('page')} 
                  className={cn('w-12 h-8', errors.page && 'focus-visible:ring-red-500')} 
                  onKeyDown={(e) => {
                    if(e.key === "Enter") {
                      handleSubmit(handlePageSubmit)()
                    }
                }}/>
                <p className='text-zinc-700 text-sm space-x-1'>
                  <span>/</span>
                  <span>{numberOfPages ?? 'NA'}</span>
                </p>
              </div>
              <Button variant="ghost" 
                aria-label='next-button' 
                disabled={currentPage >= numberOfPages!} 
                onClick={() => {
                  setCurrentPage(prev => prev < numberOfPages! ? prev + 1 : numberOfPages!)
                  setValue('page', String(currentPage + 1))
                  }}>
                <ChevronUp className='w-4 h-4' />
              </Button>
            </div>
  )
}

export default PDFPageControl
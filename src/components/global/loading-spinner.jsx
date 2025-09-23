import React from 'react'
// internal libraries
import '../../styles/shared/_loading-spinner.css'
import { useLoading } from '../../context/loading-context'

/**
 * @returns the loading layer template
 */
export default React.memo(function LoadingSpinner() {
  const { isLoading } = useLoading()
  if (!isLoading) return null
  return (
    <div
      id='spinner'
      className='spinner__wrapper'
      aria-live='polite'
      role='alert'
      aria-label='Loading content'
    >
      <div className='spin--loader'></div>
    </div>
  )
})

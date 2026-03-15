'use client'

import { useEffect } from 'react'
import { captureUTM } from '@/utils/utm'

export default function UTMCapture() {
    useEffect(() => {
        captureUTM()
    }, [])

    return null
}
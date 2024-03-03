import React, { useEffect, useState } from 'react'
import analticsMetaViewModel from './analticsMetaViewModel'

function AnalyticsMetaTags() {
    const { analytics } = analticsMetaViewModel();
    useEffect(() => {
        if (analytics?.data) {
            analytics?.data.forEach(item => {
                const parser = new DOMParser().parseFromString(item?.value.trim(), 'application/xhtml+xml')
                document.head.append(parser.firstChild)
            });
        }
    }, [analytics?.data])



    return (
        null
    )
}

export default AnalyticsMetaTags
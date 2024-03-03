import React from 'react'

import {useGetAllAnalyticsMetaQuery} from '../../redux/apis/analyticsMeta'
function analticsMetaViewModel() {
        const {data:analytics}=useGetAllAnalyticsMetaQuery()
        
    return {
                analytics
            }
    
}

export default analticsMetaViewModel
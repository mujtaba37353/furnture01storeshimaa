import React ,{useEffect ,useState} from 'react'
import { useLazyGetMetaByRefrenceQuery } from '../../redux/apis/meta-front'
import {Helmet} from 'react-helmet-async'
function MetaTags({id}) {
  
  const [getMeta]=useLazyGetMetaByRefrenceQuery()
  const [metaData,setMetaData]=useState();
  useEffect(()=>{
    if(id){
      getMeta(id).then(res =>{
      
        setMetaData(res?.data?.data || null)
      })
    }
  },[id])
     
    
  
  return (
   
  
    metaData ?
      <Helmet>
        <title>{metaData?.title_meta}</title>
        <meta name='description' content={metaData?.desc_meta} />
      </Helmet>
    :null
  
   
  )
}

export default MetaTags
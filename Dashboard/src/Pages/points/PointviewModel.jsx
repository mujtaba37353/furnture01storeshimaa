import { useTranslation } from 'react-i18next'
import {
  useAcceptUserRequestMutation,
  useGetAllPointsQuery,
  useRejectUserRequestMutation
} from '../../api/points.api'
import { toast } from 'react-toastify'

function PointViewModel () {
  const [, { language: lang }] = useTranslation()
  const {
    data: points,
    isError: pointsError,
    isLoading: pointsLoading,
    isSuccess: poinstsSuccess
  } = useGetAllPointsQuery()
  const [acceptRequest] = useAcceptUserRequestMutation()
  const [rejectRequest] = useRejectUserRequestMutation()
  // FOR ALL THE STATIC DATA

  return {
    getAllThePoints: () => {
      return { points, pointsError, pointsLoading, poinstsSuccess }
    },

    handleAcceptRequest: id => {
      acceptRequest(id).then(({ data, error }) => {
        if (data && data?.message_en) {
          toast.success(
            lang === 'en' ? `The Request is Been Accepted With id: , ${data?.message_en}` : `تم قبول الطلب بنجاح مع الرقم ${data?.message_ar}`
          )
        } else {
          toast.error(lang? error.error_en: error.error_ar)
        }
      })
    },
    handleRejectRequest: id => {
      rejectRequest(id).then(({ data, error }) => {
        if (data && data?.message_en) {
          toast.success(
            lang === 'en'?
            `The Request is Been Accepted With id: , ${data?.message_en}` : `تم رفض الطلب بنجاح مع الرقم ${data?.message_ar}`
          )
        } else {
          toast.error(lang === "en"? error.error_en : error.error_ar)
        }
      })
    }
  }
}

export default PointViewModel

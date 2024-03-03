import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SearchStyles } from './utilesStyles'
import { useTranslation } from 'react-i18next'
import { Box, InputBase } from '@mui/material'
import { CiSearch } from 'react-icons/ci'

export const Search = ({ searchedTitle, onChange }) => {
  const [search, setSearch] = useState(searchedTitle)
  const { pathname } = useLocation()
  const {
    i18n: { language },
  } = useTranslation()
  useEffect(() => {
    const id = setTimeout(() => {
      const s = search.trim()
        ? `keyword[title_en]=${search}&keyword[title_ar]=${search}&keyword[description_en]=${search}&keyword[description_ar]=${search}`
        : ''
      onChange(s)
    }, 500)
    return () => {
      clearTimeout(id)
    }
  }, [search])
  useEffect(() => {
    setSearch(searchedTitle)
  }, [pathname])

  return (
    <Box sx={SearchStyles.BoxSearch}>
      <InputBase
        type={'text'}
        placeholder={language === 'en' ? 'Search' : 'بحث'}
        sx={SearchStyles.BoxInput}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <CiSearch size={24} />
    </Box>
  )
}

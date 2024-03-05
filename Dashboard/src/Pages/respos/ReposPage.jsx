import { Box, Button, Stack, Typography } from '@mui/material'
import ReposTable from '../../Components/repos/ReposTable'
import Breadcrumbs from '../../Components/Breadcrumbs'
import Search from '../../Components/repos/Search'
import { useTranslation } from 'react-i18next'
import { allowed } from '../../helper/roles'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import useSearch from '../../hooks/useSearch'
import RepoOperationsModal from '../../Components/repos/RepoOperationsModal'

const ReposPage = () => {
  const {
    i18n: { language }
  } = useTranslation()
  const { role } = useSelector(state => state.user)
  const { addArrayToSearch, removeArrayFromSearch } = useSearch()
  const [inputSearch, setInputSearch] = useState('')
  useEffect(() => {
    const id = setTimeout(() => {
      if (inputSearch) {
        addArrayToSearch([
          {
            key: 'keyword[name_en]',
            value: inputSearch
          },
          {
            key: 'keyword[name_ar]',
            value: inputSearch
          }
        ])
      } else {
        removeArrayFromSearch(['keyword[name_en]', 'keyword[name_ar]'])
      }
    }, 500)
    return () => clearTimeout(id)
  }, [inputSearch])
  const [repoModal, setRepoModal] = useState(false)
  return (
    <Box sx={{ minHeight: '100vh', m: { xs: 2, sm: 4, md: 3, lg: 8 } }}>
      <RepoOperationsModal open={repoModal} setOpen={setRepoModal} />
      <Breadcrumbs page_ar={'المستودعات'} page_en={'Repositories'} />
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent={'space-between'}
        gap={2}
        my={8}
      >
        <Search
          lang={language}
          setInputSearch={setInputSearch}
          inputSearch={inputSearch}
        />
        {allowed({ page: 'categories', role }) ? (
          <Button
            sx={{
              backgroundColor: '#00e3d2 !important',
              color: 'white',
              textTransform: 'capitalize',
              minWidth: '130px'
            }}
            onClick={() => setRepoModal(true)}
          >
            <Typography>
              {language === 'en' ? 'Add Repository' : 'اضافة مستودع'}
            </Typography>
          </Button>
        ) : (
          <></>
        )}
      </Stack>
      
      <ReposTable />
    </Box>
  )
}

export default ReposPage

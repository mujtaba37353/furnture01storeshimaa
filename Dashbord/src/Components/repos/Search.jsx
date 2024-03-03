import { Stack, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
const Search = ({ lang, setInputSearch, inputSearch }) => {
  return (
    <Stack
      direction={'row'}
      className='date-gradient'
      alignItems={'center'}
      sx={{
        borderRadius: '15px',
        height: '40px',
        width: { xs: '100%', md: 'auto' },
        px: 2
      }}
    >
      <SearchIcon sx={{ color: 'black' }} />
      <TextField
        sx={{
          width: 'auto',
          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent !important',
            outline: 'none !important',
            backgroundColor: 'transparent !important'
          },
          '& input::placeholder': {
            color: 'black'
          },
          color: 'black'
        }}
        placeholder={lang === 'en' ? 'Search' : 'ابحث هنا'}
        name='search'
        value={inputSearch}
        onChange={e => setInputSearch(e.target.value)}
      />
    </Stack>
  )
}

export default Search

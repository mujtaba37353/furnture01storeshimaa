export const MessagesoptionsTypes = [
    {
        title_en: "ALL",
        title_ar: "الكل",
        type: "ALL",
    },
    {
        title_en: "",
        title_ar: "",
        type: "select",
    }
];
 

//   notes
{/* <FormControl>
<FormLabel id="demo-controlled-radio-buttons-group">
  {
    language==="en"?"select users":"تحديد المستخدمين"
  }

</FormLabel>
<RadioGroup
   onBlur={handleBlur}
    helperText={touched.user && errors.user ? errors.user : ""}
   error={touched.user && errors.user}
   variant="outlined"
   name="user"
   value={values.user}
   onChange={handleChange}
   aria-labelledby="demo-controlled-radio-buttons-group"
>
  <FormControlLabel value={'all'} control={<Radio />}
   label={language==="en"?"every one":'الكل'} />
  
  <Grid container>

  <FormControlLabel item  value="select" control={<Radio />} 
  label={language==="en"?"select users ":'تحديد المستخدمين'}  />

{/* 
users selectors */}
{/* <FormControl item >

<InputLabel variant="standard" htmlFor="uncontrolled-native">
  Age */}
{/* </InputLabel>
<NativeSelect
  defaultValue={30}
  inputProps={{
    name: 'age',
    id: 'uncontrolled-native',
  }}
>
  <option value={10}>Ten</option>
  <option value={20}>Twenty</option>
  <option value={30}>Thirty</option>
</NativeSelect>
</FormControl>


  </Grid>
</RadioGroup>
</FormControl> */}  
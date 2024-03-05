import { Box, ButtonBase, CircularProgress, FormControlLabel, Radio, RadioGroup, Typography, useTheme } from '@mui/material'
import { useFormik } from 'formik';
import React from 'react'
import { useTranslation } from 'react-i18next';
import * as yup from "yup";
import {useAddMetaAnalyticsMutation, useGetMetaAnalyticsQuery, useLazyGetMetaAnalyticsQuery } from '../../api/toolsApi';
import { toast } from 'react-toastify';

const ToolsAdding = ({ handleClose }) => {
    const [_, { language: lang }] = useTranslation()
    const { customColors,colors } = useTheme();
    const [value, setValue] = React.useState('female');
    const [addMetaAnalytics,{isLoading}] = useAddMetaAnalyticsMutation()
    const { refetch } = useGetMetaAnalyticsQuery();
    
    const handleChange = (event) => {
        setValue(event.target.value);
        formik.setFieldValue("key", event.target.value)
    };

    const formik = useFormik({
        initialValues: {
            key: "",
            value: ""
        },
        validationSchema: yup.object({
            value: yup.string().required(lang === "en" ? "Data is required" : " البيانات مطلوبه"),
            key: yup.string().required(lang === "en" ? "you must select on of options" : "يجب عليك اختيار واحد من الاختيارات")
        }),
        onSubmit: (values) => {
          
            addMetaAnalytics(values).unwrap().then((res) => {
                toast.success(res[`success_${lang}`])
                refetch()
                handleClose()
            }).catch((err) => {
                toast.error(err[`error_${lang}`])

            })

        }
    })



    return (
        <Box sx={{ p: 2}}>
            {/* select radio */}
            <form onSubmit={formik.handleSubmit}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    mb: 1
                }}>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={value}
                        onChange={handleChange}
                        sx={{
                            ".css-j204z7-MuiFormControlLabel-root": {
                                marginRight: "-11px !important"
                            }
                        }}
                    >
                        <FormControlLabel value="google" control={<Radio />} label={lang === "en" ? "Google Analytics link" : "رابط جوجل اناليتكس"} />
                        <FormControlLabel value="tag" control={<Radio />} label={lang === "en" ? "Tag Manager link" : "رابط تاج مانجر"} />
                        <FormControlLabel value="facebook" control={<Radio />} label={lang === "en" ? "Facebook pexel link" : "رابط فيسبوك بيكسل"} />
                        <FormControlLabel value="snap" control={<Radio />} label={lang === "en" ? "Snap pexel link" : "رابط سناب بيكسل"} />
                        <FormControlLabel value="tiktok" control={<Radio />} label={lang === "en" ? "TikTok pexel link" : "رابط تيكتوك بيكسل"} />
                    </RadioGroup>
                </Box>

                {formik.errors.key && formik.touched.key && (

                    <Typography sx={{
                        color: colors.dangerous,
                        my: "5px"
                    }}>
                        {formik.errors.key}
                    </Typography>

                )}

                <Box
                    component={"textarea"}
                    name='value'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    sx={{
                        height: { xs: "200px", md: "300px" },
                        width: "100%",
                        border: `1px solid ${customColors.text}`,
                        fontSize: "18px",
                        p: 2,
                        borderRadius: "10px",
                        bgcolor:customColors.container,
                        color:customColors.text,
                        outline:"none",
                       
                    }} />

                {formik.errors.value && formik.touched.value && (

                    <Typography sx={{
                        color: colors.dangerous,
                    }}>
                        {formik.errors.value}
                    </Typography>

                )}


                <Box sx={{
                    mt: 2,
                    textAlign: "center"
                }}>
                    <ButtonBase
                        type='submit'
                        disabled={isLoading}
                        sx={{
                            bgcolor: customColors.main,
                            color: "#fff",
                            width: "fit-content",
                            alignSelf: "flex-end",
                            p: "0.5rem 2rem",

                            fontSize: "1rem",
                            fontWeight: "bold",
                            "&:hover": { bgcolor: customColors.main },
                            borderRadius: "10px"
                        }}>
                            {isLoading?(
                                    <Box sx={{ display: 'flex' }}>
                                    <CircularProgress
                                      sx={{
                                        color: 'white',
                                      }}
                                    />
                                  </Box>
                            ):(
                                lang === "en" ? "Save" : "حفظ"
                            )}
                        
                    </ButtonBase>
                </Box>




            </form>


        </Box>
    )
}

export default ToolsAdding
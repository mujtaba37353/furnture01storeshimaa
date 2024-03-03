import { Button, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Arrow from '../noon1/icons8-arrow-down-24.png'
export default function Qualites(prop) {
  const [price, setPrice] = useState(0)
  const [pushIndex, setPushIndex] = useState(-1)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [productImages, setproductImages] = useState({
    image: '',
    images: [],
  })
  const checkQuantity = (item) => {
    return (
      (item?.child === undefined || item?.child?.length === 0) &&
      item?.quantity === 0
    )
  }

  const compareValues = (item1, item2) => {
    if (selectedIndex != -1)
      return item2?.some(
        (item) =>
          item1?.key_ar === item?.key_ar &&
          item1?.key_en === item?.key_en &&
          item1?.value_ar === item?.value_ar &&
          item1?.value_en === item?.value_en
      )
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        console.log(
          `Latitude: ${latitude}, Longitude: ${longitude}`,
          'sdasadsadsad'
        )
      })
    } else {
      console.log('Geolocation is not supported by this browser.')
    }
    if (prop.defaultImage) {
      prop?.setImages(prop.defaultImages)
    }
  }, [prop?.defaultImages])

  useEffect(() => {
    if (!compareValues(prop?.item[selectedIndex], prop.selectedItems)) {
      setPushIndex(-1)
      setSelectedIndex(-1)
    }
    if (pushIndex === -1 && selectedIndex === -1) {
      if (prop?.selectedItems[0] === prop?.item[0]) {
        setPushIndex(0)
        setSelectedIndex(0)
        prop.setSelectedItems([
          {
            key_en: prop.selectedItems[0]?.key_en,
            key_ar: prop.selectedItems[0]?.key_ar,
            value_en: prop.selectedItems[0]?.value_en,
            value_ar: prop.selectedItems[0]?.value_ar,
          },
        ])
      }
    }
  }, [prop?.selectedItems])
  {
  }
  const ReturnedValues = (item) => {
    if (item?.child?.length) {
      const uniqueValues = new Set(
        item.child.map((item) =>
          prop.language ? item.value_ar : item.value_en
        )
      )
      const valuesArray = Array.from(uniqueValues)
      const value = valuesArray.join(' ')
      return value
    } else {
      return ''
    }
  }
  const HandleProperties = (item) => {
    const concatenatedValues = item?.properties
      ?.map((obj) => {
        return Object.values({ obj })
          .map((ob) => {
            return lng === 'en' ? obj.value_en : obj.value_ar
          })
          .join('/')
      })
      .join('/')

    return concatenatedValues
  }

  return (
    <div>
      <Stack
        cla
        ssName="headerText"
        sx={{
          margin: '10px 12px',
        }}
      >
        {prop?.language ? prop?.item[0]?.key_ar : prop?.item[0]?.key_en}
      </Stack>
      <Stack
        className="container"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: {
            justifyContent: prop?.language ? 'flex-end' : 'flex-end',
          },
          flexWrap: 'wrap',
        }}
      >
        {prop?.item.map((item, index) => (
          <Stack
            key={index}
            sx={{
              display: 'flex',
              justifyContent: prop?.language ? 'flex-end' : 'flex-end',
              flexWrap: 'wrap',
            }}
          >
            <Button
              sx={{
                margin: '3px 5px',
                fontSize: '12px',
                width: 'fit-content !important',
                height: '30px',
              }}
              disabled={checkQuantity(prop?.item[index])}
              onClick={() => {
                setSelectedIndex(index)
                if (item?.child === undefined || item?.child?.length === 0) {
                  prop.setCheck(true)
                  prop.setQuantity(item.quantity)
                } else {
                  prop.setCheck(false)
                  prop.setQuantity(0)
                }
                if (pushIndex === -1) {
                  setPushIndex(prop?.selectedItems?.length)
                  prop.setSelectedItems([
                    ...prop.selectedItems,
                    {
                      key_en: item?.key_en,
                      key_ar: item?.key_ar,
                      value_en: item?.value_en,
                      value_ar: item?.value_ar,
                    },
                  ])
                } else {
                  if (pushIndex < prop?.selectedItems?.length - 1) {
                    prop.selectedItems.splice(
                      pushIndex,
                      prop?.selectedItems?.length - pushIndex - 1
                    )
                  }
                  prop.selectedItems.splice(pushIndex, 1, {
                    key_en: item?.key_en,
                    key_ar: item?.key_ar,
                    value_en: item?.value_en,
                    value_ar: item?.value_ar,
                  })
                }
                if (item?.child === undefined || item?.child.length === 0) {
                  prop.setPrice(item.price)
                  if (item?.image !== undefined && item?.image?.length !== 0) {
                    prop.setImages(item?.image)
                    prop.setImage(item?.image[0])
                    console.log(item?.image, ' ggf  ')
                  } else {
                    console.log(item?.image, 'imagessssss')
                    prop.setImages(prop?.defaultImages)
                    prop.setImage(prop?.defaultImage)
                  }
                } else {
                  prop.setPrice(0)

                  if (prop.defaultImages && prop.defaultImages?.length) {
                    prop.setImages(prop.defaultImages)
                    prop.setImage(prop.defaultImage)
                  }
                }
              }}
              className="button"
              style={{
                backgroundColor: checkQuantity(prop?.item[index])
                  ? 'grey'
                  : selectedIndex === index
                  ? item?.color || '#727272'
                  : '#fff',
                border: '1px solid #ddd',
                color: selectedIndex === index ? '#fff' : '#333',
                // elevation: item?.color === '#ffffff' ? 3 : 0,
              }}
            >
              {prop.language ? `${item.value_ar} ` : item.value_en}

              {item?.child !== undefined && item?.child?.length ? (
                <>
                  {console.log(item, 'asdsad')}

                  <img src={Arrow} />
                </>
              ) : (
                <></>
              )}
            </Button>
          </Stack>
        ))}
      </Stack>
      {selectedIndex === -1 ||
      prop?.item[selectedIndex]?.child === undefined ||
      prop?.item[selectedIndex]?.child?.length === 0 ? null : (
        <div>
          <Qualites
            item={prop?.item[selectedIndex].child}
            defaultImage={prop.defaultImage}
            setImage={prop.setImage}
            check={prop.check}
            setCheck={prop.setCheck}
            setQuantity={prop.setQuantity}
            defaultImages={prop.defaultImages}
            setImages={prop.setImages}
            images={prop.images}
            setPrice={prop.setPrice}
            selectedItems={prop.selectedItems}
            setSelectedItems={prop.setSelectedItems}
            language={prop.language}
          />
        </div>
      )}
    </div>
  )
}

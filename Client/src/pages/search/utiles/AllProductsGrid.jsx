import { Grid } from "@mui/material";
import { AllProductsGridStyles } from "../Styles";

export function AllProductsGrid({ cards }) {
  return (
    <Grid
      container
      spacing={{
        xs: 2,
        sm: 2,
        md: 4,
        lg: 2,
        xl:3,
      }}
      pt={1}
      width={{ xs: '97%', sm: '100%',lg:"90%" }}

    >
      {cards?.map((card, index) => (
        <Grid
          item
          xs={6}
          sm={6}
          
          md={4}
          xl={4}
          key={index}
          sx={AllProductsGridStyles.CardItem}
        >
          {card}
        </Grid>
      ))}
    </Grid>
  )
}
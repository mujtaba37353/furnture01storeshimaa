export const MenuStyles = ({ lng, colors }) => ({
  Menu: {
    maxHeight: 500,
    direction: " ltr ",
    ".MuiMenu-paper": {
      width: 360,
      bgcolor: colors.bg,
      boxShadow: "0 0 10px 0 rgb(0 0 0 / 20%)",
    },
    ".MuiMenu-paper::-webkit-scrollbar": {
      width: "12px",
    },
    ".MuiMenu-paper::-webkit-scrollbar-track": {
      background: "#eef2f3",
    },
    ".MuiMenu-paper::-webkit-scrollbar-thumb": {
      background: colors.bg,
      borderRadius: 4,
    },
  },
  menuTitle: {
    textAlign: lng === "ar" ? "right" : "left",
    fontWeight: "bold",
    fontSize: "20px",
    p: 1,
  },
  Tabs: {
    mb: 3,
    px: 1,
    "& .MuiTabs-indicator": {
      bgcolor: "transparent",
    },
    "& .MuiTabs-flexContainer": {
      // flexDirection: lng === 'en' ? 'row' : 'row-reverse',
      justifyContent: lng === "en" ? "flex-start" : "flex-end",
    },
  },
  tab: {
    "&.Mui-selected": {
      bgcolor: "#EBF5FF",
    },
    borderRadius: 3,
    fontSize: "12px",
  },
});

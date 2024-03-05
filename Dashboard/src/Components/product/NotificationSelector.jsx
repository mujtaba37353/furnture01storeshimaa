import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import { Stack, Typography } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selectedUsers, theme) {
  return {
    fontWeight:
      selectedUsers.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
export default function NotificationSelector({
  items,
  selectedUsers,
  setSelectedUsers,
}) {
  const theme = useTheme();
  const [_, { language: lang }] = useTranslation();
  const { colors } = useTheme();
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedUsers(value);
  };
  return (
    <div>
      <Typography fontWeight={"bold"}>
        {lang === "en" ? "Reciever" : "المستلم"}
      </Typography>
      <Stack direction={"row"} justifyContent={"space-between"} mt={1}>
        <FormControl sx={{ width: 1 }}>
          <Select
            multiple
            displayEmpty
            value={selectedUsers}
            name="receiver"
            onChange={(e) => {
              handleChange(e);
            }}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>{lang === "en" ? "ما" : ""}</em>;
              }

              return selected.join(", ");
            }}
            MenuProps={MenuProps}
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem disabled value="">
              {!items[0]
                ? lang === "en"
                  ? "No accounts have been made for this role"
                  : "لم يتم إجراء أي حسابات لهذا الدور"
                : lang === "en"
                ? "Select a reciever"
                : "اختار مستلم"}
            </MenuItem>
            {items[1] && (
              <MenuItem
                value={lang === "en" ? "all" : "الجميع"}
                style={getStyles("all", selectedUsers, theme)}
              >
                {lang === "en" ? "All" : "الجميع"}
              </MenuItem>
            )}
            {items.map((item) => (
              <MenuItem
                key={item._id}
                value={
                  item[item.name ? "name" : item?.email ? "email" : "phone"]
                }
                style={getStyles(item._id, selectedUsers, theme)}
              >
                {item[item.name ? "name" : item.email ? "email" : "phone"]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </div>
  );
}

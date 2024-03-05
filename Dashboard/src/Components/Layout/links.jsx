import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import ConstructionIcon from "@mui/icons-material/Construction";
import ForumIcon from "@mui/icons-material/Forum";
import DraftsIcon from "@mui/icons-material/Drafts";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CampaignIcon from "@mui/icons-material/Campaign";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import blogsIcon from "../../assets/blog.svg";
import StoreIcon from "@mui/icons-material/Store";
import { CardMedia } from "@mui/material";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
export const links = [
  {
    en: "Home",
    ar: "الرئيسية",
    path: "/",
    icon: <HomeOutlinedIcon />,
  },
  {
    en: "Sales",
    ar: "المبيعات",
    icon: <EqualizerOutlinedIcon />,
    nested: [
      {
        en: "Users",
        ar: "المستخدمين",
        path: "/users",
        icon: <PeopleOutlinedIcon />,
      },
      // islam putting this lines don't delete it
      // {
      //   en: "Subscribers",
      //   ar: "المشتركين",
      //   path: "/subscribers",
      //   icon: <PeopleOutlinedIcon />,
      // },
      {
        en: "Orders",
        ar: "عمليات الشراء",
        path: "/orders",
        icon: <ShoppingCartOutlinedIcon />,
      },
      {
        en: "Shipping",
        ar: "الشحن",
        path: "/shipping",
        icon: <LocalShippingOutlinedIcon />,
      },
      {
        en: "offers",
        ar: "العروض",
        path: "/offers",
        icon: <LocalOfferIcon />,
      },
      {
        en: "coupons",
        ar: "الكوبونات",
        path: "/coupons",
        icon: <PriceChangeOutlinedIcon />,
      },
      {
        en: "abandoned Carts",
        ar: "السلات المتروكه",
        path: "/abandonedCarts",
        icon: <ProductionQuantityLimitsIcon />,
      },
    ],
  },
  {
    en: "Marketing",
    ar: "التسويق",
    icon: <CampaignIcon />,
    nested: [
      {
        en: "Tools",
        ar: "الأدوات",
        path: "/tools",
        icon: <ConstructionIcon />,
      },
      {
        en: "Marketers",
        ar: "المسوقين",
        path: "/marketers",
        icon: <PeopleOutlinedIcon />,
      },
      {
        en: "Points",
        ar: "النقاط",
        path: "/points",
        icon: <AutoAwesomeIcon />,
      },
      {
        en: "Points Mangement",
        ar: "اداره النقاط",
        path: "/pointsMangement",
        icon: <AutoGraphIcon />,
      },
      {
        en: "Mail Messages",
        ar: "النشره البريديه",
        path: "/EmailMessage",
        icon: <DraftsIcon />,
      },
      {
        en: "SMS Messages",
        ar: "الرسائل النصيه",
        path: "/SmsMessage",
        icon: <ForumIcon />,
      },
    ],
  },
  {
    en: "Blogs",
    ar: "المدونات",
    path: "/blogs",
    icon: (
      <CardMedia
        sx={{
          height: 15,
          width: 15,
        }}
        component={"img"}
        src={blogsIcon}
      />
    ),
  },
  {
    en: "Site settings",
    ar: "إعدادات الموقع",
    icon: <SettingsSuggestOutlinedIcon />,
    nested: [
      {
        en: "Site content",
        ar: "محتوى الموقع",
        path: "/siteContent",
        icon: <ArticleOutlinedIcon />,
      },
      {
        en: "Categories",
        ar: "الأقسام",
        path: "/categories",
        icon: <CategoryOutlinedIcon />,
      },
      {
        en: "Products",
        ar: "المنتجات",
        path: "/products",
        icon: <Inventory2OutlinedIcon />,
      },
      {
        en: "Attributes",
        ar: "عوامل التصفية",
        path: "/attributes",
        icon: <EditAttributesIcon />,
      },
      {
        en: "Meta Tags",
        ar: "العلامات الوصفية",
        path: "/meta-tags",
        icon: <SubtitlesIcon />,
      },
      {
        en: "Qualities",
        ar: "المعاير",
        path: "/qualities",
        icon: <StoreIcon />,
      },
      {
        en: "Repositories",
        ar: "المستودعات",
        path: "/repositories",
        icon: <StoreIcon />,
      },
    ],
  },
  {
    en: "Support",
    ar: "الدعم",
    icon: <ThumbUpIcon />,
    nested: [
      {
        en: "Technical support",
        ar: "دعم فني",
        path: "/technicalSupport",
        icon: <SupportAgentOutlinedIcon />,
      },
      {
        en: "Contact requests",
        ar: "طلبات التواصل",
        path: "/contactRequests",
        icon: <PhoneOutlinedIcon />,
      },
    ],
  },
  {
    en: "Admins",
    ar: "المدراء",
    path: "/admins",
    icon: <AdminPanelSettingsOutlinedIcon />,
  },
  {
    en: "Accounting",
    ar: "المحاسبة",
    path: "/accounting",
    icon: <RequestQuoteIcon />,
  },
];

import { useParams } from "react-router-dom";
import { SITE_CONTENTS } from "../../Components/SiteContent/SiteContents";
import PoliciesOperations from "../../Components/SiteContent/operations/PoliciesOperations";
import ContentOperation from "../../Components/SiteContent/operations/ContentOperation";
// slider -  -  -  -  -  - banner
function SiteContentPageOperations() {
  const { type } = useParams();

  if (!SITE_CONTENTS.find((content) => content.type === type)) {
    return <div>404</div>;
  }

  if (
    type === "aboutus" ||
    type === "usage" ||
    type === "privacy" ||
    type === "public" ||
    type === "retrieval"
  ) {
    return <PoliciesOperations />;
  }

  if (type === "slider" || type === "banner") {
    return <ContentOperation />;
  }

  return <div>404</div>;
}

export default SiteContentPageOperations;

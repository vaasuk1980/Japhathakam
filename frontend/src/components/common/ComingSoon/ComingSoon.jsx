import { Link } from "react-router-dom";
import { Hourglass } from "lucide-react";

import { useTranslation } from "../../../i18n/I18nContext";

import "./ComingSoon.css";

// Placeholder for sections that are routed (so links never 404) but
// not built yet. `titleKey` is the page's translation key.
function ComingSoon({ titleKey }) {
  const { t } = useTranslation();

  return (
    <main className="page coming-soon">
      <div className="coming-soon__icon" aria-hidden="true">
        <Hourglass size={32} />
      </div>

      <h1 className="coming-soon__title">{t(titleKey)}</h1>
      <p className="coming-soon__message">{t("comingSoon.message")}</p>

      <Link to="/" className="coming-soon__link">
        {t("comingSoon.backToDashboard")}
      </Link>
    </main>
  );
}

export default ComingSoon;

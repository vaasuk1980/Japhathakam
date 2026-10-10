import { useEffect, useState } from "react";

import { useTranslation } from "../../i18n/I18nContext";

// Section anchors inside the report, in the on-screen reading order.
// Located by their existing root classes (no DOM changes — the
// printed/PDF structure is untouched).
const SECTIONS = [
    { id: "kundali", selector: ".kundali-workspace-section", labelKey: "kundali.reportNav.kundali" },
    { id: "grahas", selector: ".pp-table-section", labelKey: "kundali.reportNav.grahas" },
    { id: "dasha", selector: ".dasha-panel", labelKey: "kundali.reportNav.dasha" },
    { id: "panchangam", selector: ".pd-table-section", labelKey: "kundali.reportNav.panchangam" },
];

/**
 * Sticky "jump to section" bar with scroll-spy. Screen only.
 */
function ReportJumpBar({ reportRef, barRef }) {

    const { t } = useTranslation();
    const [activeId, setActiveId] = useState(SECTIONS[0].id);

    useEffect(() => {

        const reportEl = reportRef.current;

        if (!reportEl) {
            return undefined;
        }

        const scroller = reportEl.closest(".page-content") ?? window;
        let frame = null;

        function update() {

            frame = null;

            // The line a section's top must have passed to count as
            // "current": just below the pinned masthead + this bar.
            const pinned = parseFloat(reportEl.style.getPropertyValue("--masthead-height")) || 0;
            const scrollerTop = scroller === window ? 0 : scroller.getBoundingClientRect().top;
            const line = scrollerTop + pinned + 24;

            let current = SECTIONS[0].id;

            for (const section of SECTIONS) {
                const el = reportEl.querySelector(section.selector);

                if (el && el.getBoundingClientRect().top <= line) {
                    current = section.id;
                }
            }

            setActiveId(current);

        }

        function onScroll() {
            if (frame === null) {
                frame = requestAnimationFrame(update);
            }
        }

        scroller.addEventListener("scroll", onScroll, { passive: true });
        update();

        return () => {
            scroller.removeEventListener("scroll", onScroll);

            if (frame !== null) {
                cancelAnimationFrame(frame);
            }
        };

    }, [reportRef]);

    const jump = (section) => {

        const el = reportRef.current?.querySelector(section.selector);

        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }

    };

    return (
        <nav className="report-jumpbar no-print" ref={barRef} aria-label={t("kundali.reportNav.label")}>
            {SECTIONS.map((section) => (
                <button
                    key={section.id}
                    type="button"
                    className={"report-jumpbar__item" + (activeId === section.id ? " is-active" : "")}
                    aria-current={activeId === section.id ? "true" : undefined}
                    onClick={() => jump(section)}
                >
                    {t(section.labelKey)}
                </button>
            ))}
        </nav>
    );

}

export default ReportJumpBar;

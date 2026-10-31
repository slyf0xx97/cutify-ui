// cutify-ui: numbered stage header with a pill, a title, an emoji-led line and an optional aside. MIT.
// Styles: .stage-plate, .stage-top, .stage-tab, .stage-title, .stage-line in assets/glass.css.
import type { ReactNode } from "react";

type Props = {
  n?: number;                 // shows "Stage n" unless tab is given
  tab?: string;
  title: string;              // short imperative: "Add your résumé"
  line?: string;              // one plain sentence
  icon?: string;              // emoji or glyph for the line
  titleId?: string;
  heading?: "h2" | "h3";
  aside?: ReactNode;          // e.g. a toggle or a status pill
};

export function StageHeader({ n, tab, title, line, icon, titleId, heading = "h2", aside }: Props) {
  const Title = heading;
  const pill = tab ?? (n !== undefined ? `Stage ${n}` : undefined);
  return (
    <div className="stage-header">
      <div className="stage-plate">
        <div className="stage-top">
          {pill && <span className="stage-tab">{pill}</span>}
          <Title id={titleId} className="stage-title">{title}</Title>
          {aside && <div className="stage-aside">{aside}</div>}
        </div>
        {line && (
          <p className="stage-line">
            {icon && <span aria-hidden="true">{icon} </span>}
            <span>{line}</span>
          </p>
        )}
      </div>
    </div>
  );
}

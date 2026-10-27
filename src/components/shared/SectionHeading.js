export default function SectionHeading({ eyebrow, title, text, align = 'center', action }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {text && <p className="section-heading__text">{text}</p>}
      </div>
      {action && <div className="section-heading__action">{action}</div>}
    </div>
  );
}

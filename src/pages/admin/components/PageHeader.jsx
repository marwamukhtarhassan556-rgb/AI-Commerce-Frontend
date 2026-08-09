function PageHeader({ title, description, actions }) {
  return (
    <div className="flex justify-between items-end flex-wrap gap-4">
      <div>
        <h1 className="font-outfit text-[32px] font-semibold text-[#0b1c30] leading-tight">{title}</h1>
        {description && <p className="text-on-surface-variant mt-1">{description}</p>}
      </div>
      {actions && <div className="flex gap-3 flex-wrap">{actions}</div>}
    </div>
  );
}

export default PageHeader;

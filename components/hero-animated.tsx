interface HeroAnimatedProps {
  header: string;
  headerClassName?: string;
  description: string;
  descriptionClassName?: string;
  children?: React.ReactNode;
}

const HeroAnimated = ({
  header,
  headerClassName,
  description,
  descriptionClassName,
  children,
}: HeroAnimatedProps) => {
  return (
    <div>
      <h1 className={headerClassName}>{header}</h1>
      <p className={descriptionClassName}>{description}</p>
      {children}
    </div>
  );
};

export default HeroAnimated; 
import { useTranslations } from "next-intl";

type TypingIndicatorProps = {
  typingNames: string[];
};

const getTypingText = (typingNames: string[], t: ReturnType<typeof useTranslations>) => {
  if (typingNames.length === 0) return null;
  if (typingNames.length === 1) {
    return t("typing.one", { name: typingNames[0] });
  }

  if (typingNames.length === 2) {
    return t("typing.two", { firstName: typingNames[0], secondName: typingNames[1] });
  }

  return t("typing.many", { count: typingNames.length });
};

export const TypingIndicator = ({ typingNames }: TypingIndicatorProps) => {
  const t = useTranslations("channel");
  const typingText = getTypingText(typingNames, t);

  if (!typingText) return null;

  return (
    <div className="min-h-5">
      <p className="text-xs text-zinc-400">
        {typingText}
      </p>
    </div>
  );
};
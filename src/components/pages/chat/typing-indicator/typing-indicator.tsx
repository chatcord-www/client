import { useTranslations } from "next-intl";

type TypingIndicatorProps = {
  typingNames: string[];
};

export const TypingIndicator = ({ typingNames }: TypingIndicatorProps) => {
  const t = useTranslations("channel");

  let typingText: string | null = null;

  if (typingNames.length === 1) {
    typingText = t("typing.one", { name: typingNames[0] });
  } else if (typingNames.length === 2) {
    typingText = t("typing.two", {
      firstName: typingNames[0],
      secondName: typingNames[1],
    });
  } else if (typingNames.length > 2) {
    typingText = t("typing.many", { count: typingNames.length });
  }

  if (!typingText) return null;

  return (
    <div className="min-h-5">
      <p className="text-xs text-zinc-400">
        {typingText}
      </p>
    </div>
  );
};
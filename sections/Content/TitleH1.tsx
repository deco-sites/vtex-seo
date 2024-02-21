export interface Props {
  /**
   * @title H1
   */
  title?: string;
  /**
   * @title H1 Ativo?
   */
  activeTitle: boolean;
  /**
   * @title Localização
   */
  placement?: "Left" | "Center";
  /**
   * @title Tamanho da Fonte
   */
  fontSize?: FontSize;
  /**
   * @title Font Weight
   */
  highlight?: boolean;
  /**
   * @title Font Color
   * @format color
   */
  fontColor?: string;
}

export type FontSize =
  | "12px"
  | "14px"
  | "16px"
  | "18px"
  | "20px"
  | "24px"
  | "36px"
  | "48px"
  | "60px";

const sizeMapping: { [key in FontSize]: string } = {
  "12px": "xs",
  "14px": "sm",
  "16px": "base",
  "18px": "lg",
  "20px": "xl",
  "24px": "2xl",
  "36px": "4xl",
  "48px": "5xl",
  "60px": "6xl",
};

export default function TitleComp({
  title,
  activeTitle,
  placement = "Center",
  fontSize,
  highlight,
  fontColor,
}: Props) {
  let align;

  switch (placement) {
    case "Left":
      align = "start";
      break;
    case "Center":
      align = "center";
      break;
    default:
      break;
  }

  const fs = sizeMapping[fontSize || "16px"]; // Se fontSize for indefinido, use "16px" como padrão

  return (
    <div>
      <div
        className={`mx-auto flex flex-col items-${align} gap-8 sm:py-10 px-6`}
      >
        {activeTitle && (
          <h1
            style={`color:${fontColor}`}
            className={`inline-block text-${fs} ${
              highlight ? "font-black" : "font-medium"
            } leading-100% tracking--2.4px`}
          >
            {title}
          </h1>
        )}
      </div>
    </div>
  );
}

import { h } from "preact";
import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import { useId } from "$store/sdk/useId.ts";
import Icon from "$store/components/ui/Icon.tsx";
import type { ImageWidget } from "apps/admin/widgets.ts";

/**
 * @title Icon
 */
interface IconItem {
  /**
   * @title Icon title
   */
  text: string;
  image: ImageWidget;
  altText: string;
  url: string;
}

export interface Props {
  /**
   * @title Icones navegacionais
   */
  icons?: IconItem[];
  /**
   * @title Titulo da sessao
   */
  sectionTitle?: {
    showTitleSection?: boolean;
    /**
     * @title Tag do Titulo
     */
    titleSection?: "h1" | "h2" | "h3" | "h4" | "h5";
    /**
     * @title Titulo da sessao
     */
    titleContent?: string;
    fontSize?: "20px" | "24px" | "36px" | "48px" | "60px";
  };
  width: number;
  height: number;
  /**
   * @title Icon Text font color
   * @format color
   */
  fontColor?: string;
  /**
   * @title Image border radius
   */
  borderImg?: "roundedNone" | "rounded" | "md" | "lg" | "full";
  layout?: {
    numberOfSliders?: {
      mobile?: 1 | 2 | 3 | 4 | 5;
      desktop?: 1 | 2 | 3 | 4 | 5;
    };
    showArrows?: boolean;
    /**
     * @title Animação do dot
     * @description time (in seconds) to start the carousel autoplay
     */
    interval?: number;
    showDots?: boolean;
  };
}

export default function IconsNav(
  {
    icons,
    sectionTitle,
    width,
    height,
    fontColor,
    borderImg = "roundedNone",
    layout,
  }: Props,
) {
  const id = useId();
  const aspectRatio = `${width} / ${height}`;

  const fontSize = sectionTitle?.fontSize ?? "36px";
  const fontSizeMap = {
    "20px": "xl",
    "24px": "2xl",
    "36px": "4xl",
    "48px": "5xl",
    "60px": "6xl",
  };

  const tagTitle: Record<"h1" | "h2" | "h3" | "h4" | "h5", string> = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
  };

  const TitleSection = (
    { level, children }: {
      level: keyof typeof tagTitle;
      children: h.JSX.Element;
    },
  ) => {
    const Tag = tagTitle[level] as keyof h.JSX.IntrinsicElements;
    return <Tag class={`text-${fontSizeMap[fontSize]}`}>{children}</Tag>;
  };

  const slideDesktop = {
    1: "md:w-full",
    2: "md:w-1/2",
    3: "md:w-1/3",
    4: "md:w-1/4",
    5: "md:w-1/5",
  };

  const slideMobile = {
    1: "w-full",
    2: "w-1/2",
    3: "w-1/3",
    4: "w-1/4",
    5: "w-1/5",
  };

  const borderRadius = {
    roundedNone: "rounded-none",
    rounded: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  return (
    <div class="icons-nav w-full h-[300px] flex flex-col justify-center items-center my-10">
      {sectionTitle?.showTitleSection &&
        (
          <div
            class={`text-center my-7`}
          >
            <TitleSection level={sectionTitle?.titleSection || "h3"}>
              <>{sectionTitle?.titleContent ?? ""}</>
            </TitleSection>
          </div>
        )}
      <div
        id={id}
        class="slider-content relative w-full max-sm:px-3 md:px-10 lg:px-20 flex items-center justify-center flex-col"
      >
        <Slider class="carousel max-sm:gap-2 md:gap-2 w-full">
          {icons?.map((icon, index) => {
            return (
              <Slider.Item
                index={index}
                class={`carousel-item flex justify-center ${
                  slideDesktop[layout?.numberOfSliders?.desktop ?? 3]
                } ${slideMobile[layout?.numberOfSliders?.mobile ?? 1]}`}
              >
                <div class="icon-nav flex justify-center text-center">
                  <a class={`w-[${width}px]`} href={icon.url!}>
                    <img
                      class={`${borderRadius[borderImg]} object-cover`}
                      style={{ aspectRatio }}
                      src={icon.image}
                      alt={icon.altText}
                      width={width}
                      height={height}
                    />
                    <p
                      class={`my-2 px-2 max-w-[${width}px] text-sm`}
                      style={`color:${fontColor}`}
                    >
                      {icon.text}
                    </p>
                  </a>
                </div>
              </Slider.Item>
            );
          })}
        </Slider>
        {layout?.showArrows && (
          <>
            <Slider.PrevButton
              class="absolute lg:left-10 max-lg:left-2  top-1/4 btn btn-circle"
              disabled
            >
              <Icon size={24} id="ChevronLeft" strokeWidth={3} />
            </Slider.PrevButton>

            <Slider.NextButton
              class="absolute lg:right-10 max-lg:right-2 top-1/4 btn btn-circle"
              disabled
            >
              <Icon size={24} id="ChevronRight" strokeWidth={3} />
            </Slider.NextButton>
          </>
        )}
        {layout?.showDots && (
          <>
            <style
              dangerouslySetInnerHTML={{
                __html: `
                @property --dot-progress {
                  syntax: '<percentage>';
                  inherits: false;
                  initial-value: 0%;
                }
                `,
              }}
            />
            <ul class="carousel carousel-center flex flex-row justify-center gap-1 px-2 sm:px-0 ">
              {icons?.map((_, index) => (
                <li class="carousel-item w-[20px]">
                  <Slider.Dot index={index}>
                    <div class="my-8">
                      <div
                        class="w-2.5 h-0.5 roundedbg group-disabled:animate-progress bg-gradient-to-r from-gray-800 from-[length:var(--dot-progress)] to-[rgba(26,26,26,0.4)] to-[length:var(--dot-progress)]"
                        style={{ animationDuration: `${layout?.interval}s` }}
                      />
                    </div>
                  </Slider.Dot>
                </li>
              ))}
            </ul>
          </>
        )}
        <SliderJS rootId={id} />
      </div>
    </div>
  );
}

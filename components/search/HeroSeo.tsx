export interface Props {
  title?: string;
  categoryName?: string;
  activeTitle?: boolean;
  placement?: "Left" | "Center";
  /**
   * @format html
   */
  description?: string;
  activeReadMore?: boolean;
}

export default function HeroSeo({
  categoryName,
  title,
  activeTitle,
  placement = "Center",
  description,
  activeReadMore,
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

  return (
    <div>
      <div
        className={`mx-auto flex flex-col items-${align} gap-2 container px-4 mt-5`}
      >
        {activeTitle && (title || categoryName) && (
          <h1 className="inline-block text-[20px] leading-100% px-4 font-medium tracking--2.4px">
            {title || categoryName}
          </h1>
        )}
        {description && (
          <div className="hero-text">
            {activeReadMore
              ? (
                <div class="flex gap-[30px] relative px-4 md:mx-auto mb-10">
                  <details className="peer absolute bottom-0 translate-y-full group ">
                    <summary className="text-sm text-neutral-1 font-lato py-2 px-6 border border-neutral-1 cursor-pointer list-none">
                      <span className="group-open:hidden">Ler mais</span>
                      <span className="hidden group-open:block">Ler menos</span>
                    </summary>
                  </details>
                  <div className="text-grey-500 h-[128px] peer-open:h-auto overflow-hidden pb-5 description">
                    <div>
                      <div
                        className="mt-2 flex flex-col gap-2"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    </div>
                  </div>
                  <div class="h-10 w-[calc(100%)] bg-gradient-to-b from-transparent to-white absolute bottom-0">
                  </div>
                </div>
              )
              : (
                <div className="flex gap-[30px] relative px-4 md:mx-auto">
                  <div
                    className="text-16px md:text-18px leading-150%"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

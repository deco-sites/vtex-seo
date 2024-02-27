import { SendEventOnView } from "$store/components/Analytics.tsx";
import { Layout as CardLayout } from "$store/components/product/ProductCard.tsx";
import Filters from "$store/components/search/Filters.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import SearchControls from "$store/islands/SearchControls.tsx";
import { useId } from "$store/sdk/useId.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import type { ProductListingPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductGallery, { Columns } from "../product/ProductGallery.tsx";
import { AppContext } from "../../apps/site.ts";
import HeroSeo from "./HeroSeo.tsx";

export interface Layout {
  /**
   * @description Use drawer for mobile like behavior on desktop. Aside for rendering the filters alongside the products
   */
  variant?: "aside" | "drawer";
  /**
   * @description Number of products per line on grid
   */
  columns?: Columns;
}

export interface HeroTop {
  title?: string;
  activeTitle?: boolean;
  placement?: "Left" | "Center";
  /** @format html */
  description?: string;
  activeReadMore?: boolean;
}

export interface HeroBottom {
  /** @format html */
  description?: string;
  activeReadMore?: boolean;
}

export interface Props {
  /** @title Integration */
  page?: ProductListingPage | null;
  layout?: Layout;
  cardLayout?: CardLayout;

  /** @description 0 for ?page=0 as your first page */
  startingPage?: 0 | 1;

  /** @description max nunber of items in pagination */
  maxVisiblePages?: number;
  heroSeo?: typeof HeroSeo;
  heroTop?: HeroTop;
  heroBottom?: HeroBottom;
}

function NotFound() {
  return (
    <div class="w-full flex justify-center items-center py-10">
      <span>Not Found!</span>
    </div>
  );
}

export const loader = (
  props: Props,
  _req: Request,
  ctx: AppContext,
) => {
  if (!props.page || !props.page.products.length) {
    ctx.response.status = 404;
  }

  return { ...props };
};

function Result({
  page,
  layout,
  cardLayout,
  startingPage = 0,
  maxVisiblePages = 5,
  heroSeo,
  heroTop = { activeTitle: true },
  heroBottom,
}: Omit<Props, "page"> & { page: ProductListingPage }) {
  const { products, filters, breadcrumb, pageInfo, sortOptions, seo } = page;
  const perPage = pageInfo.recordPerPage || products.length;
  const categoryName = breadcrumb.itemListElement?.at(-1)?.name;

  // Resolver tipagem
  //   const hasFilter = filters.some((filter) =>
  //   filter.values.some((value) => value.selected)
  // );
  const regex = /&filter\.[^&=]+/g;

  const hasFilter = pageInfo.nextPage
    ? pageInfo.nextPage?.match(regex)
    : pageInfo.previousPage?.match(regex);

  const currentPage = pageInfo.currentPage ?? 1;
  const totalPages = pageInfo.recordPerPage
    ? pageInfo?.records && Math.round(pageInfo.records / pageInfo.recordPerPage)
    : 0;

  const id = useId();

  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;

  const pages = [];
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(
    totalPages ? totalPages : 0,
    startPage + maxVisiblePages - 1,
  );

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <>
      <HeroSeo
        {...{
          ...heroSeo,
          categoryName: categoryName,
          title: heroTop?.title,
          activeTitle: heroTop?.activeTitle,
          placement: heroTop?.placement,
          activeReadMore: heroTop?.activeReadMore,
          description: heroTop?.description,
        }}
      />
      <div class="container px-4 sm:py-10">
        <SearchControls
          sortOptions={sortOptions}
          filters={filters}
          breadcrumb={breadcrumb}
          displayFilter={layout?.variant === "drawer"}
        />

        <div class="flex flex-row">
          {layout?.variant === "aside" && filters.length > 0 && (
            <aside class="hidden sm:block w-min min-w-[250px]">
              <Filters filters={filters} />
            </aside>
          )}
          <div class="flex-grow" id={id}>
            <ProductGallery
              products={products}
              offset={offset}
              layout={{ card: cardLayout, columns: layout?.columns }}
            />
          </div>
        </div>

        {!hasFilter
          ? (
            <div class="flex justify-center my-4">
              <div class="join gap-2">
                <a
                  aria-label="previous page link"
                  disabled={currentPage <= 1}
                  rel="prev"
                  href={currentPage <= 2
                    ? seo?.canonical?.split("?")[0]
                    : `?page=${currentPage - 1}`}
                  class="btn bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow"
                >
                  <Icon id="ChevronLeft" size={24} strokeWidth={2} />
                </a>
                {pages.map((pageNumber) => (
                  <a
                    key={pageNumber}
                    href={pageNumber <= 1
                      ? seo?.canonical?.split("?")[0]
                      : `?page=${pageNumber}`}
                    disabled={currentPage == pageNumber}
                    class="mx-1 btn bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow"
                  >
                    {pageNumber}
                  </a>
                ))}
                <a
                  aria-label="next page link"
                  disabled={totalPages ? currentPage >= totalPages : true}
                  rel="next"
                  href={`?page=${currentPage + 1}`}
                  class="btn bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow"
                >
                  <Icon id="ChevronRight" size={24} strokeWidth={2} />
                </a>
              </div>
            </div>
          )
          : (
            <div class="flex justify-center my-4">
              <div class="join gap-2">
                <a
                  aria-label="previous page link"
                  disabled={currentPage <= 1}
                  rel="prev"
                  href={pageInfo.previousPage}
                  class="btn bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow"
                >
                  <Icon id="ChevronLeft" size={24} strokeWidth={2} />
                </a>
                {pages.map((pageNumber) => (
                  <a
                    key={pageNumber}
                    href={pageInfo.nextPage
                      ? pageInfo.nextPage?.split("&page=")[0] +
                        `&page=${pageNumber}`
                      : pageInfo.previousPage?.split("&page=")[0] +
                        `&page=${pageNumber}`}
                    disabled={currentPage == pageNumber}
                    class="mx-1 btn bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow"
                  >
                    {pageNumber}
                  </a>
                ))}
                <a
                  aria-label="next page link"
                  disabled={totalPages ? currentPage >= totalPages : true}
                  rel="next"
                  href={pageInfo.nextPage}
                  class="btn bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-2 border border-gray-400 rounded shadow"
                >
                  <Icon id="ChevronRight" size={24} strokeWidth={2} />
                </a>
              </div>
            </div>
          )}
      </div>
      <HeroSeo
        {...{
          ...heroSeo,
          activeReadMore: heroBottom?.activeReadMore,
          description: heroBottom?.description,
        }}
      />
      <SendEventOnView
        id={id}
        event={{
          name: "view_item_list",
          params: {
            // TODO: get category name from search or cms setting
            item_list_name: breadcrumb.itemListElement?.at(-1)?.name,
            item_list_id: breadcrumb.itemListElement?.at(-1)?.item,
            items: page.products?.map((product, index) =>
              mapProductToAnalyticsItem({
                ...(useOffer(product.offers)),
                index: offset + index,
                product,
                breadcrumbList: page.breadcrumb,
              })
            ),
          },
        }}
      />
    </>
  );
}

function SearchResult({ page, ...props }: Props) {
  if (!page || !page.products.length) {
    return <NotFound />;
  }

  return <Result {...props} page={page} />;
}

export default SearchResult;

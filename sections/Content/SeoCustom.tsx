import { Head } from "$fresh/runtime.ts";

export interface jsonLdOrganizationProps {
  jsonOrganization: {
    url: string;
    sameAs: string[];
    logo: string;
    name: string;
    description: string;
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      addressCountry: string;
      postalCode: string;
    };
    email: string;
    telephone: string;
  };
}

export interface jsonLdWebsiteProps {
  jsonWebsite: {
    name: string;
    url: string;
    potentialAction: {
      target: string;
      queryInput: string;
    };
  };
}

export interface Props {
  organizationData?: jsonLdOrganizationProps;
  websiteData?: jsonLdWebsiteProps;
}

export default function SeoCustom({
  organizationData,
  websiteData,
}: Props) {
  const jsonDataOrganization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    ...(organizationData?.jsonOrganization?.url &&
      { url: organizationData.jsonOrganization.url }),
    ...(organizationData?.jsonOrganization?.logo &&
      { logo: organizationData.jsonOrganization.logo }),
    ...(organizationData?.jsonOrganization?.name &&
      { name: organizationData.jsonOrganization.name }),
    ...(organizationData?.jsonOrganization?.description &&
      { description: organizationData.jsonOrganization.description }),
    address: {
      "@type": "PostalAddress",
      ...(organizationData?.jsonOrganization?.address?.streetAddress &&
        {
          streetAddress:
            organizationData.jsonOrganization.address.streetAddress,
        }),
      ...(organizationData?.jsonOrganization?.address?.addressLocality &&
        {
          addressLocality:
            organizationData.jsonOrganization.address.addressLocality,
        }),
      ...(organizationData?.jsonOrganization?.address?.addressRegion &&
        {
          addressRegion:
            organizationData.jsonOrganization.address.addressRegion,
        }),
      ...(organizationData?.jsonOrganization?.address?.addressCountry &&
        {
          addressCountry:
            organizationData.jsonOrganization.address.addressCountry,
        }),
      ...(organizationData?.jsonOrganization?.address?.postalCode &&
        { postalCode: organizationData.jsonOrganization.address.postalCode }),
    },
    ...(organizationData?.jsonOrganization?.email &&
      { email: organizationData.jsonOrganization.email }),
    ...(organizationData?.jsonOrganization?.telephone &&
      { telephone: organizationData.jsonOrganization.telephone }),
    ...(organizationData?.jsonOrganization?.sameAs &&
      { sameAs: organizationData.jsonOrganization.sameAs }),
  };

  const jsonDataWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    ...(websiteData?.jsonWebsite?.name &&
      { name: websiteData.jsonWebsite.name }),
    ...(websiteData?.jsonWebsite?.url && { url: websiteData.jsonWebsite.url }),
    potentialAction: {
      "@type": "SearchAction",
      ...(websiteData?.jsonWebsite?.potentialAction?.target &&
        { target: websiteData.jsonWebsite.potentialAction.target }),
      ...(websiteData?.jsonWebsite?.potentialAction?.queryInput &&
        { "query-input": websiteData.jsonWebsite.potentialAction.queryInput }),
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonDataWebsite),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonDataOrganization),
        }}
      />
    </Head>
  );
}

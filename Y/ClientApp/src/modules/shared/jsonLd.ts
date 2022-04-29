import { Product } from "src/store/products/products.model";

export class JsonLdProductSchema {
  public schema = {
    "@context": "http://schema.org",
    "@type": "Product",
    name: "",
    image: "",
    description: "",
    url: "http://y.jewelry/",
    category: "",
    sku: "",
    brand: {
      "@type": "Brand",
      name: "Y",
      description:
        "Y is an ever-changing language that allows you to tell your story with beautifully crafted silver charms."
    },
    offers: {
      "@type": "Offer",
      price: "",
      priceCurrency: "INR"
    },
    additionalType: "jewelry"
  };

  /**
   *
   */
  constructor(input: Product, category: string, category_sename: string) {
    this.schema["name"] = input.name;
    this.schema["offers"]["price"] = input.price_model
      ? input.price_model.price_with_discount_without_formatting.toString()
      : "";
    this.schema["category"] = category || "charm";
    this.schema["sku"] = input.sku;
    this.schema["url"] = this.schema["url"] + "/" + input.se_name;
    this.schema["image"] = input.images
      ? input.images.filter(
          item =>
            item.title !== "ConfigurationImage" &&
            item.title !== "ConfigurationImage2" &&
            item.title !== "Spinner"
        )[0].src
      : "";
    this.schema["description"] = input.short_description;
  }
}

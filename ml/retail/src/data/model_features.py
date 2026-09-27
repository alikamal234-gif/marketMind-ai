PRICE_TARGET = "price"


# =============================================================
# Features excluded from the ML dataset
# =============================================================

PRICE_EXCLUDED = [
    # Price-related columns that can leak the target
    "original_price",
    "discount_price",
    "discount_percentage",
    "price_difference",

    # Identifiers
    "product_id",
    "store_id",

    # URLs / technical fields
    "product_url",
    "image_url",
    "scraped_at",

    # Location fields
    "city",
    "region",
    "store_address",
    "location",
]


# =============================================================
# Features used by the price prediction model
# =============================================================

PRICE_FEATURES = [
    # ---------------------------------------------------------
    # Product categorical information
    # ---------------------------------------------------------
    "category",
    "brand",
    "subcategory",
    "unit",
    "quantity",
    "availability",

    # ---------------------------------------------------------
    # Promotion information
    # ---------------------------------------------------------
    "promotion",
    "promotion_type",
    "source_retailer",
    "advertised_in_flyer",

    # ---------------------------------------------------------
    # Date information
    # ---------------------------------------------------------
    "year",
    "month",
    "day_of_week",

    # ---------------------------------------------------------
    # Product-name information
    # ---------------------------------------------------------
    "product_name_length",
    "product_name_word_count",

    # Numeric information extracted from product names
    "product_name_first_number",
    "product_name_number_count",

    # Product specifications
    "has_4k",
    "has_uhd",
    "has_smart_tv",
    "has_no_frost",

    # ---------------------------------------------------------
    # Availability of quantity/unit information
    # ---------------------------------------------------------
    "has_quantity",
    "has_unit",
]


# =============================================================
# Reduced feature set for ablation experiments
# =============================================================

PRICE_FEATURES_NO_NAME = [
    feature
    for feature in PRICE_FEATURES
    if feature not in [
        "product_name_length",
        "product_name_word_count",
        "product_name_first_number",
        "product_name_number_count",
        "has_4k",
        "has_uhd",
        "has_smart_tv",
        "has_no_frost",
    ]
]
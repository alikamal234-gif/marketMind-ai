import re
import pandas as pd


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create ML features from the cleaned retail dataset.
    """

    df = df.copy()

    # ---------------------------------------------------------
    # 1. Normalize empty categorical values
    # ---------------------------------------------------------

    categorical_columns = [
        "category",
        "brand",
        "subcategory",
        "unit",
        "quantity",
        "availability",
        "promotion_type",
        "source",
        "observation_method",
    ]

    for column in categorical_columns:
        if column in df.columns:
            df[column] = (
                df[column]
                .fillna("")
                .astype(str)
                .str.strip()
                .replace("", "Unknown")
            )

    # ---------------------------------------------------------
    # 2. Normalize retailer/source
    # ---------------------------------------------------------

    if "source" in df.columns:
        df["source_retailer"] = df["source"].apply(
            lambda x: (
                "Aswak Assalam"
                if "aswakassalam.com" in x
                else "BIM"
                if "bim.ma" in x
                else "Other"
            )
        )

    # ---------------------------------------------------------
    # 3. Date features
    # ---------------------------------------------------------

    if "date" in df.columns:
        df["year"] = df["date"].dt.year
        df["month"] = df["date"].dt.month
        df["day"] = df["date"].dt.day
        df["day_of_week"] = df["date"].dt.dayofweek

    # ---------------------------------------------------------
    # 4. Price features
    # ---------------------------------------------------------

    if "original_price" in df.columns and "price" in df.columns:
        df["price_difference"] = (
            df["original_price"] - df["price"]
        )

    # ---------------------------------------------------------
    # 5. Product-name features
    # ---------------------------------------------------------

    if "product_name" in df.columns:

        # Basic text features
        df["product_name_length"] = (
            df["product_name"]
            .fillna("")
            .str.len()
        )

        df["product_name_word_count"] = (
            df["product_name"]
            .fillna("")
            .str.split()
            .str.len()
        )

        # -----------------------------------------------------
        # Numeric information
        # -----------------------------------------------------

        df["product_name_first_number"] = (
            df["product_name"]
            .apply(extract_first_number)
        )

        df["product_name_number_count"] = (
            df["product_name"]
            .apply(
                lambda x: len(extract_numbers(x))
            )
        )

        # -----------------------------------------------------
        # Product specifications
        # -----------------------------------------------------

        df["has_4k"] = (
            df["product_name"]
            .apply(
                lambda x: has_keyword(
                    x,
                    ["4k"],
                )
            )
            .astype(int)
        )

        df["has_uhd"] = (
            df["product_name"]
            .apply(
                lambda x: has_keyword(
                    x,
                    ["uhd"],
                )
            )
            .astype(int)
        )

        df["has_smart_tv"] = (
            df["product_name"]
            .apply(
                lambda x: has_keyword(
                    x,
                    [
                        "smart tv",
                        "smart-tv",
                        "smart",
                    ],
                )
            )
            .astype(int)
        )

        df["has_no_frost"] = (
            df["product_name"]
            .apply(
                lambda x: has_keyword(
                    x,
                    [
                        "no frost",
                        "nofrost",
                    ],
                )
            )
            .astype(int)
        )

    # ---------------------------------------------------------
    # 6. Quantity / unit availability
    # ---------------------------------------------------------

    if "quantity" in df.columns:
        df["has_quantity"] = (
            df["quantity"].ne("Unknown")
        ).astype(int)

    if "unit" in df.columns:
        df["has_unit"] = (
            df["unit"].ne("Unknown")
        ).astype(int)

    # ---------------------------------------------------------
    # 7. Promotion flag
    # ---------------------------------------------------------

    if "promotion" in df.columns:
        df["promotion_flag"] = (
            df["promotion"].astype(int)
        )

    # ---------------------------------------------------------
    # 8. Discount availability
    # ---------------------------------------------------------

    if "discount_percentage" in df.columns:
        df["has_discount"] = (
            df["discount_percentage"].notna()
        ).astype(int)

    if "original_price" in df.columns:
        df["has_original_price"] = (
            df["original_price"].notna()
        ).astype(int)

    return df


# =============================================================
# Helper functions
# =============================================================

def extract_first_number(text):
    """
    Extract the first numeric value from a product name.

    Examples:
        'SAMSUNG TV 55 4K' -> 55.0
        'REFRIGERATOR 340L' -> 340.0
        'PACK 6 X 1L' -> 6.0
    """

    if pd.isna(text):
        return None

    match = re.search(
        r"\d+(?:[.,]\d+)?",
        str(text),
    )

    if match:
        return float(
            match.group().replace(",", ".")
        )

    return None


def extract_numbers(text):
    """
    Extract all numeric values from a product name.

    Examples:
        'TV 55 4K 2025' -> [55.0, 4.0, 2025.0]
        'PACK 6 X 1L' -> [6.0, 1.0]
    """

    if pd.isna(text):
        return []

    matches = re.findall(
        r"\d+(?:[.,]\d+)?",
        str(text),
    )

    return [
        float(value.replace(",", "."))
        for value in matches
    ]


def has_keyword(text, keywords):
    """
    Check whether a product name contains
    one of the specified keywords.
    """

    if pd.isna(text):
        return False

    text = str(text).lower()

    return any(
        keyword.lower() in text
        for keyword in keywords
    )
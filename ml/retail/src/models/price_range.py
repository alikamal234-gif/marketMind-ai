import pandas as pd


PRICE_BINS = [
    float("-inf"),
    15,
    30,
    60,
    180,
    700,
    float("inf"),
]

PRICE_LABELS = [
    "VERY_LOW",
    "LOW",
    "MEDIUM",
    "HIGH",
    "PREMIUM",
    "LUXURY",
]


def create_price_ranges(y):
    """
    Convert numerical prices into price-range categories.
    """

    return pd.cut(
        y,
        bins=PRICE_BINS,
        labels=PRICE_LABELS,
        include_lowest=True,
    )


def get_price_range_distribution(y):
    """
    Return the distribution of price-range classes.
    """

    ranges = create_price_ranges(y)

    counts = ranges.value_counts().sort_index()

    percentages = (
        ranges.value_counts(normalize=True)
        .sort_index()
        * 100
    )

    return counts, percentages

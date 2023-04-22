const calculatePercentRating = (reviewsArray, rating) => {
    if (reviewsArray.length <= 0) return 0;

    const reviewsLength = reviewsArray.length;
    const ratingFilterLength = reviewsArray.filter(
        (review) => review.rating === rating
    ).length;

    return Math.round((ratingFilterLength / reviewsLength) * 100);
};

export default calculatePercentRating;

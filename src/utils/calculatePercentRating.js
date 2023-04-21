const calculatePercentRating = (reviewsArray, rating) => {
    const reviewsLength = reviewsArray.length;
    const ratingFilterLength = reviewsArray.filter(
        (review) => review.rating === rating
    ).length;

    return Math.round((ratingFilterLength / reviewsLength) * 100);
};

export default calculatePercentRating;

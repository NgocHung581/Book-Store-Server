function calculateTotalRating(reviewsArray = []) {
    if (reviewsArray.length <= 0) return 0;

    const totalStar = reviewsArray.reduce(
        (total, review) => total + review.rating,
        0
    );
    const ratingLength = reviewsArray.length;
    const totalRating = Math.round((totalStar / ratingLength) * 10) / 10;

    return totalRating;
}

export default calculateTotalRating;

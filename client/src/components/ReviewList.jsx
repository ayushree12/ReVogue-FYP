import React from 'react';

const ReviewList = ({ reviews = [] }) => (
  <div className="space-y-4">
    {reviews.length ? (
      reviews.map((review) => (
        <div key={review._id} className="bg-white border border-slate-100 rounded-3xl p-4">
          <div className="flex justify-between text-xs uppercase text-muted">
            <span>{review.rating} / 5</span>
            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-muted mt-2">{review.comment}</p>
        </div>
      ))
    ) : (
      <p className="text-sm text-muted">No reviews yet.</p>
    )}
  </div>
);

export default ReviewList;

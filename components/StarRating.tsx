'use client';


import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export function StarRating({ name, required = false }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <React.Fragment key={star}>
          <input
            type="radio"
            id={`${name}-star-${star}`}
            name={name}
            value={star}
            required={required}
            className="hidden"
            onChange={() => setRating(star)}
          />
          <label
            htmlFor={`${name}-star-${star}`}
            className="text-2xl cursor-pointer"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <FaStar
              className={
                star <= (hover || rating)
                  ? "text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }
            />
          </label>
        </React.Fragment>
      ))}
      <input type="hidden" name="rating" value={rating} />
    </div>
  );
}
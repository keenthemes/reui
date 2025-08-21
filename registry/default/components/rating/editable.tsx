'use client';

import { useState } from 'react';
import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Rating } from '@/registry/default/ui/rating';
import { CircleAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function RatingEditableDemo() {
  const [productRating, setProductRating] = useState(0);
  const handleRatingChange = (rating: number) => {
    setProductRating(rating);

    toast.custom(
      (t) => (
        <Alert variant="mono" icon="success" close={true} onClose={() => toast.dismiss(t)}>
          <AlertIcon>
            <CircleAlert />
          </AlertIcon>
          <AlertTitle>
            Rated <span className="font-bold">{rating}</span> out of 5
          </AlertTitle>
        </Alert>
      ),
      {
        duration: 5000,
      },
    );
  };

  return (
    <div className="space-y-8">
      <Rating rating={productRating} editable={true} onRatingChange={handleRatingChange} showValue={true} />
    </div>
  );
}

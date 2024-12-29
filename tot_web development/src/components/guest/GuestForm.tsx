import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Timer } from 'lucide-react';
import { Button } from '../../components/common/button';
import { Input } from '../common/InputField';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { AUTH_CONSTANTS } from '../../utils/constants';

const guestSchema = z.object({
  tableNumber: z.number()
    .min(1, 'Table number must be at least 1')
    .max(AUTH_CONSTANTS.MAX_TABLE_NUMBER, `Table number cannot exceed ${AUTH_CONSTANTS.MAX_TABLE_NUMBER}`),
});

type GuestFormData = z.infer<typeof guestSchema>;

export function GuestForm() {
  const [showTimer, setShowTimer] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
  });

  const onSubmit = async (data: GuestFormData) => {
    // TODO: Implement guest mode logic
    console.log(data);
    setShowTimer(true);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Timer className="h-4 w-4" />
        <AlertDescription>
          Guest mode is limited to 3 hours per day. You'll need to enter your table number to continue.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tableNumber">Table Number</Label>
          <Input
                      label={''} id="tableNumber"
                      type="number"
                      min={1}
                      max={AUTH_CONSTANTS.MAX_TABLE_NUMBER}
                      {...register('tableNumber', { valueAsNumber: true })}          />
          {errors.tableNumber && (
            <p className="text-sm text-destructive">{errors.tableNumber.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Starting session...' : 'Start guest session'}
        </Button>
      </form>

      {showTimer && (
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Session time remaining:</p>
          <p className="text-2xl font-bold">03:00:00</p>
        </div>
      )}
    </div>
  );
}
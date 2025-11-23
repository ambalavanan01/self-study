import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../services/firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordForm) => {
        try {
            setMessage('');
            setError('');
            await sendPasswordResetEmail(auth, data.email);
            setMessage('Check your inbox for further instructions');
        } catch (err: any) {
            setError('Failed to reset password. ' + err.message);
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Remember your password?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-primary/90">
                            Sign in
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <Input
                            label="Email address"
                            type="email"
                            autoComplete="email"
                            error={errors.email?.message}
                            {...register('email')}
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            {message}
                        </div>
                    )}

                    <Button type="submit" className="w-full" isLoading={isSubmitting}>
                        Reset Password
                    </Button>
                </form>
            </div>
        </div>
    );
}

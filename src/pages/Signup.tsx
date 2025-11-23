import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupForm) => {
        try {
            setError('');
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: data.name,
            });

            // Create user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: data.name,
                email: data.email,
                createdAt: new Date().toISOString(),
                preferences: {
                    darkMode: false,
                }
            });

            navigate('/dashboard');
        } catch (err: any) {
            setError('Failed to create an account. ' + err.message);
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-primary/90">
                            Sign in
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <Input
                            label="Full Name"
                            type="text"
                            autoComplete="name"
                            error={errors.name?.message}
                            {...register('name')}
                        />
                        <Input
                            label="Email address"
                            type="email"
                            autoComplete="email"
                            error={errors.email?.message}
                            {...register('email')}
                        />
                        <Input
                            label="Password"
                            type="password"
                            autoComplete="new-password"
                            error={errors.password?.message}
                            {...register('password')}
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            autoComplete="new-password"
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" isLoading={isSubmitting}>
                        Sign up
                    </Button>
                </form>
            </div>
        </div>
    );
}

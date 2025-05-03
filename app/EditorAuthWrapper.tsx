// components/EditorAuthWrapper.tsx
'use client'
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './redux/store';
import { verifyToken } from './redux/slices/tokenSlice';
import { initializeWorkspace } from './redux/slices/editorSlice';
import { useLoading } from './context/LoadingContext';

export default function EditorAuthWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {setLoading} = useLoading(); 
  const { isVerified, error, user } = useSelector((state: RootState) => state.token);

  useEffect(() => {
    const token = searchParams.get('token');
    console.log('Token from URL:', token);
    console.log('Token verification flow:', { token, isVerified });
    if (!token) {
      console.error('No token found in URL');
      router.push('/unauthorized');
      return;
    }

    if (!isVerified) {
      setLoading(true); // Set loading state to true
      dispatch(verifyToken(token)) .unwrap()
      .catch((err) => {
        console.error('Token verification failed:', err);
        router.push('/unauthorized');
      });
    }
    else {
      setLoading(false); // Set loading state to false
    }
  }, [dispatch, isVerified, searchParams, router]);

  useEffect(() => {
    if (error) router.push('/unauthorized');
    if (isVerified && user) {
      // Using _id for both workspaceId and userId
      dispatch(initializeWorkspace({
        workspaceId: user._id,
        userId: user._id
      }));
      localStorage.setItem('editorToken', searchParams.get('token') || '');
    }
  }, [error, isVerified, user, dispatch, router, searchParams]);

  if (!isVerified) return <div>Loading editor...</div>;
  return <>{children}</>;
}